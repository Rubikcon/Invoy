const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Invoy Smart Contracts...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Deploy InvoiceRegistry
  console.log("\n📋 Deploying InvoiceRegistry...");
  const InvoiceRegistry = await ethers.getContractFactory("InvoiceRegistry");
  
  // Set admin and backend addresses (in production, use different addresses)
  const adminAddress = deployer.address;
  const backendAddress = deployer.address; // In production, use a dedicated backend address
  
  const invoiceRegistry = await InvoiceRegistry.deploy(adminAddress, backendAddress);
  await invoiceRegistry.deployed();
  
  console.log("✅ InvoiceRegistry deployed to:", invoiceRegistry.address);
  console.log("🔑 Admin address:", adminAddress);
  console.log("🤖 Backend address:", backendAddress);

  // Deploy InvoiceNFT
  console.log("\n🎨 Deploying InvoiceNFT...");
  const InvoiceNFT = await ethers.getContractFactory("InvoiceNFT");
  const invoiceNFT = await InvoiceNFT.deploy(adminAddress, invoiceRegistry.address);
  await invoiceRegistry.deployed();
  
  console.log("✅ InvoiceNFT deployed to:", invoiceNFT.address);

  // Verify deployment
  console.log("\n🔍 Verifying deployments...");
  
  try {
    const registryStats = await invoiceRegistry.getStatistics();
    console.log("📊 Registry stats:", {
      totalInvoices: registryStats[0].toString(),
      totalPaidInvoices: registryStats[1].toString(),
      totalEscrowVolume: registryStats[2].toString()
    });
    
    const nftName = await invoiceNFT.name();
    const nftSymbol = await invoiceNFT.symbol();
    console.log("🎨 NFT Contract:", { name: nftName, symbol: nftSymbol });
    
    console.log("\n✅ All contracts deployed successfully!");
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
  }

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    contracts: {
      InvoiceRegistry: {
        address: invoiceRegistry.address,
        deployer: deployer.address,
        adminAddress,
        backendAddress
      },
      InvoiceNFT: {
        address: invoiceNFT.address,
        deployer: deployer.address
      }
    },
    timestamp: new Date().toISOString()
  };

  console.log("\n📄 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });