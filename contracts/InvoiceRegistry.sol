// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

/**
 * @title InvoiceRegistry
 * @dev Smart contract for managing Web3 invoices with escrow functionality
 * @author Rubikcon
 * @notice This contract handles invoice registration, status management, and payment escrow
 */
contract InvoiceRegistry is AccessControl, ReentrancyGuard, Pausable, ERC165 {
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant BACKEND_ROLE = keccak256("BACKEND_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Invoice States
    enum InvoiceState {
        Pending,     // 0 - Invoice created, awaiting employer response
        Accepted,    // 1 - Employer accepted the invoice
        Rejected,    // 2 - Employer rejected the invoice
        Deposited,   // 3 - Payment deposited in escrow
        Paid,        // 4 - Payment released to freelancer
        Cancelled,   // 5 - Invoice cancelled by freelancer
        Refunded     // 6 - Payment refunded to employer
    }

    // Invoice Structure
    struct Invoice {
        bytes32 invoiceHash;
        address freelancerAddress;
        address employerAddress;
        uint256 amount;
        address tokenAddress; // 0x0 for native currency
        uint256 chainId;
        InvoiceState state;
        uint256 createdAt;
        uint256 updatedAt;
        string rejectionReason;
        bool hasEscrow;
    }

    // Storage
    mapping(bytes32 => Invoice) public invoices;
    mapping(bytes32 => uint256) public escrowBalances;
    mapping(address => bytes32[]) public freelancerInvoices;
    mapping(address => bytes32[]) public employerInvoices;
    
    // Statistics
    uint256 public totalInvoices;
    uint256 public totalPaidInvoices;
    uint256 public totalEscrowVolume;

    // Events
    event InvoiceRegistered(
        bytes32 indexed invoiceHash,
        address indexed freelancer,
        address indexed employer,
        uint256 amount,
        address token,
        uint256 chainId,
        uint256 timestamp
    );

    event InvoiceAccepted(
        bytes32 indexed invoiceHash,
        address indexed employer,
        uint256 timestamp
    );

    event InvoiceRejected(
        bytes32 indexed invoiceHash,
        address indexed employer,
        string reason,
        uint256 timestamp
    );

    event InvoicePaid(
        bytes32 indexed invoiceHash,
        address indexed payer,
        uint256 timestamp
    );

    event InvoiceCancelled(
        bytes32 indexed invoiceHash,
        address indexed canceller,
        uint256 timestamp
    );

    event PaymentDeposited(
        bytes32 indexed invoiceHash,
        address indexed depositor,
        uint256 amount,
        address token,
        uint256 timestamp
    );

    event PaymentReleased(
        bytes32 indexed invoiceHash,
        address indexed recipient,
        uint256 amount,
        address token,
        uint256 timestamp
    );

    event PaymentRefunded(
        bytes32 indexed invoiceHash,
        address indexed refundRecipient,
        uint256 amount,
        address token,
        uint256 timestamp
    );

    // Custom Errors
    error InvoiceAlreadyExists();
    error InvoiceNotFound();
    error InvalidInvoiceState();
    error UnauthorizedAccess();
    error InvalidAmount();
    error InvalidAddress();
    error InsufficientPayment();
    error TransferFailed();
    error InvalidChainId();

    /**
     * @dev Constructor sets up roles and initial configuration
     * @param _admin Address that will have admin privileges
     * @param _backend Address that will have backend privileges for automation
     */
    constructor(address _admin, address _backend) {
        if (_admin == address(0) || _backend == address(0)) {
            revert InvalidAddress();
        }

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(BACKEND_ROLE, _backend);
    }

    /**
     * @dev Register a new invoice on-chain
     * @param invoiceHash Cryptographic hash of the invoice data
     * @param freelancerAddress Address of the freelancer
     * @param employerAddress Address of the employer
     * @param amount Payment amount in wei
     * @param tokenAddress Token contract address (0x0 for native currency)
     * @param chainId Target chain ID for the invoice
     */
    function registerInvoice(
        bytes32 invoiceHash,
        address freelancerAddress,
        address employerAddress,
        uint256 amount,
        address tokenAddress,
        uint256 chainId
    ) external whenNotPaused {
        // Validate inputs
        if (invoiceHash == bytes32(0)) revert InvalidAmount();
        if (freelancerAddress == address(0) || employerAddress == address(0)) {
            revert InvalidAddress();
        }
        if (amount == 0) revert InvalidAmount();
        if (chainId == 0) revert InvalidChainId();
        if (invoices[invoiceHash].invoiceHash != bytes32(0)) {
            revert InvoiceAlreadyExists();
        }

        // Only backend or the freelancer can register invoices
        if (!hasRole(BACKEND_ROLE, msg.sender) && msg.sender != freelancerAddress) {
            revert UnauthorizedAccess();
        }

        // Create invoice
        Invoice memory newInvoice = Invoice({
            invoiceHash: invoiceHash,
            freelancerAddress: freelancerAddress,
            employerAddress: employerAddress,
            amount: amount,
            tokenAddress: tokenAddress,
            chainId: chainId,
            state: InvoiceState.Pending,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            rejectionReason: "",
            hasEscrow: false
        });

        // Store invoice
        invoices[invoiceHash] = newInvoice;
        freelancerInvoices[freelancerAddress].push(invoiceHash);
        employerInvoices[employerAddress].push(invoiceHash);
        
        totalInvoices++;

        emit InvoiceRegistered(
            invoiceHash,
            freelancerAddress,
            employerAddress,
            amount,
            tokenAddress,
            chainId,
            block.timestamp
        );
    }

    /**
     * @dev Accept an invoice (employer only)
     * @param invoiceHash Hash of the invoice to accept
     */
    function acceptInvoice(bytes32 invoiceHash) external whenNotPaused {
        Invoice storage invoice = invoices[invoiceHash];
        
        if (invoice.invoiceHash == bytes32(0)) revert InvoiceNotFound();
        if (msg.sender != invoice.employerAddress) revert UnauthorizedAccess();
        if (invoice.state != InvoiceState.Pending && invoice.state != InvoiceState.Deposited) {
            revert InvalidInvoiceState();
        }

        invoice.state = InvoiceState.Accepted;
        invoice.updatedAt = block.timestamp;

        emit InvoiceAccepted(invoiceHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Reject an invoice with reason (employer only)
     * @param invoiceHash Hash of the invoice to reject
     * @param reason Reason for rejection
     */
    function rejectInvoice(bytes32 invoiceHash, string calldata reason) external whenNotPaused {
        Invoice storage invoice = invoices[invoiceHash];
        
        if (invoice.invoiceHash == bytes32(0)) revert InvoiceNotFound();
        if (msg.sender != invoice.employerAddress) revert UnauthorizedAccess();
        if (invoice.state != InvoiceState.Pending && invoice.state != InvoiceState.Deposited) {
            revert InvalidInvoiceState();
        }

        invoice.state = InvoiceState.Rejected;
        invoice.rejectionReason = reason;
        invoice.updatedAt = block.timestamp;

        emit InvoiceRejected(invoiceHash, msg.sender, reason, block.timestamp);
    }

    /**
     * @dev Cancel an invoice (freelancer only, if pending)
     * @param invoiceHash Hash of the invoice to cancel
     */
    function cancelInvoice(bytes32 invoiceHash) external whenNotPaused {
        Invoice storage invoice = invoices[invoiceHash];
        
        if (invoice.invoiceHash == bytes32(0)) revert InvoiceNotFound();
        if (msg.sender != invoice.freelancerAddress) revert UnauthorizedAccess();
        if (invoice.state != InvoiceState.Pending) revert InvalidInvoiceState();

        invoice.state = InvoiceState.Cancelled;
        invoice.updatedAt = block.timestamp;

        emit InvoiceCancelled(invoiceHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Deposit payment into escrow (employer only)
     * @param invoiceHash Hash of the invoice to deposit payment for
     */
    function depositPayment(bytes32 invoiceHash) external payable whenNotPaused nonReentrant {
        Invoice storage invoice = invoices[invoiceHash];
        
        if (invoice.invoiceHash == bytes32(0)) revert InvoiceNotFound();
        if (msg.sender != invoice.employerAddress) revert UnauthorizedAccess();
        if (invoice.state != InvoiceState.Pending && invoice.state != InvoiceState.Accepted) {
            revert InvalidInvoiceState();
        }

        uint256 depositAmount;

        if (invoice.tokenAddress == address(0)) {
            // Native currency (ETH, MATIC, etc.)
            if (msg.value != invoice.amount) revert InsufficientPayment();
            depositAmount = msg.value;
        } else {
            // ERC-20 token
            if (msg.value != 0) revert InvalidAmount();
            IERC20 token = IERC20(invoice.tokenAddress);
            
            // Transfer tokens from employer to contract
            token.safeTransferFrom(msg.sender, address(this), invoice.amount);
            depositAmount = invoice.amount;
        }

        // Update invoice state
        invoice.state = InvoiceState.Deposited;
        invoice.hasEscrow = true;
        invoice.updatedAt = block.timestamp;
        
        // Track escrow balance
        escrowBalances[invoiceHash] = depositAmount;
        totalEscrowVolume += depositAmount;

        emit PaymentDeposited(
            invoiceHash,
            msg.sender,
            depositAmount,
            invoice.tokenAddress,
            block.timestamp
        );
    }

    /**
     * @dev Release escrowed payment to freelancer
     * @param invoiceHash Hash of the invoice to release payment for
     */
    function releasePayment(bytes32 invoiceHash) external whenNotPaused nonReentrant {
        Invoice storage invoice = invoices[invoiceHash];
        
        if (invoice.invoiceHash == bytes32(0)) revert InvoiceNotFound();
        if (invoice.state != InvoiceState.Accepted && invoice.state != InvoiceState.Deposited) {
            revert InvalidInvoiceState();
        }
        if (!invoice.hasEscrow) revert InvalidInvoiceState();
        
        // Only employer or backend can release payment
        if (msg.sender != invoice.employerAddress && !hasRole(BACKEND_ROLE, msg.sender)) {
            revert UnauthorizedAccess();
        }

        uint256 amount = escrowBalances[invoiceHash];
        if (amount == 0) revert InvalidAmount();

        // Update state before transfer (CEI pattern)
        invoice.state = InvoiceState.Paid;
        invoice.updatedAt = block.timestamp;
        escrowBalances[invoiceHash] = 0;
        totalPaidInvoices++;

        // Transfer payment
        if (invoice.tokenAddress == address(0)) {
            // Native currency
            (bool success, ) = invoice.freelancerAddress.call{value: amount}("");
            if (!success) revert TransferFailed();
        } else {
            // ERC-20 token
            IERC20 token = IERC20(invoice.tokenAddress);
            token.safeTransfer(invoice.freelancerAddress, amount);
        }

        emit PaymentReleased(
            invoiceHash,
            invoice.freelancerAddress,
            amount,
            invoice.tokenAddress,
            block.timestamp
        );

        emit InvoicePaid(invoiceHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Refund escrowed payment to employer (if invoice rejected)
     * @param invoiceHash Hash of the invoice to refund payment for
     */
    function refundPayment(bytes32 invoiceHash) external whenNotPaused nonReentrant {
        Invoice storage invoice = invoices[invoiceHash];
        
        if (invoice.invoiceHash == bytes32(0)) revert InvoiceNotFound();
        if (invoice.state != InvoiceState.Rejected) revert InvalidInvoiceState();
        if (!invoice.hasEscrow) revert InvalidInvoiceState();
        
        // Only employer or backend can initiate refund
        if (msg.sender != invoice.employerAddress && !hasRole(BACKEND_ROLE, msg.sender)) {
            revert UnauthorizedAccess();
        }

        uint256 amount = escrowBalances[invoiceHash];
        if (amount == 0) revert InvalidAmount();

        // Update state before transfer (CEI pattern)
        invoice.state = InvoiceState.Refunded;
        invoice.updatedAt = block.timestamp;
        escrowBalances[invoiceHash] = 0;

        // Transfer refund
        if (invoice.tokenAddress == address(0)) {
            // Native currency
            (bool success, ) = invoice.employerAddress.call{value: amount}("");
            if (!success) revert TransferFailed();
        } else {
            // ERC-20 token
            IERC20 token = IERC20(invoice.tokenAddress);
            token.safeTransfer(invoice.employerAddress, amount);
        }

        emit PaymentRefunded(
            invoiceHash,
            invoice.employerAddress,
            amount,
            invoice.tokenAddress,
            block.timestamp
        );
    }

    /**
     * @dev Mark invoice as paid without escrow (for external payments)
     * @param invoiceHash Hash of the invoice to mark as paid
     */
    function markAsPaid(bytes32 invoiceHash) external whenNotPaused {
        Invoice storage invoice = invoices[invoiceHash];
        
        if (invoice.invoiceHash == bytes32(0)) revert InvoiceNotFound();
        if (invoice.state != InvoiceState.Accepted) revert InvalidInvoiceState();
        
        // Only employer or backend can mark as paid
        if (msg.sender != invoice.employerAddress && !hasRole(BACKEND_ROLE, msg.sender)) {
            revert UnauthorizedAccess();
        }

        invoice.state = InvoiceState.Paid;
        invoice.updatedAt = block.timestamp;
        totalPaidInvoices++;

        emit InvoicePaid(invoiceHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Get invoice details
     * @param invoiceHash Hash of the invoice
     * @return Invoice struct
     */
    function getInvoice(bytes32 invoiceHash) external view returns (Invoice memory) {
        if (invoices[invoiceHash].invoiceHash == bytes32(0)) revert InvoiceNotFound();
        return invoices[invoiceHash];
    }

    /**
     * @dev Get invoices for a freelancer
     * @param freelancer Address of the freelancer
     * @return Array of invoice hashes
     */
    function getFreelancerInvoices(address freelancer) external view returns (bytes32[] memory) {
        return freelancerInvoices[freelancer];
    }

    /**
     * @dev Get invoices for an employer
     * @param employer Address of the employer
     * @return Array of invoice hashes
     */
    function getEmployerInvoices(address employer) external view returns (bytes32[] memory) {
        return employerInvoices[employer];
    }

    /**
     * @dev Get contract statistics
     * @return totalInvoices, totalPaidInvoices, totalEscrowVolume
     */
    function getStatistics() external view returns (uint256, uint256, uint256) {
        return (totalInvoices, totalPaidInvoices, totalEscrowVolume);
    }

    /**
     * @dev Check if invoice exists
     * @param invoiceHash Hash of the invoice
     * @return bool indicating if invoice exists
     */
    function invoiceExists(bytes32 invoiceHash) external view returns (bool) {
        return invoices[invoiceHash].invoiceHash != bytes32(0);
    }

    /**
     * @dev Emergency pause function (admin only)
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause function (admin only)
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Emergency withdrawal function (admin only, for stuck funds)
     * @param token Token address (0x0 for native currency)
     * @param amount Amount to withdraw
     * @param recipient Recipient address
     */
    function emergencyWithdraw(
        address token,
        uint256 amount,
        address recipient
    ) external onlyRole(ADMIN_ROLE) {
        if (recipient == address(0)) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();

        if (token == address(0)) {
            (bool success, ) = recipient.call{value: amount}("");
            if (!success) revert TransferFailed();
        } else {
            IERC20(token).safeTransfer(recipient, amount);
        }
    }

    /**
     * @dev Support for ERC165 interface detection
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Receive function to accept native currency
     */
    receive() external payable {
        // Allow contract to receive native currency for escrow
    }
}