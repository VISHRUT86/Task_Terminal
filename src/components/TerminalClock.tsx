import React, { useState, useEffect } from 'react';

const TerminalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  return (
    <div className="terminal-window p-4 mb-6">
      <div className="text-center">
        <div className="terminal-glow text-2xl md:text-3xl font-bold mb-2">
          {formatTime(time)}
        </div>
        <div className="terminal-text text-sm md:text-base opacity-70">
          {formatDate(time)} | SYSTEM OPERATIONAL
        </div>
      </div>
    </div>
  );
};

export default TerminalClock;