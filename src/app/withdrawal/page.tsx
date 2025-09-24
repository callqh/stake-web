'use client';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { type Address, formatEther, parseEther } from 'viem';
import { useAccount, useChainId, useConfig } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useContract } from '@/hooks/useContract';
import { useStakingBalance } from '@/hooks/useStakingBalance';
import { useWidthdrawal } from '@/hooks/useWithdrawal';
import { formatEthFixed, PID } from '@/lib/utils';

export default () => {
  const [unStakeAmount, setUnStakeAmount] = useState<string>('');
  const [unStakeLoading, setUnStakeLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const { data: withdrawal, fetchWidthdrawal } = useWidthdrawal();
  const { data: stakeBalance, refetch: fetchStakedBalance } =
    useStakingBalance();
  const { isConnected } = useAccount();
  const contract = useContract();
  const config = useConfig();
  const chainId = useChainId();

  const canWithdraw = useMemo(() => {
    return Number(withdrawal.withdrawableAmount) > 0 && isConnected;
  }, [withdrawal, isConnected]);

  /**
   * amount list
   */
  const amoutList = useMemo(
    () => [
      {
        name: 'Staked Amount',
        value: stakeBalance,
      },
      {
        name: 'Avaliable to Withdraw',
        value: withdrawal.withdrawableAmount,
      },
      {
        name: 'Pending Withdrawn',
        value: withdrawal.withdrawPending,
      },
    ],
    [withdrawal, stakeBalance],
  );

  /**
   * handle unstake event
   */
  const handleUnstake = async () => {
    if (!stakeBalance || !unStakeAmount)
      return toast.error('unstake amount is required');
    if (parseFloat(unStakeAmount) > parseFloat(formatEther(stakeBalance))) {
      return toast.error('Invalid amount');
    }
    try {
      setUnStakeLoading(true);
      const res = await contract?.write.unstake([
        PID,
        parseEther(unStakeAmount),
      ]);
      if (!res) return;
      const receipt = await waitForTransactionReceipt(config, {
        hash: res as Address,
        chainId,
      });
      if (receipt.status === 'success') {
        toast.success('Unstake success!', {
          description: receipt.blockHash,
        });
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUnStakeLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!canWithdraw) {
      return toast.error('not withdrawable');
    }
    try {
      setWithdrawLoading(true);
      const hash = await contract?.write.withdraw([PID]);
      if (!hash) return;
      const receipt = await waitForTransactionReceipt(config, {
        hash: hash as Address,
        chainId,
      });
      if (receipt.status === 'success') {
        toast.success('Withdraw success!', {
          description: receipt.blockHash,
        });
        await Promise.all([fetchStakedBalance(), fetchWidthdrawal()]);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='w-full grid grid-cols-1 gap-6'
    >
      <motion.div className='grid grid-cols-1 gap-6'>
        <motion.p className='xl:text-4xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-4 text-center'>
          Withdrawal
        </motion.p>
        <motion.p className='text-2xl sm:text-3xl font-bold text-center'>
          Unstake and withdraw your ETH
        </motion.p>
      </motion.div>
      <Card className='mx-auto grid grid-cols-1 gap-6'>
        <div className='grid grid-cols-3 gap-2'>
          {amoutList.map((item) => (
            <Card className='bg-white p-3' key={item.name}>
              <div className='grid grid-rows-2 gap-2'>
                <p className='text-accent-foreground md:text-nowrap'>
                  {item.name}
                </p>
                <p className='text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent'>
                  {formatEthFixed(item.value)} ETH
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
          disabled={!isConnected || unStakeLoading}
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
              {formatEthFixed(withdrawal.withdrawableAmount)}
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
          loading={withdrawLoading}
          disabled={!canWithdraw || withdrawLoading}
          onClick={handleWithdraw}
          className='w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
        >
          Withdraw
        </Button>
      </Card>
    </motion.div>
  );
};
