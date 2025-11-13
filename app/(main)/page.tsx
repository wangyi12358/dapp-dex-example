'use client';
import { useAtom } from 'jotai';
import { ArrowDownUp } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { addressAtom, balanceAtom } from '@/atoms/app';
import { Button } from '@/components/ui/button';
import { getSolBalance } from '@/lib/sol';
import { Connect } from './_components/connect';

export default function Home() {
	const [address] = useAtom(addressAtom);
	const [balance, setBalance] = useAtom(balanceAtom);
	const [fromAmount, setFromAmount] = useState('');
	const [toAmount, setToAmount] = useState('');
	const [isSwapping, setIsSwapping] = useState(false);

	useEffect(() => {
		if (address) {
			getSolBalance(address).then((balance) => {
				setBalance(balance);
			});
		}
	}, [address, setBalance]);

	const handleMax = () => {
		setFromAmount(balance.toString());
	};

	const handleSwap = () => {
		setIsSwapping(true);
		// TODO: Implement swap logic
		setTimeout(() => {
			setIsSwapping(false);
		}, 2000);
	};

	// Auto calculate to amount based on exchange rate
	useEffect(() => {
		if (fromAmount) {
			const numValue = parseFloat(fromAmount);
			if (!Number.isNaN(numValue) && numValue > 0) {
				const rate = 100; // 1 SOL = 100 RAY
				const calculated = numValue * rate;
				setToAmount(calculated.toFixed(6));
			} else {
				setToAmount('');
			}
		} else {
			setToAmount('');
		}
	}, [fromAmount]);

	return (
		<div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
			<header className='flex justify-between items-center p-4 md:p-6 border-b border-border/40'>
				<div className='text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
					DEX Swap
				</div>
				<Connect />
			</header>
			<main className='container mx-auto px-4 py-8 md:py-16 max-w-2xl'>
				<div className='bg-card border border-border rounded-2xl shadow-lg p-6 md:p-8 space-y-6'>
					<div className='text-center space-y-2 mb-6'>
						<h1 className='text-3xl font-bold'>Swap Tokens</h1>
						<p className='text-muted-foreground text-sm'>
							Exchange tokens instantly on Solana
						</p>
					</div>

					{/* From Token */}
					<div className='space-y-3'>
						<div className='flex items-center justify-between'>
							<label
								htmlFor='from'
								className='text-sm font-medium text-muted-foreground'
							>
								From
							</label>
							{address && (
								<span className='text-xs text-muted-foreground'>
									Balance: {balance.toFixed(4)} SOL
								</span>
							)}
						</div>
						<div className='relative'>
							<div
								className={`flex items-center gap-3 bg-muted/50 border rounded-xl p-4 focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition-all ${
									fromAmount && parseFloat(fromAmount) > balance
										? 'border-destructive'
										: 'border-input'
								}`}
							>
								<div className='flex items-center gap-2 min-w-[100px]'>
									<Image
										src='/crypto/sol.png'
										alt='SOL'
										className='rounded-full'
										width={32}
										height={32}
									/>
									<span className='font-semibold'>SOL</span>
								</div>
								<div className='flex-1 flex items-center gap-2'>
									<input
										type='number'
										id='from'
										placeholder='0.0'
										value={fromAmount}
										onChange={(e) => setFromAmount(e.target.value)}
										className='flex-1 bg-transparent border-0 outline-none text-right text-lg font-semibold placeholder:text-muted-foreground/50'
									/>
									{address && (
										<Button
											type='button'
											variant='outline'
											size='sm'
											onClick={handleMax}
											className='h-7 px-3 text-xs'
										>
											MAX
										</Button>
									)}
								</div>
							</div>
							{fromAmount && parseFloat(fromAmount) > balance && (
								<p className='text-xs text-destructive mt-1'>
									Insufficient balance
								</p>
							)}
						</div>
					</div>

					{/* Swap Button */}
					<div className='flex justify-center -my-2'>
						<button
							type='button'
							onClick={() => {
								// Swap from and to
								const temp = fromAmount;
								setFromAmount(toAmount);
								setToAmount(temp);
							}}
							className='w-10 h-10 rounded-full bg-muted border-2 border-background hover:bg-accent transition-colors flex items-center justify-center shadow-md hover:shadow-lg z-10'
							aria-label='Swap tokens'
						>
							<ArrowDownUp className='w-4 h-4 text-foreground' />
						</button>
					</div>

					{/* To Token */}
					<div className='space-y-3'>
						<div className='flex items-center justify-between'>
							<label
								htmlFor='to'
								className='text-sm font-medium text-muted-foreground'
							>
								To
							</label>
							<span className='text-xs text-muted-foreground'>
								1 SOL ≈ 100 RAY
							</span>
						</div>
						<div className='relative'>
							<div className='flex items-center gap-3 bg-muted/50 border border-input rounded-xl p-4 focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition-all'>
								<div className='flex items-center gap-2 min-w-[100px]'>
									<Image
										src='/crypto/ray.png'
										alt='RAY'
										className='rounded-full'
										width={32}
										height={32}
									/>
									<span className='font-semibold'>RAY</span>
								</div>
								<div className='flex-1'>
									<input
										type='text'
										id='to'
										placeholder='0.0'
										value={toAmount}
										readOnly
										className='w-full bg-transparent border-0 outline-none text-right text-lg font-semibold placeholder:text-muted-foreground/50 cursor-default'
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Swap Info */}
					{fromAmount && toAmount && (
						<div className='bg-muted/30 rounded-lg p-4 space-y-2 text-sm'>
							<div className='flex justify-between items-center'>
								<span className='text-muted-foreground'>Rate</span>
								<span className='font-medium'>1 SOL = 100 RAY</span>
							</div>
							<div className='flex justify-between items-center'>
								<span className='text-muted-foreground'>Slippage</span>
								<span className='font-medium'>0.5%</span>
							</div>
							<div className='flex justify-between items-center'>
								<span className='text-muted-foreground'>Network Fee</span>
								<span className='font-medium'>~0.000005 SOL</span>
							</div>
						</div>
					)}

					{/* Swap Button */}
					<Button
						type='button'
						onClick={handleSwap}
						disabled={
							!address ||
							!fromAmount ||
							isSwapping ||
							parseFloat(fromAmount) > balance ||
							parseFloat(fromAmount) <= 0
						}
						className='w-full h-12 text-base font-semibold'
						size='lg'
					>
						{!address
							? 'Connect Wallet'
							: isSwapping
								? 'Swapping...'
								: !fromAmount
									? 'Enter Amount'
									: parseFloat(fromAmount) > balance
										? 'Insufficient Balance'
										: 'Swap'}
					</Button>

					{!address && (
						<p className='text-center text-xs text-muted-foreground'>
							Connect your wallet to start swapping
						</p>
					)}
				</div>
			</main>
		</div>
	);
}
