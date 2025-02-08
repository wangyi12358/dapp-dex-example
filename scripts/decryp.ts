import fs from 'node:fs'
import {ethers} from 'ethers'

// 读取 Keystore 文件路径
const keystorePath = "./data/keystore/UTC--2025-02-08T02-29-50.144149000Z--47ef25c8fbcb50d9d69783bc24812cd744cf9b09";
const keystore = fs.readFileSync(keystorePath, "utf-8");

// 你的账户密码
const password = "123456";

(async () => {
    try {
        // 解密 Keystore
        const wallet = await ethers.Wallet.fromEncryptedJson(keystore, password);
        console.log("钱包地址:", wallet.address);
        console.log("私钥:", wallet.privateKey); // ⚠️ 切勿泄露
    } catch (error) {
        console.error("解密失败:", error.message);
    }
})();