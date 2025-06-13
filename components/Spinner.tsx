
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-20 h-20 border-[6px]',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-primary-DEFAULT border-t-transparent`}
      ></div>
      {text && <p className="text-slate-600 text-sm">{text}</p>}
    </div>
  );
};

export default Spinner;