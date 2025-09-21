import { toast } from 'sonner';
import { useReadContract } from 'wagmi';
import type { Address } from '@/types';
import { contractConfig } from './useContract';

/**
 * get balance of staking
 */
export const useStakingBalance = (functionName: any, address: Address) => {
  const { data: pid } = useReadContract({
    ...contractConfig,
    functionName: 'ETH_PID',
  });
  const readContract = useReadContract({
    ...contractConfig,
    functionName,
    args: [pid as bigint, address],
    query: {
      enabled: !!address,
    },
  });
  if (readContract.error) {
    toast.error(readContract.error.message);
  }
  return readContract;
};
