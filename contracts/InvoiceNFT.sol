// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title InvoiceNFT
 * @dev NFT representation of invoices for enhanced composability and transferability
 * @author Rubikcon
 * @notice Each invoice can be minted as an NFT for proof of work and potential trading
 */
contract InvoiceNFT is ERC721, ERC721URIStorage, AccessControl, Pausable {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    Counters.Counter private _tokenIdCounter;

    // Mapping from token ID to invoice hash
    mapping(uint256 => bytes32) public tokenToInvoiceHash;
    mapping(bytes32 => uint256) public invoiceHashToToken;

    // Invoice metadata
    struct InvoiceMetadata {
        bytes32 invoiceHash;
        address freelancer;
        address employer;
        uint256 amount;
        address token;
        string description;
        uint256 createdAt;
        bool isPaid;
    }

    mapping(uint256 => InvoiceMetadata) public invoiceMetadata;

    event InvoiceNFTMinted(
        uint256 indexed tokenId,
        bytes32 indexed invoiceHash,
        address indexed freelancer,
        address employer
    );

    constructor(address _admin, address _minter) ERC721("Invoy Invoice NFT", "INVOICE") {
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(MINTER_ROLE, _minter);
    }

    /**
     * @dev Mint an NFT for an invoice
     * @param to Address to mint the NFT to (usually the freelancer)
     * @param invoiceHash Hash of the invoice
     * @param employer Address of the employer
     * @param amount Payment amount
     * @param token Token address
     * @param description Work description
     * @param uri Metadata URI for the NFT
     */
    function mintInvoiceNFT(
        address to,
        bytes32 invoiceHash,
        address employer,
        uint256 amount,
        address token,
        string memory description,
        string memory uri
    ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        require(to != address(0), "Invalid recipient");
        require(invoiceHash != bytes32(0), "Invalid invoice hash");
        require(invoiceHashToToken[invoiceHash] == 0, "NFT already exists for this invoice");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // Store mappings
        tokenToInvoiceHash[tokenId] = invoiceHash;
        invoiceHashToToken[invoiceHash] = tokenId;

        // Store metadata
        invoiceMetadata[tokenId] = InvoiceMetadata({
            invoiceHash: invoiceHash,
            freelancer: to,
            employer: employer,
            amount: amount,
            token: token,
            description: description,
            createdAt: block.timestamp,
            isPaid: false
        });

        // Mint NFT
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit InvoiceNFTMinted(tokenId, invoiceHash, to, employer);

        return tokenId;
    }

    /**
     * @dev Update payment status of invoice NFT
     * @param tokenId Token ID of the invoice NFT
     * @param isPaid Whether the invoice has been paid
     */
    function updatePaymentStatus(uint256 tokenId, bool isPaid) external onlyRole(MINTER_ROLE) {
        require(_exists(tokenId), "Token does not exist");
        invoiceMetadata[tokenId].isPaid = isPaid;
    }

    /**
     * @dev Get invoice metadata for a token
     * @param tokenId Token ID
     * @return InvoiceMetadata struct
     */
    function getInvoiceMetadata(uint256 tokenId) external view returns (InvoiceMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return invoiceMetadata[tokenId];
    }

    /**
     * @dev Pause contract (admin only)
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause contract (admin only)
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}