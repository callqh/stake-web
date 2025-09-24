'use client';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import type { HeaderConfig, HeaderTab } from '@/types/header';

interface HeaderProps extends Partial<HeaderConfig> {
  className?: string;
  exteral?: ReactNode | string;
}

export default function Header({
  tabs = [],
  onTabChange,
  showMobileMenu = true,
  className,
  exteral,
}: HeaderProps) {
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: HeaderTab) => {
    if (tab.disabled) return;
    onTabChange?.(tab.id);
    tab.onClick?.();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.header
      className={cn(
        'flex w-full border-b border-slate-700/50 sticky top-0 z-50',
        'shadow-lg shadow-slate-900/20 backdrop-blur-xl',
        className,
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className='w-full px-10 sm:px-6 lg:px-8'>
        <div className='w-full flex justify-between items-center h-16'>
          {/* Logo/Title */}
          <motion.div
            className='flex-shrink-0'
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Image
              src='/logo.svg'
              alt='Stake Logo'
              width={120}
              height={40}
              className='h-10 w-auto hover:scale-105 transition-transform duration-200'
            />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className='hidden md:block'>
            <div className='flex space-x-1 relative gap-3'>
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  className={cn(
                    'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 m-3',
                    'hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-900',
                    'hover:shadow-lg hover:shadow-cyan-500/20',
                    pathname === tab.id
                      ? 'text-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'text-slate-300 hover:text-white',
                    tab.disabled && 'opacity-50 cursor-not-allowed',
                  )}
                  onClick={() => handleTabClick(tab)}
                  disabled={tab.disabled}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className='flex items-center space-x-2'>
                    {tab.icon && <span className='w-4 h-4'>{tab.icon}</span>}
                    <span>{tab.label}</span>
                  </div>

                  {/* Active Tab Indicator */}
                  {pathname === tab.id && (
                    <motion.div
                      className='absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg -z-10 border border-cyan-500/30'
                      layoutId='activeTab'
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              ))}
              <div className='flex items-center space-x-1 relative ml-6'>
                {exteral}
              </div>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          {showMobileMenu && tabs.length > 0 && (
            <motion.button
              className='md:hidden p-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-900'
              onClick={toggleMobileMenu}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode='wait'>
                {isMobileMenuOpen ? (
                  <motion.div
                    key='close'
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className='w-6 h-6' />
                  </motion.div>
                ) : (
                  <motion.div
                    key='menu'
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className='w-6 h-6' />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className='absolute top-16 right-1 md:hidden border-t border-slate-700/50 bg-slate-900/98 backdrop-blur-sm px-3 rounded-2xl'
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <motion.div
                className='py-4 space-y-2'
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {tabs.map((tab, index) => (
                  <motion.button
                    key={tab.id}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                      'hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-900',
                      'hover:shadow-lg hover:shadow-cyan-500/10',
                      pathname === tab.id
                        ? 'text-cyan-400 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20'
                        : 'text-slate-300 hover:text-white',
                      tab.disabled && 'opacity-50 cursor-not-allowed',
                    )}
                    onClick={() => handleTabClick(tab)}
                    disabled={tab.disabled}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * index, duration: 0.3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className='flex items-center space-x-3'>
                      {tab.icon && <span className='w-5 h-5'>{tab.icon}</span>}
                      <span>{tab.label}</span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
