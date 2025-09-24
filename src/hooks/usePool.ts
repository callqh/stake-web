import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { retryWithDelay } from '@/lib/retry';
import { PID } from '@/lib/utils';
import { useContract } from './useContract';

export interface IPool {
  /**
   * 质押代币的地址。
   */
  stTokenAddress: string;
  /**
   * 质押池的权重，影响奖励分配。
   */
  poolWeight: bigint;
  /**
   * 最后一次计算奖励的区块号。
   */
  lastRewardBlock: bigint;
  /**
   * 每个质押代币累积的 MetaNode 数量。
   */
  accMetaNodePerST: bigint;
  /**
   * 池中的总质押代币量。
   */
  stTokenAmount: bigint;
  /**
   * 最小质押金额。
   */
  minDepositAmount: bigint;
  /**
   * 解除质押的锁定区块数。
   */
  unstakeLockedBlocks: bigint;
}

const DEFAULT_POOL = {
  stTokenAddress: '',
  poolWeight: BigInt(0),
  lastRewardBlock: BigInt(0),
  accMetaNodePerST: BigInt(0),
  stTokenAmount: BigInt(0),
  minDepositAmount: BigInt(0),
  unstakeLockedBlocks: BigInt(0),
};

export const usePool = () => {
  const contract = useContract();
  const { isConnected } = useAccount();
  const [poolData, setPoolData] = useState<IPool>(DEFAULT_POOL);

  const fetchPool = async () => {
    if (!contract) {
      return DEFAULT_POOL;
    }
    try {
      const [
        stTokenAddress,
        poolWeight,
        lastRewardBlock,
        accMetaNodePerST,
        stTokenAmount,
        minDepositAmount,
        unstakeLockedBlocks,
      ] = await retryWithDelay(() => contract.read.pool([PID]));
      setPoolData({
        stTokenAddress,
        poolWeight,
        lastRewardBlock,
        accMetaNodePerST,
        stTokenAmount,
        minDepositAmount,
        unstakeLockedBlocks,
      });
    } catch (e) {
      console.log('fetch pool error', e);
      setPoolData(DEFAULT_POOL);
    }
  };

  useEffect(() => {
    isConnected && fetchPool();
  }, [contract, isConnected]);

  useEffect(() => {
    if (!isConnected) return;
    const tId = setInterval(() => {
      fetchPool();
    }, 6000)
    return () => clearInterval(tId)
  }, [isConnected]);

  return { poolData, fetchPool };
};
