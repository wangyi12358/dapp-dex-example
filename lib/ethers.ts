import { ethers } from 'ethers'

export const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ETHERS_URL);
