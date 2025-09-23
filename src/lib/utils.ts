import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatEther } from 'viem';
import type { Address } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PID = BigInt(0);

export const stTokenAddress = process.env.NEXT_PUBLIC_STAKE_ADDRESS as Address;

export function formatEthFixed(value: bigint = BigInt(0)) {
  return parseFloat(formatEther(value)).toFixed(4);
}
