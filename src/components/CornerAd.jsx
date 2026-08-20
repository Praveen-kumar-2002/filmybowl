import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiExternalLink } from 'react-icons/fi';
import { useAdminData } from '../context/AdminDataContext';

const CornerAd = () => {
  const { popupAds } = useAdminData();
  const [isOpen, setIsOpen] = useState(false);

  // Get inactive or secondary ad campaigns to show in the corner
  const cornerAd = popupAds?.find(ad => ad.status === 'Active') || null;

  useEffect(() => {
    if (!cornerAd) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, [cornerAd]);

  const handleClose = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    sessionStorage.setItem('corner_ad_closed', 'true');
  };

  if (!cornerAd) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-[999] w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden p-3 space-y-3 hidden sm:block select-none"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between text-[9px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            <span>SPONSORED UPDATE</span>
            <button
              onClick={handleClose}
              className="text-neutral-500 hover:text-red-650 p-1 bg-neutral-50 dark:bg-neutral-800 rounded-full transition-colors cursor-pointer"
              aria-label="Dismiss Ad"
            >
              <FiX className="text-xs" />
            </button>
          </div>

          {/* Ad Image banner */}
          <div className="w-full aspect-video rounded-lg overflow-hidden relative border border-neutral-100 dark:border-neutral-800">
            <img 
              src={cornerAd.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80"} 
              alt={cornerAd.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Ad details and CTA */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-extrabold text-neutral-900 dark:text-white line-clamp-1 leading-tight">
              {cornerAd.title}
            </h4>
            <a
              href={cornerAd.redirectUrl || "https://images.unsplash.com"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              className="w-full py-1.5 bg-red-600 hover:bg-red-750 text-white text-[10px] font-black tracking-wider uppercase rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm"
            >
              <span>Learn More</span>
              <FiExternalLink className="text-[9px]" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CornerAd;
