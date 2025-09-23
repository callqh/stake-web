import { useMemo } from 'react';
import { getContract } from 'viem';
import { useClient, useWalletClient } from 'wagmi';
import type { Address } from '@/types';
import { stakeAbi } from '../assets/abi';

export const contractConfig = {
  abi: stakeAbi,
  address: process.env.NEXT_PUBLIC_STAKE_ADDRESS as Address,
};

export const useContract = () => {
  const client = useClient();
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    if (!client || !walletClient) {
      return null;
    }
    return getContract({
      abi: stakeAbi,
      address: process.env.NEXT_PUBLIC_STAKE_ADDRESS as Address,
      client: {
        public: client!,
        wallet: walletClient,
      },
    });
  }, [client, walletClient]);
};
