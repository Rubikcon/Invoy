import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-ethers";

// Import contract types
import type { InvoiceRegistry } from "../typechain-types/contracts/InvoiceRegistry";
import type { MockERC20 } from "../typechain-types/contracts/test/MockERC20";

// Import contract factories as values
import { InvoiceRegistry__factory } from "../typechain-types/factories/contracts/InvoiceRegistry__factory";
import { MockERC20__factory } from "../typechain-types/factories/contracts/test/MockERC20__factory";

// Import types from ethers
import type { ContractFactory, Signer } from "ethers";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

// Constants
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// Helper function to convert to BigInt
const toWei = (value: string | number | bigint): bigint => {
  const strValue = value.toString();
  return BigInt(ethers.utils.parseEther(strValue).toString());
};

// Helper function to get contract address
const getContractAddress = async (contract: { getAddress: () => Promise<string> } | string): Promise<string> => {
  if (typeof contract === 'string') return contract;
  return await contract.getAddress();
};

describe("InvoiceRegistry", function () {
  let InvoiceRegistry: InvoiceRegistry__factory;
  let invoiceRegistry: InvoiceRegistry;
  let MockERC20: MockERC20__factory;
  let mockToken: MockERC20;
  let admin: HardhatEthersSigner;
  let backend: HardhatEthersSigner;
  let freelancer: HardhatEthersSigner;
  let employer: HardhatEthersSigner;
  let other: HardhatEthersSigner;
  
  const TEST_AMOUNT = toWei("1");
  const CHAIN_ID = 1n; // Ethereum mainnet
  
  // Contract addresses
  let invoiceRegistryAddress: string;
  
  /**
   * Helper function to get contract instance with signer
   * @param {HardhatEthersSigner} signer - The signer to use for the contract
   * @returns {Promise<InvoiceRegistry>} The contract instance
   */
  const getInvoiceRegistry = async (signer: HardhatEthersSigner): Promise<InvoiceRegistry> => {
    const contract = new ethers.Contract(
      invoiceRegistryAddress,
      new InvoiceRegistry__factory().interface,
      signer as any
    ) as unknown as InvoiceRegistry;
    return contract;
  };
  
  // Test data
  const INVOICE_DETAILS = {
    description: "Test Invoice",
    amount: TEST_AMOUNT,
    tokenAddress: ZERO_ADDRESS, // Native token
    chainId: CHAIN_ID,
  };
  
  let invoiceHash: string;

  beforeEach(async function () {
    // Get signers
    const signers = await ethers.getSigners();
    admin = signers[0];
    backend = signers[1];
    freelancer = signers[2];
    employer = signers[3];
    other = signers[4];
    
    // Deploy Mock ERC20 Token
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20Factory.deploy("Test Token", "TEST", toWei("1000"));
    await mockToken.deployed();

    // Deploy InvoiceRegistry
    const InvoiceRegistryFactory = await ethers.getContractFactory("InvoiceRegistry");
    invoiceRegistry = await upgrades.deployProxy(
      InvoiceRegistryFactory as any,
      [
        await admin.getAddress(),
        await backend.getAddress()
      ],
      { initializer: 'initialize' }
    ) as unknown as InvoiceRegistry;
    
    await invoiceRegistry.deployed();
    invoiceRegistryAddress = await (invoiceRegistry as any).getAddress();

    // Generate test invoice hash
    const abiCoder = new ethers.utils.AbiCoder();
    const encodedData = abiCoder.encode(
      ["address", "address", "uint256", "uint256", "string", "string"],
      [
        await freelancer.getAddress(),
        await employer.getAddress(),
        TEST_AMOUNT,
        CHAIN_ID,
        "Test Invoice",
        "Test Description"
      ]
    );
    invoiceHash = ethers.utils.keccak256(encodedData);

    // Fund employer with test tokens
    const transferTx = await mockToken.transfer(await employer.getAddress(), TEST_AMOUNT * 10n);
    await transferTx.wait();
  });

  describe("Deployment", function () {
    it("Should set the correct admin and backend roles", async function () {
      expect(await invoiceRegistry.hasRole(await invoiceRegistry.ADMIN_ROLE(), await admin.getAddress())).to.be.true;
      expect(await invoiceRegistry.hasRole(await invoiceRegistry.BACKEND_ROLE(), await backend.getAddress())).to.be.true;
    });
  });

  describe("Invoice Registration", function () {
    it("Should allow backend to register a new invoice", async function () {
      const tx = await invoiceRegistry.connect(backend).registerInvoice(
        await employer.getAddress(),
        TEST_AMOUNT,
        CHAIN_ID,
        "Test Invoice",
        "Test Description"
      );
      
      await expect(tx)
        .to.emit(invoiceRegistry, "InvoiceRegistered")
        .withArgs(invoiceHash, await freelancer.getAddress(), await employer.getAddress(), TEST_AMOUNT);

      const invoice = await invoiceRegistry.getInvoice(invoiceHash);
      expect(invoice.state).to.equal(0); // Pending state
      expect(invoice.amount).to.equal(TEST_AMOUNT);
    });

    it("Should prevent non-backend from registering invoices", async function () {
      await expect(
        invoiceRegistry.connect(other).registerInvoice(
          invoiceHash,
          freelancer.address,
          employer.address,
          TEST_AMOUNT,
          ZERO_ADDRESS,
          CHAIN_ID
        )
      ).to.be.revertedWith(/AccessControl/);
    });
  });

  describe("Invoice Management", function () {
    beforeEach(async function () {
      await invoiceRegistry.connect(backend).registerInvoice(
        invoiceHash,
        freelancer.address,
        employer.address,
        TEST_AMOUNT,
        ZERO_ADDRESS,
        CHAIN_ID
      );
    });

    it("Should allow employer to accept an invoice", async function () {
      await expect(invoiceRegistry.connect(employer).acceptInvoice(invoiceHash))
        .to.emit(invoiceRegistry, "InvoiceStatusChanged")
        .withArgs(invoiceHash, 1); // 1 = Accepted
    });

    it("Should allow employer to reject an invoice with reason", async function () {
      const reason = "Incorrect amount";
      await expect(invoiceRegistry.connect(employer).rejectInvoice(invoiceHash, reason))
        .to.emit(invoiceRegistry, "InvoiceStatusChanged")
        .withArgs(invoiceHash, 2); // 2 = Rejected
      
      const invoice = await invoiceRegistry.getInvoice(invoiceHash);
      expect(invoice.rejectionReason).to.equal(reason);
    });
  });

  describe("Payment Processing", function () {
    beforeEach(async function () {
      await invoiceRegistry.connect(backend).registerInvoice(
        invoiceHash,
        freelancer.address,
        employer.address,
        TEST_AMOUNT,
        ZERO_ADDRESS,
        CHAIN_ID
      );
      await invoiceRegistry.connect(employer).acceptInvoice(invoiceHash);
    });

    it("Should accept payment in native currency", async function () {
      await expect(
        invoiceRegistry.connect(employer).depositPayment(invoiceHash, { value: TEST_AMOUNT })
      ).to.emit(invoiceRegistry, "PaymentDeposited")
       .withArgs(invoiceHash, TEST_AMOUNT);
    });

    it("Should accept payment in ERC20 tokens", async function () {
      // Create a new invoice with ERC20 token
      const erc20InvoiceHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["string", "address", "address", "uint256"],
          ["ERC20 Invoice", freelancer.address, employer.address, TEST_AMOUNT]
        )
      );

      await invoiceRegistry.connect(backend).registerInvoice(
        erc20InvoiceHash,
        freelancer.address,
        employer.address,
        TEST_AMOUNT,
        mockToken.address,
        CHAIN_ID
      );

      await invoiceRegistry.connect(employer).acceptInvoice(erc20InvoiceHash);
      
      // Approve token transfer
      await mockToken.connect(employer).approve(invoiceRegistry.address, TEST_AMOUNT);
      
      await expect(
        invoiceRegistry.connect(employer).depositPayment(erc20InvoiceHash)
      ).to.emit(invoiceRegistry, "PaymentDeposited")
       .withArgs(erc20InvoiceHash, TEST_AMOUNT);
    });
  });

  describe("Access Control", function () {
    it("Should allow admin to pause and unpause the contract", async function () {
      await invoiceRegistry.connect(admin).pause();
      expect(await invoiceRegistry.paused()).to.be.true;
      
      await invoiceRegistry.connect(admin).unpause();
      expect(await invoiceRegistry.paused()).to.be.false;
    });

    it("Should prevent non-admin from pausing", async function () {
      await expect(invoiceRegistry.connect(other).pause()).to.be.revertedWith(/AccessControl/);
    });
  });

  // Add more test cases for edge cases, security checks, and additional functionality
});
