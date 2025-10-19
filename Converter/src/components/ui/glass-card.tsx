import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

type GlassCardProps = React.ComponentPropsWithoutRef<typeof motion.div> & {
  hover?: boolean;
  delay?: number;
  title?: string;
  subtitle?: string;
};

export const GlassCard: React.FC<GlassCardProps> = ({
  className,
  children,
  hover = true,
  delay = 0,
  title,
  subtitle,
  ...rest
}) => {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
      className={clsx(
        'relative rounded-2xl border border-white/30 bg-white/60 dark:bg-white/10 backdrop-blur-xl shadow-glass',
        'before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/70 before:to-white/20 dark:before:from-white/10 dark:before:to-white/5 before:pointer-events-none',
        'overflow-hidden',
        hover && 'transition-transform duration-300 will-change-transform hover:-translate-y-1 hover:shadow-soft-lg',
        className
      )}
      {...rest}
    >
      {/* subtle highlight */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-white/40 blur-3xl dark:bg-white/10" />
      <div className="relative z-10 p-6 sm:p-8">
        {title ? (
          <div className="mb-4">
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h3>
            {subtitle ? (
              <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-300">{subtitle}</p>
            ) : null}
          </div>
        ) : null}
        {children as React.ReactNode}
      </div>
    </motion.div>
  );
};
