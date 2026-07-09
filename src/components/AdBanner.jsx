import React from 'react';

const AdBanner = ({ slotId, size = 'leaderboard', className = '' }) => {
  // Styles based on size
  const sizeClasses = {
    leaderboard: 'w-full h-24 md:h-32 text-xs md:text-sm',
    rectangle: 'w-full h-64 md:h-80 text-sm',
    sidebar: 'w-full h-96 text-sm',
    inline: 'w-full h-28 md:h-36 text-xs md:text-sm',
  };

  return (
    <div className={`my-6 flex justify-center items-center ${className}`}>
      <div className={`relative flex flex-col justify-center items-center bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden transition-all duration-300 hover:border-red-600/30 group shadow-sm max-w-full ${sizeClasses[size] || sizeClasses.leaderboard}`}>
        {/* Subtle grid background to look premium */}
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900 opacity-20 pointer-events-none"></div>
        
        {/* Ad Indicator */}
        <span className="absolute top-1.5 left-2 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded">
          ADVERTISEMENT
        </span>
        
        {/* Content */}
        <div className="text-center p-4 z-10">
          <p className="font-semibold text-neutral-400 dark:text-neutral-600 transition-colors duration-300 group-hover:text-red-500/80">
            {size === 'leaderboard' || size === 'inline' ? 'Premium Ad Space' : 'Sponsored Advertisement'}
          </p>
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 font-mono">
            {slotId || 'Google AdSense / Pop-Up Partner'}
          </p>
        </div>

        {/* Decorative corner borders to look like a premium tech/news platform ad container */}
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neutral-300 dark:border-neutral-700 group-hover:border-red-500 transition-colors duration-300"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neutral-300 dark:border-neutral-700 group-hover:border-red-500 transition-colors duration-300"></div>
      </div>
    </div>
  );
};

export default AdBanner;
