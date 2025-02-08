import { ethers } from 'ethers'
import fs from "fs";

// 连接私链
const provider = new ethers.JsonRpcProvider("http://localhost:8545");

// 你的私链账户 & 私钥（建议存 .env 文件中）
const privateKey = '0x84065274c2909e0e62f49ab1b4a50cd784c73b108d50be2cf63df23c9522350b'
const wallet = new ethers.Wallet(privateKey, provider);

// 读取编译后的合约
const contractJson = JSON.parse(fs.readFileSync("./artifacts/contracts/SimpleStorage.sol/SimpleStorage.json", "utf8"));
const abi = contractJson.abi;
const bytecode = contractJson.bytecode;

async function deployContract() {
  console.log("部署合约中...");

  // 部署合约
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy({
    gasLimit: 3000000
  });

  console.log("合约部署成功，地址：", contract.target);
  return contract;
}

deployContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });