const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InvoiceRegistry", function () {
  let InvoiceRegistry;
  let invoiceRegistry;
  let MockERC20;
  let mockToken;
  let admin, backend, freelancer, employer, other;
  let invoiceHash;

  beforeEach(async function () {
    // Get signers
    [admin, backend, freelancer, employer, other] = await ethers.getSigners();

    // Deploy mock ERC20 token
    MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("Test Token", "TEST", ethers.utils.parseEther("1000000"));
    await mockToken.deployed();

    // Deploy InvoiceRegistry
    InvoiceRegistry = await ethers.getContractFactory("InvoiceRegistry");
    invoiceRegistry = await InvoiceRegistry.deploy(admin.address, backend.address);
    await invoiceRegistry.deployed();

    // Generate test invoice hash
    invoiceHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["string", "address", "address", "uint256"],
        ["Test Invoice", freelancer.address, employer.address, ethers.utils.parseEther("1")]
      )
    );

    // Give employer some tokens
    await mockToken.transfer(employer.address, ethers.utils.parseEther("100"));
  });

  describe("Invoice Registration", function () {
    it("Should register a new invoice successfully", async function () {
      await expect(
        invoiceRegistry.connect(backend).registerInvoice(
          invoiceHash,
          freelancer.address,
          employer.address,
          ethers.utils.parseEther("1"),
          ethers.constants.AddressZero, // Native currency
          1 // Ethereum mainnet
        )
      ).to.emit(invoiceRegistry, "InvoiceRegistered")
        .withArgs(
          invoiceHash,
          freelancer.address,
          employer.address,
          ethers.utils.parseEther("1"),
          ethers.constants.AddressZero,
          1,
          await ethers.provider.getBlock("latest").then(b => b.timestamp + 1)
        );

      const invoice = await invoiceRegistry.getInvoice(invoiceHash);
      expect(invoice.freelancerAddress).to.equal(freelancer.address);
      expect(invoice.employerAddress).to.equal(employer.address);
      expect(invoice.amount).to.equal(ethers.utils.parseEther("1"));
      expect(invoice.state).to.equal(0); // Pending
    });

    it("Should prevent duplicate invoice registration", async function () {
      await invoiceRegistry.connect(backend).registerInvoice(
        invoiceHash,
        freelancer.address,
        employer.address,
        ethers.utils.parseEther("1"),
        ethers.constants.AddressZero,
        1
      );

      await expect(
        invoiceRegistry.connect(backend).registerInvoice(
          invoiceHash,
          freelancer.address,
          employer.address,
          ethers.utils.parseEther("1"),
          ethers.constants.AddressZero,
          1
        )
      ).to.be.revertedWithCustomError(invoiceRegistry, "InvoiceAlreadyExists");
    });

    it("Should reject invalid inputs", async function () {
      await expect(
        invoiceRegistry.connect(backend).registerInvoice(
          ethers.constants.HashZero,
          freelancer.address,
          employer.address,
          ethers.utils.parseEther("1"),
          ethers.constants.AddressZero,
          1
        )
      ).to.be.revertedWithCustomError(invoiceRegistry, "InvalidAmount");

      await expect(
        invoiceRegistry.connect(backend).registerInvoice(
          invoiceHash,
          ethers.constants.AddressZero,
          employer.address,
          ethers.utils.parseEther("1"),
          ethers.constants.AddressZero,
          1
        )
      ).to.be.revertedWithCustomError(invoiceRegistry, "InvalidAddress");
    });
  });

  describe("Invoice State Management", function () {
    beforeEach(async function () {
      await invoiceRegistry.connect(backend).registerInvoice(
        invoiceHash,
        freelancer.address,
        employer.address,
        ethers.utils.parseEther("1"),
        ethers.constants.AddressZero,
        1
      );
    });

    it("Should allow employer to accept invoice", async function () {
      await expect(
        invoiceRegistry.connect(employer).acceptInvoice(invoiceHash)
      ).to.emit(invoiceRegistry, "InvoiceAccepted")
        .withArgs(invoiceHash, employer.address, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));

      const invoice = await invoiceRegistry.getInvoice(invoiceHash);
      expect(invoice.state).to.equal(1); // Accepted
    });

    it("Should allow employer to reject invoice with reason", async function () {
      const reason = "Work not completed as specified";
      
      await expect(
        invoiceRegistry.connect(employer).rejectInvoice(invoiceHash, reason)
      ).to.emit(invoiceRegistry, "InvoiceRejected")
        .withArgs(invoiceHash, employer.address, reason, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));

      const invoice = await invoiceRegistry.getInvoice(invoiceHash);
      expect(invoice.state).to.equal(2); // Rejected
      expect(invoice.rejectionReason).to.equal(reason);
    });

    it("Should allow freelancer to cancel pending invoice", async function () {
      await expect(
        invoiceRegistry.connect(freelancer).cancelInvoice(invoiceHash)
      ).to.emit(invoiceRegistry, "InvoiceCancelled")
        .withArgs(invoiceHash, freelancer.address, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));

      const invoice = await invoiceRegistry.getInvoice(invoiceHash);
      expect(invoice.state).to.equal(5); // Cancelled
    });

    it("Should prevent unauthorized state changes", async function () {
      await expect(
        invoiceRegistry.connect(other).acceptInvoice(invoiceHash)
      ).to.be.revertedWithCustomError(invoiceRegistry, "UnauthorizedAccess");

      await expect(
        invoiceRegistry.connect(freelancer).acceptInvoice(invoiceHash)
      ).to.be.revertedWithCustomError(invoiceRegistry, "UnauthorizedAccess");
    });
  });

  describe("Payment Escrow", function () {
    beforeEach(async function () {
      await invoiceRegistry.connect(backend).registerInvoice(
        invoiceHash,
        freelancer.address,
        employer.address,
        ethers.utils.parseEther("1"),
        ethers.constants.AddressZero,
        1
      );
    });

    it("Should allow employer to deposit native currency payment", async function () {
      const amount = ethers.utils.parseEther("1");
      
      await expect(
        invoiceRegistry.connect(employer).depositPayment(invoiceHash, { value: amount })
      ).to.emit(invoiceRegistry, "PaymentDeposited")
        .withArgs(
          invoiceHash,
          employer.address,
          amount,
          ethers.constants.AddressZero,
          await ethers.provider.getBlock("latest").then(b => b.timestamp + 1)
        );

      const invoice = await invoiceRegistry.getInvoice(invoiceHash);
      expect(invoice.state).to.equal(3); // Deposited
      expect(invoice.hasEscrow).to.be.true;
      
      const escrowBalance = await invoiceRegistry.escrowBalances(invoiceHash);
      expect(escrowBalance).to.equal(amount);
    });

    it("Should allow employer to deposit ERC20 token payment", async function () {
      const amount = ethers.utils.parseEther("100");
      
      // Register invoice with token
      const tokenInvoiceHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["string", "address"],
          ["Token Invoice", mockToken.address]
        )
      );
      
      await invoiceRegistry.connect(backend).registerInvoice(
        tokenInvoiceHash,
        freelancer.address,
        employer.address,
        amount,
        mockToken.address,
        1
      );

      // Approve token transfer
      await mockToken.connect(employer).approve(invoiceRegistry.address, amount);
      
      await expect(
        invoiceRegistry.connect(employer).depositPayment(tokenInvoiceHash)
      ).to.emit(invoiceRegistry, "PaymentDeposited")
        .withArgs(
          tokenInvoiceHash,
          employer.address,
          amount,
          mockToken.address,
          await ethers.provider.getBlock("latest").then(b => b.timestamp + 1)
        );
    });

    it("Should release payment to freelancer after acceptance", async function () {
      const amount = ethers.utils.parseEther("1");
      
      // Deposit payment
      await invoiceRegistry.connect(employer).depositPayment(invoiceHash, { value: amount });
      
      // Accept invoice
      await invoiceRegistry.connect(employer).acceptInvoice(invoiceHash);
      
      // Check freelancer balance before
      const freelancerBalanceBefore = await ethers.provider.getBalance(freelancer.address);
      
      // Release payment
      await expect(
        invoiceRegistry.connect(employer).releasePayment(invoiceHash)
      ).to.emit(invoiceRegistry, "PaymentReleased")
        .withArgs(
          invoiceHash,
          freelancer.address,
          amount,
          ethers.constants.AddressZero,
          await ethers.provider.getBlock("latest").then(b => b.timestamp + 1)
        );

      // Check freelancer received payment
      const freelancerBalanceAfter = await ethers.provider.getBalance(freelancer.address);
      expect(freelancerBalanceAfter.sub(freelancerBalanceBefore)).to.equal(amount);
      
      const invoice = await invoiceRegistry.getInvoice(invoiceHash);
      expect(invoice.state).to.equal(4); // Paid
    });

    it("Should refund payment to employer if rejected", async function () {
      const amount = ethers.utils.parseEther("1");
      
      // Deposit payment
      await invoiceRegistry.connect(employer).depositPayment(invoiceHash, { value: amount });
      
      // Reject invoice
      await invoiceRegistry.connect(employer).rejectInvoice(invoiceHash, "Quality issues");
      
      // Check employer balance before
      const employerBalanceBefore = await ethers.provider.getBalance(employer.address);
      
      // Refund payment
      const tx = await invoiceRegistry.connect(employer).refundPayment(invoiceHash);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);
      
      await expect(tx).to.emit(invoiceRegistry, "PaymentRefunded")
        .withArgs(
          invoiceHash,
          employer.address,
          amount,
          ethers.constants.AddressZero,
          await ethers.provider.getBlock("latest").then(b => b.timestamp)
        );

      // Check employer received refund (minus gas)
      const employerBalanceAfter = await ethers.provider.getBalance(employer.address);
      expect(employerBalanceAfter.add(gasUsed).sub(employerBalanceBefore)).to.equal(amount);
      
      const invoice = await invoiceRegistry.getInvoice(invoiceHash);
      expect(invoice.state).to.equal(6); // Refunded
    });
  });

  describe("Access Control", function () {
    it("Should have correct role assignments", async function () {
      const ADMIN_ROLE = await invoiceRegistry.ADMIN_ROLE();
      const BACKEND_ROLE = await invoiceRegistry.BACKEND_ROLE();
      
      expect(await invoiceRegistry.hasRole(ADMIN_ROLE, admin.address)).to.be.true;
      expect(await invoiceRegistry.hasRole(BACKEND_ROLE, backend.address)).to.be.true;
      expect(await invoiceRegistry.hasRole(ADMIN_ROLE, other.address)).to.be.false;
    });

    it("Should allow admin to pause/unpause contract", async function () {
      await invoiceRegistry.connect(admin).pause();
      expect(await invoiceRegistry.paused()).to.be.true;
      
      await expect(
        invoiceRegistry.connect(backend).registerInvoice(
          invoiceHash,
          freelancer.address,
          employer.address,
          ethers.utils.parseEther("1"),
          ethers.constants.AddressZero,
          1
        )
      ).to.be.revertedWith("Pausable: paused");
      
      await invoiceRegistry.connect(admin).unpause();
      expect(await invoiceRegistry.paused()).to.be.false;
    });
  });

  describe("Statistics and Queries", function () {
    beforeEach(async function () {
      await invoiceRegistry.connect(backend).registerInvoice(
        invoiceHash,
        freelancer.address,
        employer.address,
        ethers.utils.parseEther("1"),
        ethers.constants.AddressZero,
        1
      );
    });

    it("Should track invoice statistics correctly", async function () {
      let stats = await invoiceRegistry.getStatistics();
      expect(stats[0]).to.equal(1); // totalInvoices
      expect(stats[1]).to.equal(0); // totalPaidInvoices
      
      // Accept and mark as paid
      await invoiceRegistry.connect(employer).acceptInvoice(invoiceHash);
      await invoiceRegistry.connect(employer).markAsPaid(invoiceHash);
      
      stats = await invoiceRegistry.getStatistics();
      expect(stats[1]).to.equal(1); // totalPaidInvoices
    });

    it("Should return correct invoice lists for users", async function () {
      const freelancerInvoices = await invoiceRegistry.getFreelancerInvoices(freelancer.address);
      const employerInvoices = await invoiceRegistry.getEmployerInvoices(employer.address);
      
      expect(freelancerInvoices.length).to.equal(1);
      expect(employerInvoices.length).to.equal(1);
      expect(freelancerInvoices[0]).to.equal(invoiceHash);
      expect(employerInvoices[0]).to.equal(invoiceHash);
    });

    it("Should check invoice existence correctly", async function () {
      expect(await invoiceRegistry.invoiceExists(invoiceHash)).to.be.true;
      
      const nonExistentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("nonexistent"));
      expect(await invoiceRegistry.invoiceExists(nonExistentHash)).to.be.false;
    });
  });
});

// Mock ERC20 contract for testing
contract MockERC20 {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = _totalSupply;
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        require(balanceOf[from] >= amount, "Insufficient balance");
        
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
}