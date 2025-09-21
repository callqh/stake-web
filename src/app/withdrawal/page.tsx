'use client';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { formatEther, parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { contractConfig } from '@/hooks/useContract';
import { useStakingBalance } from '@/hooks/useStakingBalance';
import { useWriteContract } from '@/hooks/useWriteContract';
import type { Address } from '@/types';

export default () => {
  const [unStakeAmount, setUnStakeAmount] = useState<string>('');
  const { address, isConnected } = useAccount();
  const { data: stakeAmount } = useStakingBalance(
    'stakingBalance',
    address as Address,
  );
  const { data: withdrawAmount } = useStakingBalance(
    'withdrawAmount',
    address as Address,
  );
  const { writeContract, loading: unStakeLoading } = useWriteContract({});
  /**
   * amount list
   */
  const amoutList = useMemo(
    () => [
      {
        name: 'Staked Amount',
        value: stakeAmount && formatEther(stakeAmount as bigint),
      },
      {
        name: 'Avaliable to Withdraw',
        value:
          withdrawAmount &&
          formatEther((withdrawAmount as [bigint, bigint])?.[0]),
      },
      {
        name: 'Pending Withdrawn',
        value:
          withdrawAmount &&
          formatEther((withdrawAmount as [bigint, bigint])?.[1]),
      },
    ],
    [stakeAmount, withdrawAmount],
  );

  /**
   * handle unstake event
   */
  const handleUnstake = async () => {
    if (
      !unStakeAmount ||
      parseEther(unStakeAmount) > (withdrawAmount as [bigint, bigint])?.[0]
    ) {
      return toast.error('Invalid amount');
    }
    await writeContract({
      ...contractConfig,
      functionName: 'unstake',
      args: [BigInt(0), parseEther(unStakeAmount)],
    });
  };

  const handleWithdraw = async () => {
    if (
      !unStakeAmount ||
      parseEther(unStakeAmount) > (withdrawAmount as [bigint, bigint])?.[0]
    ) {
      return toast.error('Invalid amount');
    }
    await writeContract({
      ...contractConfig,
      functionName: 'withdraw',
      args: [BigInt(0)],
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
          Withdrawal
        </motion.p>
        <motion.p className='text-3xl font-bold text-center'>
          Unstake and withdraw your ETH
        </motion.p>
      </motion.div>
      <Card className='max-w-[70%] mx-auto grid grid-cols-1 gap-6'>
        <div className='grid grid-cols-3 gap-3'>
          {amoutList.map((item) => (
            <Card className='bg-white  p-6' key={item.name}>
              <div className='grid grid-rows-2 gap-2'>
                <p className='text-accent-foreground text-nowrap'>
                  {item.name}
                </p>
                <p className='text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent'>
                  {item.value || '0.000000'} ETH
                </p>
              </div>
            </Card>
          ))}
        </div>
        {/* Unstake Area */}
        <p className='font-bold'>Unstake</p>
        <div>
          <Input
            value={unStakeAmount}
            onChange={(e) => setUnStakeAmount(e.target.value)}
            type='number'
            placeholder='Enter unStake amount'
            className='h-16'
            suffix={
              <span className='font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent'>
                ETH
              </span>
            }
          />
        </div>
        <Button
          onClick={handleUnstake}
          loading={unStakeLoading}
          className='w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
        >
          Unstake
        </Button>
        {/* Withdraw Area */}
        <p className='font-bold'>Withdraw</p>
        <Card className='grid grid-cols-2 justify-between p-6 bg-white text-black items-center'>
          <div>
            <p className='text-accent-foreground'>Ready to Withdraw</p>
            <p className='text-2xl  font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent'>
              {withdrawAmount
                ? formatEther((withdrawAmount as [bigint, bigint])?.[0])
                : '0.000000'}{' '}
              ETH
            </p>
          </div>
          <div className='text-right text-accent-foreground'>
            20 min cooldown
          </div>
        </Card>
        <p className='text-accent-foreground'>
          After unstaking, you need to wait 20 minutes to withdraw.
        </p>
        <Button
          onClick={handleWithdraw}
          className='w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
        >
          Withdraw
        </Button>
      </Card>
    </motion.div>
  );
};
