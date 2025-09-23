import { toast } from 'sonner';
import { useAccount, useReadContract } from 'wagmi';
import { PID } from '@/lib/utils';
import type { Address } from '@/types';
import { contractConfig } from './useContract';

/**
 * get balance of staking
 */
export const useStakingBalance = () => {
  // const { data: pid } = useReadContract({
  //   ...contractConfig,
  //   functionName: 'ETH_PID',
  // });
  const { address } = useAccount();

  const readContract = useReadContract({
    ...contractConfig,
    functionName: 'stakingBalance',
    args: [PID, address as Address],
    query: {
      enabled: !!address,
    },
  });
  if (readContract.error) {
    toast.error(readContract.error.message);
  }
  return readContract;
};
