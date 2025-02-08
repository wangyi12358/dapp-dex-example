'use client';
import { Button } from "@/components/ui/button";
import { provider } from "@/lib/ethers";
import { ethers } from "ethers";
import { useState } from "react";

export function Connect() {
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState('')

  return (
    <div className=" space-y-3">
      <div>
        address: {address}
      </div>
      <div>
      balance: {balance}
      </div>
      <div className="flex gap-4 items-center flex-col sm:flex-row">
        <Button
          onClick={() => {
            const wallet = new ethers.Wallet('0x84065274c2909e0e62f49ab1b4a50cd784c73b108d50be2cf63df23c9522350b', provider)
            console.log(wallet.address)
            setAddress(wallet.address)
            provider.getBalance(wallet.address)
          }}
        >
          Connect to wallet
        </Button>
        <Button
          disabled={!address}
          onClick={() => {
            provider.getBalance(address).then((balance) => {
              setBalance(ethers.formatEther(balance))
            })
          }}
        >
          Get balance
        </Button>
      </div>
    </div>
  )
}