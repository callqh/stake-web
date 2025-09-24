'use client';

import { Gift, Info, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { formatEther, parseEther } from 'viem';
import { useAccount, useBalance, useChainId, useConfig } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useContract } from '@/hooks/useContract';
import { usePool } from '@/hooks/usePool';
import { useUserData } from '@/hooks/useUserData';
import { retryWithDelay } from '@/lib/retry';
import { formatEthFixed, PID } from '@/lib/utils';

export default () => {
  const [value, setValue] = useState<string>('');
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [claimLoading, setClaimLoading] = useState(false);
  const contract = useContract();
  const { poolData, fetchPool } = usePool();
  const config = useConfig();
  const chainId = useChainId();
  const [stakeLoading, setStakeLoading] = useState(false);
  const { userData, fetchUserData } = useUserData();

  const canClaim = useMemo(
    () => parseFloat(formatEther(userData.pendingMetaNode)) > 0 && isConnected,
    [userData, isConnected],
  );
  /**
   * handle stake click event
   */
  const handleStake = async () => {
    if (!value) {
      toast('Please enter a value!');
      return;
    }
    if (balance && parseEther(value) > balance?.value) {
      toast('Current balance is not enough!');
      return;
    }
    try {
      setStakeLoading(true);
      const res = await contract?.write.depositETH({
        value: parseEther(value),
      });
      if (!res) {
        return;
      }
      const receipt = await waitForTransactionReceipt(config, {
        hash: res,
        chainId,
      });
      if (receipt?.status === 'success') {
        toast.success('Stake success!', {
          description: receipt.blockHash,
        });
        // 重新获取质押数量
        await fetchPool();
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setStakeLoading(false);
    }
  };

  const handleClaim = async () => {
    try {
      setClaimLoading(true);
      const hash = await contract?.write.claim([PID]);
      if (!hash) return;
      const receipt = await waitForTransactionReceipt(config, {
        hash: hash,
        chainId,
      });
      if (receipt?.status === 'success') {
        toast.success('Claim success!', {
          description: receipt.blockHash,
        });
        await fetchUserData();
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setClaimLoading(false);
    }
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
      <motion.div className='grid xl:grid-cols-2 sm:grid-cols-1 gap-6'>
        <Card
          animationDelay={0.2}
          className='w-1xl min-w-1xl mx-auto grid grid-cols-1 gap-16 md:p-12'
        >
          <Card className='border-0 p-6'>
            <div className='flex items-center gap-4'>
              <div className='w-18 h-18 rounded-full mr-6 bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center'>
                <TrendingUp />
              </div>
              <div>
                <p className='text-muted-foreground text-2xl'>Staked Amount</p>
                <p className='text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent'>
                  {formatEthFixed(poolData.stTokenAmount)}
                  ETH
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
              Available: {formatEthFixed(balance?.value)} {balance?.symbol}
            </p>
          </div>
          <div className='flex justify-center'>
            <Button
              loading={stakeLoading}
              onClick={handleStake}
              disabled={!isConnected || stakeLoading}
              className='w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
            >
              {isConnected ? 'Stake ETH' : 'Connect Wallet'}
            </Button>
          </div>
        </Card>

        <Card className='w-1xl mx-auto grid grid-cols-1 gap-16'>
          <div className='space-y-8 sm:space-y-12'>
            {/* Pending Reward Display */}
            <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-4 sm:p-8 bg-gray-800/70 rounded-xl sm:rounded-2xl border border-gray-700/50 group-hover:border-primary-500/50 transition-colors duration-300 shadow-lg'>
              <div className='flex-shrink-0 flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 bg-green-500/10 rounded-full'>
                <Gift className='w-8 h-8 sm:w-10 sm:h-10 text-green-400' />
              </div>
              <div className='flex flex-col justify-center flex-1 min-w-0 items-center sm:items-start'>
                <span className='text-gray-400 text-base sm:text-lg mb-1'>
                  Pending Rewards
                </span>
                <p>
                  <span className='text-3xl sm:text-5xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent leading-tight break-all'>
                    {formatEthFixed(userData.pendingMetaNode)}
                  </span>
                  <span className='bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent leading-tight break-all'>
                    MetaNode
                  </span>
                </p>
              </div>
            </div>

            {/* Info Section */}
            <div className='space-y-4 sm:space-y-6'>
              <div className='bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 sm:p-6'>
                <div className='flex items-start space-x-3'>
                  <Info className='w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0' />
                  <div className='text-sm text-blue-300'>
                    <p className='font-medium mb-1'>How rewards work:</p>
                    <ul className='space-y-1 text-xs'>
                      <li>
                        • Rewards accumulate based on your staked amount and
                        time
                      </li>
                      <li>• You can claim rewards anytime</li>
                      <li>• Rewards are paid in MetaNode tokens</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Claim Button */}
            <div className='pt-4 sm:pt-8'>
              <Button
                loading={claimLoading}
                onClick={handleClaim}
                disabled={!canClaim}
                className='w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              >
                <Gift className='w-6 h-6 sm:w-7 sm:h-7' />
                <span>Claim Rewards</span>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
