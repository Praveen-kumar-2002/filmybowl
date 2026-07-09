import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiInfo, FiExternalLink } from 'react-icons/fi';

const PopUpAd = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    // Show popup ad after 3 seconds delay if not already shown in this session
    const hasBeenShown = sessionStorage.getItem('popup_ad_shown');
    if (hasBeenShown) return;

    const showTimer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem('popup_ad_shown', 'true');
    }, 3000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanClose(true);
    }
  }, [isOpen, countdown]);

  const handleClose = () => {
    if (canClose) {
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm select-none"
        >
          {/* Ad Container Box */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: -20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-2xl p-5 flex flex-col items-center text-center gap-4"
          >
            {/* Header info */}
            <div className="w-full flex items-center justify-between text-[9px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <span className="flex items-center gap-1"><FiInfo /> SPONSORED POP-UP</span>
              {canClose ? (
                <button
                  onClick={handleClose}
                  className="text-neutral-500 hover:text-red-650 p-1 text-sm bg-neutral-100 dark:bg-neutral-850 rounded-full"
                  aria-label="Close Ad"
                >
                  <FiX />
                </button>
              ) : (
                <span className="font-mono text-red-600">CLOSES IN {countdown}S</span>
              )}
            </div>

            {/* Ad Content / Banner Image */}
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden relative bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80"
                alt="Ad offer banner"
                className="w-full h-full object-cover"
              />
              {/* Overlay Badge */}
              <span className="absolute top-3 left-3 bg-red-600 text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                LIMITED OFFER
              </span>
            </div>

            {/* Ad details text */}
            <div className="space-y-1">
              <h3 className="text-sm md:text-base font-extrabold text-neutral-900 dark:text-white leading-snug">
                Gaming Masterclass & Championship 2026
              </h3>
              <p className="text-[11px] md:text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                భారీ బహుమతులతో కూడిన అతిపెద్ద గేమింగ్ లీగ్! ఈరోజే ఉచితంగా నమోదు చేసుకోండి.
              </p>
            </div>

            {/* Call to action & Close Buttons */}
            <div className="w-full grid grid-cols-2 gap-3 pt-2">
              {canClose ? (
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 border border-neutral-250 dark:border-neutral-750 text-neutral-600 dark:text-neutral-350 hover:bg-neutral-50 dark:hover:bg-neutral-850 text-xs font-bold rounded-xl transition-colors"
                >
                  మరోసారి చూపు
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-2.5 border border-neutral-200 dark:border-neutral-800 text-neutral-350 dark:text-neutral-600 text-xs font-bold rounded-xl cursor-not-allowed"
                >
                  దయచేసి వేచి ఉండండి ({countdown}s)
                </button>
              )}
              
              <a
                href="https://images.unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1 text-xs font-extrabold rounded-xl shadow-md transition-colors"
              >
                <span>వివరాలు చూడండి</span>
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
