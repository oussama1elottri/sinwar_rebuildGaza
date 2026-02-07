require('dotenv').config();
const { ethers } = require("ethers");

// CONFIGURATION
const RPC_URL = "https://ethereum-sepolia.publicnode.com";
const CONTRACT_ADDRESS = "0x30D86092b8cDCc555cC3fa059a0bc85E76e150ED"; 
const PRIVATE_KEY = process.env.PRIVATE_KEY; 

// Minimal ABI
const ABI = ["function addUpdate(uint256 _projectId, string _ipfsHash, string _status) public"];

async function verifyProject(id, status, photoHash) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  console.log(`\n🛡️  Verifying Project ID: ${id} (${status})...`);
  
  try {
    const tx = await contract.addUpdate(id, photoHash, status);
    console.log(`   Tx Hash: ${tx.hash}`);
    console.log("   Waiting for confirmation...");
    await tx.wait();
    console.log(`✅ Project ${id} is now VERIFIED on-chainnnnn!`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// --- DEMO SCENARIO ---
async function runDemo() {
  // 1. Verify "Al-Shifa Emergency Wing" (ID: "1"from mockData.ts)
  await verifyProject(1, "Phase 2: jjjConstruction deActive", "QmHashAlShifaPhoto44444");

  // 2. Verify "Water Desalination Unit" (ID: "3" from mockData.ts)
  await verifyProject(3, "Phase 3: fffCompleted & Operational", "QmHashWaterUnitPhoto55555");
}

runDemo();