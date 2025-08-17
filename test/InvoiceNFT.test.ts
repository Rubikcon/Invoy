import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { InvoiceNFT, InvoiceNFT__factory } from "../typechain-types";

describe("InvoiceNFT", function () {
  let InvoiceNFT: InvoiceNFT__factory;
  let invoiceNFT: InvoiceNFT;
  let admin: SignerWithAddress;
  let minter: SignerWithAddress;
  let freelancer: SignerWithAddress;
  let employer: SignerWithAddress;
  let other: SignerWithAddress;
  
  const BASE_URI = "https://api.invoy.app/invoice/";
  const TEST_INVOICE_HASH = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test-invoice"));
  
  // Test metadata
  const TEST_METADATA = {
    invoiceHash: TEST_INVOICE_HASH,
    freelancer: "", // Will be set in before()
    employer: "",   // Will be set in before()
    amount: ethers.utils.parseEther("1"),
    token: ethers.constants.AddressZero,
    description: "Test Invoice",
    createdAt: Math.floor(Date.now() / 1000),
    isPaid: false
  };

  before(async function () {
    [admin, minter, freelancer, employer, other] = await ethers.getSigners();
    
    // Set addresses in test metadata
    TEST_METADATA.freelancer = freelancer.address;
    TEST_METADATA.employer = employer.address;
    
    // Deploy InvoiceNFT
    InvoiceNFT = await ethers.getContractFactory("InvoiceNFT");
    invoiceNFT = (await upgrades.deployProxy(InvoiceNFT, [admin.address, minter.address])) as InvoiceNFT;
    await invoiceNFT.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right admin and minter roles", async function () {
      const adminRole = await invoiceNFT.DEFAULT_ADMIN_ROLE();
      const minterRole = await invoiceNFT.MINTER_ROLE();
      
      expect(await invoiceNFT.hasRole(adminRole, admin.address)).to.be.true;
      expect(await invoiceNFT.hasRole(minterRole, minter.address)).to.be.true;
    });

    it("Should have correct name and symbol", async function () {
      expect(await invoiceNFT.name()).to.equal("Invoy Invoice NFT");
      expect(await invoiceNFT.symbol()).to.equal("INVOICE");
    });
  });

  describe("Minting", function () {
    it("Should allow minter to mint a new invoice NFT", async function () {
      const tokenId = await invoiceNFT.totalSupply();
      
      await expect(
        invoiceNFT.connect(minter).mint(
          TEST_METADATA.invoiceHash,
          TEST_METADATA.freelancer,
          TEST_METADATA.employer,
          TEST_METADATA.amount,
          TEST_METADATA.token,
          TEST_METADATA.description,
          TEST_METADATA.createdAt,
          TEST_METADATA.isPaid
        )
      ).to.emit(invoiceNFT, "InvoiceNFTMinted")
       .withArgs(tokenId, TEST_INVOICE_HASH, freelancer.address, employer.address);

      // Check token ownership
      expect(await invoiceNFT.ownerOf(tokenId)).to.equal(freelancer.address);
      
      // Check metadata
      const metadata = await invoiceNFT.invoiceMetadata(tokenId);
      expect(metadata.invoiceHash).to.equal(TEST_INVOICE_HASH);
      expect(metadata.freelancer).to.equal(freelancer.address);
      expect(metadata.amount).to.equal(TEST_METADATA.amount);
    });

    it("Should prevent non-minters from minting", async function () {
      await expect(
        invoiceNFT.connect(other).mint(
          TEST_INVOICE_HASH,
          freelancer.address,
          employer.address,
          TEST_METADATA.amount,
          TEST_METADATA.token,
          TEST_METADATA.description,
          TEST_METADATA.createdAt,
          TEST_METADATA.isPaid
        )
      ).to.be.revertedWith(/AccessControl/);
    });

    it("Should prevent minting duplicate invoice hashes", async function () {
      await expect(
        invoiceNFT.connect(minter).mint(
          TEST_INVOICE_HASH, // Same hash as before
          freelancer.address,
          employer.address,
          TEST_METADATA.amount,
          TEST_METADATA.token,
          TEST_METADATA.description,
          TEST_METADATA.createdAt,
          TEST_METADATA.isPaid
        )
      ).to.be.revertedWith("Invoice already minted");
    });
  });

  describe("Token URI", function () {
    it("Should return correct token URI", async function () {
      const tokenId = 0; // First token minted in previous test
      const expectedURI = `${BASE_URI}${tokenId}`;
      
      // Set base URI
      await invoiceNFT.connect(admin).setBaseURI(BASE_URI);
      
      expect(await invoiceNFT.tokenURI(tokenId)).to.equal(expectedURI);
    });

    it("Should allow updating token URI", async function () {
      const tokenId = 0;
      const newURI = "ipfs://new-uri/";
      
      await invoiceNFT.connect(admin).setBaseURI(newURI);
      expect(await invoiceNFT.tokenURI(tokenId)).to.equal(`${newURI}${tokenId}`);
    });
  });

  describe("Pausing", function () {
    it("Should allow admin to pause and unpause the contract", async function () {
      await invoiceNFT.connect(admin).pause();
      expect(await invoiceNFT.paused()).to.be.true;
      
      await invoiceNFT.connect(admin).unpause();
      expect(await invoiceNFT.paused()).to.be.false;
    });

    it("Should prevent minting when paused", async function () {
      await invoiceNFT.connect(admin).pause();
      
      await expect(
        invoiceNFT.connect(minter).mint(
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes("new-invoice")),
          freelancer.address,
          employer.address,
          TEST_METADATA.amount,
          TEST_METADATA.token,
          "New Invoice",
          Math.floor(Date.now() / 1000),
          false
        )
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Token Transfers", function () {
    it("Should allow token transfer between accounts", async function () {
      const tokenId = 0; // First token
      
      // Transfer from freelancer to other
      await invoiceNFT.connect(freelancer).transferFrom(
        freelancer.address,
        other.address,
        tokenId
      );
      
      expect(await invoiceNFT.ownerOf(tokenId)).to.equal(other.address);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow admin to grant and revoke minter role", async function () {
      const minterRole = await invoiceNFT.MINTER_ROLE();
      
      // Grant minter role
      await invoiceNFT.connect(admin).grantRole(minterRole, other.address);
      expect(await invoiceNFT.hasRole(minterRole, other.address)).to.be.true;
      
      // Revoke minter role
      await invoiceNFT.connect(admin).revokeRole(minterRole, other.address);
      expect(await invoiceNFT.hasRole(minterRole, other.address)).to.be.false;
    });
  });
});
