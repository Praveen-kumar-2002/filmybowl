import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiInfo, FiExternalLink } from 'react-icons/fi';
import { useAdminData } from '../context/AdminDataContext';

const PopUpAd = () => {
  const { popupAds } = useAdminData();
  const [isOpen, setIsOpen] = useState(false);

  // Find the active advertisement from context
  const activeAd = popupAds?.find((ad) => ad.status === 'Active') || null;

  useEffect(() => {
    if (!activeAd) return;

    // Show popup ad after 3 seconds delay if not already shown in this session
    const hasBeenShown = sessionStorage.getItem('popup_ad_shown');
    if (hasBeenShown === 'true') return;

    const showTimer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem('popup_ad_shown', 'true');
    }, 3000);

    return () => clearTimeout(showTimer);
  }, [activeAd]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!activeAd) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-md select-none"
        >
          {/* Centered Modal Ad Container */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: -20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-2xl p-5 flex flex-col items-center text-center gap-4"
          >
            {/* Header bar with info */}
            <div className="w-full flex items-center justify-between text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
              <span className="flex items-center gap-1"><FiInfo /> SPONSORED POP-UP</span>
              <button
                onClick={handleClose}
                className="text-neutral-500 hover:text-red-650 p-1.5 bg-neutral-100 dark:bg-neutral-850 rounded-full transition-colors"
                aria-label="Close Ad"
              >
                <FiX className="text-sm" />
              </button>
            </div>

            {/* Ad Graphic Banner Image */}
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden relative bg-neutral-100 dark:bg-neutral-950 border border-neutral-205 dark:border-neutral-850">
              <img
                src={activeAd.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80"}
                alt={activeAd.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-red-600 text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                ADVERTISEMENT
              </span>
            </div>

            {/* Ad text descriptions */}
            <div className="space-y-1">
              <h3 className="text-sm md:text-base font-extrabold text-neutral-900 dark:text-white leading-snug">
                {activeAd.title}
              </h3>
              <p className="text-[11px] md:text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                ప్రత్యేక ఆఫర్ల కోసం క్రింది లింక్ ని క్లిక్ చేయండి. (Click below for special offers).
              </p>
            </div>

            {/* Close & Action Buttons */}
            <div className="w-full grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleClose}
                className="w-full py-2.5 border border-neutral-250 dark:border-neutral-750 text-neutral-600 dark:text-neutral-350 hover:bg-neutral-50 dark:hover:bg-neutral-850 text-xs font-bold rounded-xl transition-all"
              >
                CLOSE / SKIP
              </button>
              
              <a
                href={activeAd.redirectUrl || "https://images.unsplash.com"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className="w-full py-2.5 bg-red-650 hover:bg-red-750 text-white flex items-center justify-center gap-1.5 text-xs font-extrabold rounded-xl shadow-md transition-colors"
              >
                <span>OPEN LINK</span>
                <FiExternalLink />
              </a>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopUpAd;
