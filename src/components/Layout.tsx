'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Home, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { HeaderTab } from '@/types/header';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('/');
  const router = useRouter();
  const headerTabs: HeaderTab[] = [
    {
      id: '/',
      label: 'Stake',
      icon: <Home className='w-4 h-4' />,
      onClick: () => router.push('/'),
    },
    {
      id: '/withdrawal',
      label: 'Withdrawal',
      icon: <TrendingUp className='w-4 h-4' />,
      onClick: () => router.push('/withdrawal'),
    },
    // {
    //   id: 'rewards',
    //   label: '收益',
    //   icon: <TrendingUp className="w-4 h-4" />,
    //   onClick: () => console.log('Navigate to Rewards')
    // },
    // {
    //   id: 'settings',
    //   label: '设置',
    //   icon: <Settings className="w-4 h-4" />,
    //   onClick: () => console.log('Navigate to Settings')
    // }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <motion.div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      {/* 科技感背景装饰 */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse'></div>
        <div
          className='absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse'
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/3 via-transparent to-blue-500/3 rounded-full blur-2xl animate-pulse'
          style={{ animationDelay: '2s' }}
        ></div>

        {/* 网格背景 */}
        <div className='absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]'></div>
      </div>

      <Header
        title='Stake DApp'
        tabs={headerTabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        showMobileMenu={true}
        exteral={<ConnectButton accountStatus='avatar' />}
      />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='w-[50%] relative z-10 container mx-auto px-4 py-8'
      >
        {children}
      </motion.main>
    </motion.div>
  );
}
