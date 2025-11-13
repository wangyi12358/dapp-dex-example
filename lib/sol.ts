import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
export async function getSolBalance(address: string) {
	const publicKey = new PublicKey(address);
	const lamports = await connection.getBalance(publicKey); // lamports = 10^-9 SOL
	const sol = lamports / 1e9;
	console.log('SOL Balance:', sol);
	return sol;
}
