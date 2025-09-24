import { motion } from 'motion/react';
import type { FC, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface ICardProps extends PropsWithChildren {
  className?: string;
  /** 动画延迟时间 */
  animationDelay?: number;
}

export const Card: FC<ICardProps> = ({
  children,
  className,
  animationDelay = 0.5,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: animationDelay }}
      className={cn(
        'border-[var(--sidebar-senconed)] w-full rounded-3xl border p-3 shadow-2xl',
        'hover-3d-tilt',
        'bg-grid-animated',
        className,
      )}
    >
      {children}
    </motion.div>
  );
};
