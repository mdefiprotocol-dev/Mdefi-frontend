import React from 'react';
import { AnimatedDollarCoin, AnimatedDollarCoinProps } from './AnimatedDollarCoin';

export interface DollarAmountProps {
  amount: number | string;
  coinSize?: AnimatedDollarCoinProps['size'];
  fractionDigits?: number;
  className?: string;
  textClassName?: string;
  prefix?: string;
  suffix?: string;
  glow?: boolean;
}

export const DollarAmount: React.FC<DollarAmountProps> = ({
  amount,
  coinSize = 'sm',
  fractionDigits = 2,
  className = '',
  textClassName = '',
  prefix = '',
  suffix = '',
  glow = true,
}) => {
  const formattedAmount =
    typeof amount === 'number'
      ? amount.toLocaleString('en-US', {
          minimumFractionDigits: fractionDigits,
          maximumFractionDigits: fractionDigits,
        })
      : amount;

  return (
    <span className={`inline-flex items-center gap-1.5 align-middle select-none font-mono ${className}`}>
      <AnimatedDollarCoin size={coinSize} glow={glow} />
      <span className={textClassName}>
        {prefix}
        {formattedAmount}
        {suffix ? ` ${suffix}` : ''}
      </span>
    </span>
  );
};

export default DollarAmount;
