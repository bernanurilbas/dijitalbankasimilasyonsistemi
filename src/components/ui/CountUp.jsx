import React, { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

const CountUp = ({ 
  value, 
  duration = 0.8, 
  currency = '', 
  isFloat = true 
}) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const startValue = 0;
    const endValue = parseFloat(value) || 0;

    const controls = animate(startValue, endValue, {
      duration,
      ease: 'easeOut',
      onUpdate(currentValue) {
        if (currency) {
          node.textContent = new Intl.NumberFormat('tr-TR', {
            style: currency === 'GOLD' ? 'decimal' : 'currency',
            currency: currency === 'GOLD' ? undefined : currency,
            minimumFractionDigits: isFloat ? 2 : 0,
            maximumFractionDigits: isFloat ? 2 : 0
          }).format(currentValue) + (currency === 'GOLD' ? ' gr' : '');
        } else {
          node.textContent = new Intl.NumberFormat('tr-TR', {
            minimumFractionDigits: isFloat ? 2 : 0,
            maximumFractionDigits: isFloat ? 2 : 0
          }).format(currentValue);
        }
      }
    });

    return () => controls.stop();
  }, [value, duration, currency, isFloat]);

  return <span ref={nodeRef} />;
};

export default CountUp;
