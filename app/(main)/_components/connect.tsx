'use client';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { toast } from 'sonner';
import { addressAtom } from '@/atoms/app';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { provider } from '@/lib/ethers';
import { getSolBalance } from '@/lib/sol';

export function Connect() {
	const [address] = useAtom(addressAtom);
	return (
		<div className=' space-y-3'>
			<div className='flex gap-4 items-center flex-col sm:flex-row'>
				{address ? <Profile /> : <ConnectDialog />}
			</div>
		</div>
	);
}

export function ConnectDialog() {
	const [address, setAddress] = useAtom(addressAtom);

	const wallets = [
		{
			name: 'Metamask',
			icon: '/images/metamask.svg',
			onClick: async () => {
				const provider = typeof window !== 'undefined' ? window.ethereum : null;

				if (!provider) {
					alert('No ethereum provider found');
					return;
				}

				const isMetaMask =
					provider.isMetaMask === true && provider.isOkxWallet !== true;

				if (!isMetaMask) {
					alert('This provider is NOT MetaMask. OKX Wallet is overriding it.');
					return;
				}
				const accounts = await provider.request({
					method: 'eth_requestAccounts',
				});
				setAddress(accounts[0]);
			},
		},
		{
			name: 'OKX Wallet Solana',
			icon: '/images/okx.png',
			onClick: async () => {
				if (typeof window !== 'undefined') {
					const okxwallet = window.okxwallet ? window.okxwallet : null;

					if (!okxwallet) {
						alert('Please install or disable OKX Wallet');
						return;
					}
				}

				try {
					const accounts = await okxwallet.solana.connect();

					console.log('Connected:', accounts);
					setAddress(accounts.publicKey.toString());
				} catch (err) {
					console.error(err);
				}
			},
		},
	];

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
				// onClick={() => {
				// 	const wallet = new ethers.Wallet(
				// 		"0x84065274c2909e0e62f49ab1b4a50cd784c73b108d50be2cf63df23c9522350b",
				// 		provider,
				// 	);
				// 	setAddress(wallet.address);
				// 	provider.getBalance(wallet.address);
				// }}
				>
					{address
						? `${address.slice(0, 6)}...${address.slice(-4)}`
						: 'Connect to wallet'}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Connect to wallet</DialogTitle>
					<DialogDescription>
						Connect to your wallet to get started
					</DialogDescription>
				</DialogHeader>
				<div className='grid grid-cols-2 gap-4'>
					{wallets.map((wallet) => (
						<div
							onClick={wallet.onClick}
							key={wallet.name}
							className='flex items-center gap-2 cursor-pointer border p-2 rounded-md hover:bg-accent'
						>
							<Image
								src={wallet.icon}
								alt={wallet.name}
								width={30}
								height={30}
							/>
							<span>{wallet.name}</span>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}

export function Profile() {
	const [address, setAddress] = useAtom(addressAtom);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>
					{address.slice(0, 6)}...{address.slice(-4)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56' align='start'>
				<DropdownMenuItem
					onClick={() => {
						navigator.clipboard.writeText(address);
						toast.success('Copied to clipboard');
					}}
				>
					{address.slice(0, 6)}...{address.slice(-4)}
					<DropdownMenuShortcut>Copy</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						getSolBalance(address).then((balance) => {
							toast.success(`Balance: ${balance}`);
						});
					}}
				>
					Get balance
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						setAddress('');
						toast.success('Logged out');
					}}
				>
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
