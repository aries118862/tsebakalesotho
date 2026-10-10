import { useEffect, useState } from 'react';

function AnimatedMetric({ value, suffix }) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCurrentValue(value);
      return undefined;
    }

    const duration = 1800;
    let animationFrame;
    let startTime;

    function updateCount(timestamp) {
      if (startTime === undefined) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - ((1 - progress) ** 3);
      setCurrentValue(Math.round(value * easedProgress));

      if (progress < 1) animationFrame = window.requestAnimationFrame(updateCount);
    }

    animationFrame = window.requestAnimationFrame(updateCount);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [value]);

  return (
    <strong aria-label={`${value.toLocaleString('en-US')}${suffix}`} className="animated-metric">
      {currentValue.toLocaleString('en-US')}<span>{suffix}</span>
    </strong>
  );
}

export default AnimatedMetric;
