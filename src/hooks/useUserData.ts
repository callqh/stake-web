import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { PID } from '@/lib/utils';
import type { Address } from '@/types';
import { useContract } from './useContract';

export interface IUser {
  stAmount: bigint;
  finishedMetaNode: bigint;
  pendingMetaNode: bigint;
}

const DEFAULT_USER = {
  stAmount: BigInt(0),
  finishedMetaNode: BigInt(0),
  pendingMetaNode: BigInt(0),
};

export const useUserData = () => {
  const contract = useContract();
  const { address } = useAccount();
  const [userData, setUserData] = useState<IUser>(DEFAULT_USER);

  const fetchUserData = async () => {
    if (!contract) {
      return DEFAULT_USER;
    }
    try {
      const [stAmount, finishedMetaNode, pendingMetaNode] =
        await contract.read.user([PID, address as Address]);
      setUserData({
        stAmount,
        finishedMetaNode,
        pendingMetaNode,
      });
    } catch (e) {
      console.log('fetch user error', e);
      setUserData(DEFAULT_USER);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [address, contract]);

  return { userData, fetchUserData };
};
