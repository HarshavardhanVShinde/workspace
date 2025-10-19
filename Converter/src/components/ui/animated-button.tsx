"use client";
import { motion } from 'framer-motion';
import clsx from 'clsx';
import React from 'react';

type AnimatedButtonProps = Omit<React.ComponentPropsWithoutRef<typeof motion.button>, 'children'> & {
  variant?: 'primary' | 'outline' | 'ghost';
  iconRight?: React.ReactNode;
  asChild?: boolean;
  children: React.ReactNode;
};

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  className,
  children,
  variant = 'primary',
  iconRight,
  asChild = false,
  ...rest
}) => {
  const base = 'relative inline-flex items-center justify-center gap-2 rounded-xl font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand.indigo transition-colors disabled:opacity-60 disabled:cursor-not-allowed';
  const variants: Record<string,string> = {
    primary: 'bg-gradient-to-r from-brand.indigo to-brand.indigoLight text-white shadow-soft hover:from-brand.indigoLight hover:to-brand.indigo focus-visible:ring-offset-transparent',
    outline: 'border border-brand.indigo/40 text-brand.indigo hover:bg-brand.indigo/10',
    ghost: 'text-brand.indigo hover:bg-brand.indigo/10',
  };
  const Comp: any = asChild ? motion.div : motion.button
  return (
    <Comp
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={clsx(base, variants[variant], 'px-6 py-3', className)}
      {...rest}
    >
      <span>{children as React.ReactNode}</span>
      {iconRight && <span className="motion-reduce:hidden" aria-hidden>{iconRight}</span>}
    </Comp>
  );
};
