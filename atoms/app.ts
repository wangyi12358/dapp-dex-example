import { atom } from 'jotai';

export const addressAtom = atom<string>('');
export const balanceAtom = atom<number>(0);
export const chainAtom = atom<'evm' | 'solana'>();
