import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiInfo, FiChevronLeft, FiChevronRight, FiExternalLink } from 'react-icons/fi';
import { useAdminData } from '../context/AdminDataContext';

const PopUpAd = () => {
  const { popupAds } = useAdminData();
  const [isOpen, setIsOpen] = useState(false);
  const [currentAdIdx, setCurrentAdIdx] = useState(0);

  // Filter all active ad campaigns from context
  const activeAds = popupAds?.filter((ad) => ad.status === 'Active') || [];

  useEffect(() => {
    if (activeAds.length === 0) return;

    const showTimer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => clearTimeout(showTimer);
  }, [activeAds]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const nextAd = (e) => {
    e.stopPropagation();
    setCurrentAdIdx((prev) => (prev + 1) % activeAds.length);
  };

  const prevAd = (e) => {
    e.stopPropagation();
    setCurrentAdIdx((prev) => (prev - 1 + activeAds.length) % activeAds.length);
  };

  if (activeAds.length === 0) return null;

  const currentAd = activeAds[currentAdIdx];

  const renderModal = () => {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 backdrop-blur-md select-none"
          >
            {/* Click outside to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={handleClose}></div>

            {/* Nav Arrows (Hidden on mobile if tap area is used, but visible on desktop) */}
            {activeAds.length > 1 && (
              <>
                <button
                  onClick={prevAd}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-[999999] text-white hover:text-red-500 p-3 text-3xl bg-black/50 hover:bg-black/80 rounded-full transition-all cursor-pointer hidden md:block"
                  aria-label="Previous Advertisement"
                >
                  <FiChevronLeft />
                </button>

                <button
                  onClick={nextAd}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-[999999] text-white hover:text-red-500 p-3 text-3xl bg-black/50 hover:bg-black/80 rounded-full transition-all cursor-pointer hidden md:block"
                  aria-label="Next Advertisement"
                >
                  <FiChevronRight />
                </button>
              </>
            )}

            {/* Story-Style Centered Box */}
            <motion.div
              key={currentAdIdx}
              initial={{ scale: 0.92, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: -15, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-sm aspect-[9/16] bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-50 flex flex-col justify-between p-4"
            >
              {/* Progress and Profile Header */}
              <div className="z-10 w-full space-y-3">
                {/* Horizontal Progress bar indicators */}
                {activeAds.length > 1 && (
                  <div className="w-full flex gap-1 h-1 select-none">
                    {activeAds.map((_, index) => (
                      <div 
                        key={index}
                        className={`h-full rounded flex-grow transition-all duration-300 ${
                          index === currentAdIdx 
                            ? 'bg-red-655 w-full' 
                            : index < currentAdIdx 
                              ? 'bg-white' 
                              : 'bg-white/30'
                        }`}
                      ></div>
                    ))}
                  </div>
                )}

                {/* Header Profile view style */}
                <div className="flex items-center justify-between text-[10px] font-black text-white/50 uppercase tracking-widest border-b border-white/10 pb-2">
                  <span className="flex items-center gap-1.5"><FiInfo className="text-red-500" /> SPONSORED STORY ({currentAdIdx + 1}/{activeAds.length})</span>
                  <button
                    onClick={handleClose}
                    className="text-white/70 hover:text-red-500 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                    aria-label="Dismiss Ad"
                  >
                    <FiX className="text-xs" />
                  </button>
                </div>
              </div>

              {/* Background Story Image */}
              <div className="absolute inset-0 bg-neutral-950 z-0 flex items-center justify-center">
                <img 
                  src={currentAd.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80"} 
                  alt={currentAd.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/45 pointer-events-none"></div>
              </div>

              {/* Tap navigation zones for mobile */}
              {activeAds.length > 1 && (
                <div className="absolute inset-0 z-10 flex">
                  <div className="w-1/3 h-full cursor-w-resize" onClick={prevAd}></div>
                  <div className="w-1/3 h-full"></div>
                  <div className="w-1/3 h-full cursor-e-resize" onClick={nextAd}></div>
                </div>
              )}

              {/* Ad text details & CTA */}
              <div className="z-20 w-full space-y-4 pt-16">
                <p className="text-white text-sm font-extrabold leading-relaxed drop-shadow-md text-center px-2">
                  {currentAd.title}
                </p>

                <div className="w-full grid grid-cols-2 gap-3 pt-1 border-t border-white/10">
                  <button
                    onClick={handleClose}
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border border-white/5"
                  >
                    CLOSE / SKIP
                  </button>
                  <a
                    href={currentAd.redirectUrl || "https://images.unsplash.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClose}
                    className="w-full py-2.5 bg-red-655 hover:bg-red-750 text-white flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    <span>VISIT SITE</span>
                    <FiExternalLink />
                  </a>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return typeof document !== 'undefined' ? createPortal(renderModal(), document.body) : null;
};

export default PopUpAd;
