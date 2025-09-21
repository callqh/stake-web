import { useReadContract, useWriteContract } from 'wagmi';
import type { Address } from '@/types';
import { stakeAbi } from '../assets/abi';

export const contractConfig = {
  abi: stakeAbi,
  address: process.env.NEXT_PUBLIC_STAKE_ADDRESS as Address,
};

export const useContract = () => {};
