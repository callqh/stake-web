import { useReadContract } from 'wagmi';
import type { Address } from '@/types';
import { contractConfig } from './useContract';

/**
 * get balance of staking
 */
export const useStakingBalance = (address?: Address) => {
  const { data: pid } = useReadContract({
    ...contractConfig,
    functionName: 'ETH_PID',
  });
  const readContract = useReadContract({
    ...contractConfig,
    functionName: 'stakingBalance',
    args: [pid as bigint, address as Address],
    query: {
      enabled: !!address,
    },
  });
  return readContract;
};
