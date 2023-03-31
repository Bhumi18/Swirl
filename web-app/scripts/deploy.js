const hre = require("hardhat");

async function main() {
  const Swirl = await hre.ethers.getContractFactory("Swirl");
  const swirl = await Swirl.deploy();

  await swirl.deployed();

  console.log(`deployed to ${swirl.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
