'use client';

import { TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatEther, parseEther } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { stakeAbi } from '@/assets/abi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useStakingBalance } from '@/hooks/useStakingBalance';
import { useWriteContract } from '@/hooks/useWriteContract';
import type { Address } from '@/types';

export default () => {
  const [value, setValue] = useState<string>('');
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  /**
   * get balance of staking
   */
  const { data: stakedAmount, refetch: refetchStakingBalance } =
    useStakingBalance('stakingBalance', address as Address);
  /**
   * write contract and listening receipt
   */
  const { writeContract, loading } = useWriteContract({
    successCallback: refetchStakingBalance,
  });
  /**
   * handle stake click event
   */
  const handleStake = async () => {
    if (balance && parseEther(value) > balance?.value) {
      toast('Current balance is not enough!');
      return;
    }
    await writeContract({
      abi: stakeAbi,
      address: process.env.NEXT_PUBLIC_STAKE_ADDRESS as Address,
      functionName: 'depositETH',
      value: parseEther(value),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='w-full grid grid-cols-1 gap-6'
    >
      <motion.div className='grid grid-cols-1 gap-6'>
        <motion.p className='text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-4 text-center'>
          Stake
        </motion.p>
        <motion.p className='text-3xl font-bold text-center'>
          Stake ETH to earn tokens
        </motion.p>
      </motion.div>

      <Card animationDelay={0.2} className='w-1xl mx-auto grid grid-cols-1 gap-16'>
        <Card className='border-0 p-6'>
          <div className='flex items-center gap-4'>
            <div className='w-18 h-18 rounded-full mr-6 bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center'>
              <TrendingUp />
            </div>
            <div>
              <p className='text-muted-foreground text-2xl'>Staked Amount</p>
              <p className='text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent'>
                {stakedAmount ? formatEther(stakedAmount as bigint) : '0.000000'} ETH
              </p>
            </div>
          </div>
        </Card>
        <div>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type='number'
            placeholder='Enter amount'
            className='h-16'
            suffix={
              <span className='font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent'>
                ETH
              </span>
            }
          />
          <p className='text-muted-foreground mt-6'>
            Available: {balance?.formatted} {balance?.symbol}
          </p>
        </div>
        <div className='flex justify-center'>
          <Button
            loading={loading}
            onClick={handleStake}
            disabled={!isConnected || loading}
            className='w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
          >
            {isConnected ? 'Stake ETH' : 'Connect Wallet'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
