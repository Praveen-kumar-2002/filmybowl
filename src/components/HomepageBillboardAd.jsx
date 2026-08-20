import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiVolume2, FiExternalLink, FiX } from 'react-icons/fi';
import { useAdminData } from '../context/AdminDataContext';

const HomepageBillboardAd = () => {
  const { settings } = useAdminData();
  const [isOpen, setIsOpen] = useState(true);
  const [countdown, setCountdown] = useState(30);

  // Retrieve ad image and link from settings with fallback values
  const adImage = settings?.billboardAdImage || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80";
  const adLink = settings?.billboardAdLink || "https://images.unsplash.com";

  useEffect(() => {
    // Check if the billboard ad was already skipped in this session
    const isSkipped = sessionStorage.getItem('home_billboard_ad_skipped');
    if (isSkipped === 'true') {
      setIsOpen(false);
      return;
    }

    // Interval countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('home_billboard_ad_skipped', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0, margin: 0, padding: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="w-full overflow-hidden bg-neutral-950 border-b border-red-650/15 relative"
        >
          {/* Billboard Ad Main Content Area */}
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 relative flex flex-col items-center">
            
            {/* Header info */}
            <div className="w-full flex items-center justify-between text-[10px] font-black text-neutral-400 uppercase tracking-widest pb-2 mb-2 border-b border-neutral-800">
              <span className="flex items-center gap-1.5"><FiVolume2 className="text-red-500 text-xs animate-bounce" /> SPONSORED BILLBOARD AD</span>
              <span className="font-mono text-red-500">CLOSES AUTOMATICALLY IN {countdown}S</span>
            </div>

            {/* Banner Link Wrapper */}
            <a 
              href={adLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-48 md:h-64 rounded-xl overflow-hidden relative block group border border-neutral-800 hover:border-red-600/30 transition-all duration-300 shadow-lg"
            >
              {/* Background Grid Pattern */}
              <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none z-10"></div>
              
              {/* Banner Image */}
              <img 
                src={adImage} 
                alt="Sponsored Campaign Advertisement" 
                className="w-full h-full object-cover transform duration-700 group-hover:scale-[1.02]"
              />

              {/* Hover Overlay Visual */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 z-20">
                <div className="text-left space-y-1">
                  <span className="px-2 py-0.5 bg-red-600 text-white font-black text-[9px] uppercase tracking-wider rounded">SPONSORED</span>
                  <h4 className="text-sm font-black text-white">Click to check out the details!</h4>
                </div>
                <div className="p-2 bg-red-600 text-white rounded-full shadow-md text-sm">
                  <FiExternalLink />
                </div>
              </div>
            </a>

            {/* Skip Ad Floating Panel */}
            <div className="mt-3.5 flex items-center gap-3">
              {/* Radial countdown counter */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full text-[10px] font-bold text-neutral-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span>COUNTDOWN: {countdown}s</span>
              </div>

              {/* Action Close button */}
              <button
                onClick={handleClose}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-[11px] uppercase tracking-widest rounded-full transition-all flex items-center gap-1 shadow-md"
              >
                <span>SKIP AD</span>
                <FiX className="text-xs" />
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomepageBillboardAd;
