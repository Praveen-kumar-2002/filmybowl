import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminData } from '../context/AdminDataContext';

const HomepageBillboardAd = () => {
  const { settings } = useAdminData();
  const [isOpen, setIsOpen] = useState(true);

  // Retrieve ad image and link from settings with fallback values
  const adImage = settings?.billboardAdImage || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80";
  const adLink = settings?.billboardAdLink || "https://images.unsplash.com";
  const adTitle = settings?.websiteName ? `"${settings.websiteName} Exclusive Partner Campaign"` : `"Irumudi Worldwide Theaters"`;

  useEffect(() => {
    // Check if the billboard ad was already skipped in this session
    const isSkipped = sessionStorage.getItem('home_billboard_ad_skipped');
    if (isSkipped === 'true') {
      setIsOpen(false);
      return;
    }

    // Lock body scrolling when the takeover is open
    document.body.style.overflow = 'hidden';

    // Silent 30-second auto-close timer (runs in background with no visible output)
    const timer = setTimeout(() => {
      handleClose();
    }, 30000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('home_billboard_ad_skipped', 'true');
    document.body.style.overflow = 'unset';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 bg-[#f0f2f5] z-[9999] overflow-y-auto flex flex-col font-sans select-none"
        >
          {/* Header Bar */}
          <div className="w-full bg-white border-b border-neutral-200 h-14 flex items-center justify-between px-4 md:px-8 shrink-0">
            {/* Left: Branding Logo */}
            <div className="flex items-center py-1">
              <img 
                src="/cineveduka-logo.png" 
                alt="Cineveduka Logo" 
                className="h-8 md:h-9 w-auto object-contain"
              />
            </div>

            {/* Center: "Advertisement" label */}
            <div className="text-[11px] md:text-xs font-semibold text-neutral-500 tracking-wide">
              Advertisement
            </div>

            {/* Right: "Skip Ad" Button */}
            <div>
              <button
                onClick={handleClose}
                className="bg-[#e0f2fe] hover:bg-[#bae6fd] active:scale-95 text-[#0369a1] font-bold text-[11px] md:text-xs px-4 py-1.5 border border-[#bae6fd] rounded transition-all cursor-pointer"
              >
                Skip Ad
              </button>
            </div>
          </div>

          {/* Ad Main Content Area */}
          <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 space-y-4">
            
            {/* Centered Campaign Link Title */}
            <a 
              href={adLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0369a1] hover:underline font-bold text-xs md:text-sm tracking-wide text-center"
            >
              {adTitle}
            </a>

            {/* Giant Centered Image Banner */}
            <a 
              href={adLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-4xl aspect-[16/10] md:aspect-[16/9.5] bg-white rounded shadow-md overflow-hidden border border-neutral-300/40 relative block group"
            >
              <img 
                src={adImage} 
                alt="Takeover Campaign Poster" 
                className="w-full h-full object-contain md:object-cover transform duration-500 group-hover:scale-[1.01]"
              />
            </a>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomepageBillboardAd;
