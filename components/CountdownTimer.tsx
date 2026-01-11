import React, { useState, useEffect } from 'react';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: Date;
  onExpire?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isExpired, setIsExpired] = useState(false);

  // Calculate time remaining based on current system time
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const target = targetDate.getTime();
    const difference = target - now;

    if (difference <= 0) {
      setIsExpired(true);
      onExpire?.();
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  useEffect(() => {
    // Set initial time on mount
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (num: number): string => String(num).padStart(2, '0');

  // Common classes for the time blocks to ensure consistency
  const blockClass = "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-lg font-bold text-center shadow-lg transition-all duration-300 " +
                     "px-3 py-2 text-xl min-w-[55px] " + // Mobile styles
                     "sm:px-6 sm:py-4 sm:text-3xl sm:min-w-[80px]"; // Desktop styles

  // Common classes for labels
  const labelClass = "font-semibold text-gray-600 uppercase tracking-wide " +
                     "text-[10px] mt-1 " + // Mobile styles
                     "sm:text-sm sm:mt-2"; // Desktop styles

  // Common classes for separators
  const separatorClass = "font-bold text-gray-400 " +
                         "text-xl -mt-4 " + // Mobile styles
                         "sm:text-3xl sm:-mt-6"; // Desktop styles

  return (
    <div className="flex gap-2 sm:gap-4 justify-center items-center">
      {/* Days */}
      <div className="flex flex-col items-center">
        <div className={blockClass}>
          {pad(timeLeft.days)}
        </div>
        <p className={labelClass}>Days</p>
      </div>

      {/* Separator */}
      <div className={separatorClass}>:</div>

      {/* Hours */}
      <div className="flex flex-col items-center">
        <div className={blockClass}>
          {pad(timeLeft.hours)}
        </div>
        <p className={labelClass}>Hours</p>
      </div>

      {/* Separator */}
      <div className={separatorClass}>:</div>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <div className={blockClass}>
          {pad(timeLeft.minutes)}
        </div>
        <p className={labelClass}>Minutes</p>
      </div>

      {/* Separator */}
      <div className={separatorClass}>:</div>

      {/* Seconds */}
      <div className="flex flex-col items-center">
        <div className={blockClass}>
          {pad(timeLeft.seconds)}
        </div>
        <p className={labelClass}>Secs</p>
      </div>

      {isExpired && (
        <div className="text-center text-xl sm:text-2xl font-bold text-red-600 ml-4">
          Offer Expired!
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;