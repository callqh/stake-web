import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { PID } from '@/lib/utils';
import type { Address } from '@/types';
import { useContract } from './useContract';

export interface IWidthdrawal {
  requestAmount: bigint;
  withdrawableAmount: bigint;
  withdrawPending: bigint;
}
const DEFAULT_WIDTHDRAWAL = {
  requestAmount: BigInt(0),
  withdrawableAmount: BigInt(0),
  withdrawPending: BigInt(0),
};

export const useWidthdrawal = () => {
  const contract = useContract();
  const { address } = useAccount();
  const [data, setData] = useState<IWidthdrawal>(DEFAULT_WIDTHDRAWAL);

  const fetchWidthdrawal = async () => {
    try {
      if (!contract || !address) return;
      const [requestAmount, withdrawableAmount] =
        await contract.read.withdrawAmount([PID, address as Address]);
      setData({
        requestAmount: requestAmount || BigInt(0),
        withdrawableAmount: withdrawableAmount || BigInt(0),
        withdrawPending: requestAmount - withdrawableAmount || BigInt(0),
      });
    } catch (err) {
      console.log('fetch withdrawal error', err);
    }
  };

  useEffect(() => {
    fetchWidthdrawal();
  }, [contract, address]);

  return { data, fetchWidthdrawal };
};
