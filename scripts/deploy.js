const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();

  console.log("Greeter deployed to:", greeter.address);

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy("Jorge David", "JDF");

  await token.deployed();

  console.log("Token deployed to:", token.address);

  let Contracts = {
    "Greeter": greeter,
    "Token": token
  };

  const data = JSON.stringify(Contracts);

  fs.writeFileSync(path.join(__dirname, "..", "src", 'contracts.json'), data, 'utf8', (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
    } else {
      console.log(`File is written successfully!`);
    }
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
