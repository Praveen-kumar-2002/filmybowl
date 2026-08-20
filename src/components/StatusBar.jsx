import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const StatusBar = () => {
  const [activeStoryIdx, setActiveStoryIdx] = useState(null);
  const scrollContainerRef = useRef(null);

  const celebrityStories = [
    {
      name: 'Preity',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      storyImg: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      caption: 'కొత్త షూటింగ్ లొకేషన్ నుండి తాజా లుక్! 🎬📸',
      link: '/category/film-news'
    },
    {
      name: 'Nabha',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      storyImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      caption: 'వీకెండ్ వైబ్స్.. హాపీ సండే! ✨☕',
      link: '/category/film-news'
    },
    {
      name: 'Abhirami',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
      storyImg: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80',
      caption: 'నయా ట్రెండీ వేర్ లో మెరుస్తున్న భామ 💃🌟',
      link: '/category/film-news'
    },
    {
      name: 'RamCharan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      storyImg: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
      caption: 'గేమ్ ఛేంజర్ షూటింగ్ అప్‌డేట్స్ త్వరలోనే! 🔥😎',
      link: '/category/film-news'
    },
    {
      name: 'Lavanya',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80',
      storyImg: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
      caption: 'కుటుంబ సభ్యులతో కలిసి దిగిన క్యూట్ పిక్చర్ 👨‍👩‍👧❤️',
      link: '/category/film-news'
    },
    {
      name: 'Bellamkonda',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
      storyImg: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      caption: 'జిమ్ లో సరికొత్త వర్కౌట్ సెషన్! 💪🔥',
      link: '/category/film-news'
    },
    {
      name: 'Hebah',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80',
      storyImg: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
      caption: 'సెలవు దినాల్లో ఎంజాయ్ చేస్తున్నా.. 🏖️🍹',
      link: '/category/film-news'
    },
    {
      name: 'Malavika',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&h=150&q=80',
      storyImg: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&w=800&q=80',
      caption: 'తదుపరి సినిమా ప్రమోషన్స్ ప్రారంభం! 🎤✨',
      link: '/category/film-news'
    },
    {
      name: 'Keerthy',
      avatar: 'https://images.unsplash.com/photo-1558203728-00f45181dd84?auto=format&fit=crop&w=150&h=150&q=80',
      storyImg: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      caption: 'ట్రెడిషనల్ చీర కట్టులో మెరిసిపోతున్న కీర్తి సురేష్ 🌸🥻',
      link: '/category/film-news'
    },
    {
      name: 'Rashmika',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&h=150&q=80',
      storyImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      caption: 'అందరికీ నమస్కారం! లవ్ యు ఆల్ 🫶❤️',
      link: '/category/film-news'
    }
  ];

  // Lock body scrolling when story viewer is active
  useEffect(() => {
    if (activeStoryIdx !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeStoryIdx]);

  // Keyboard navigation listener
  useEffect(() => {
    if (activeStoryIdx === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        nextStory();
      } else if (e.key === 'ArrowLeft') {
        prevStory();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStoryIdx]);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const nextStory = () => {
    if (activeStoryIdx !== null) {
      setActiveStoryIdx((activeStoryIdx + 1) % celebrityStories.length);
    }
  };

  const prevStory = () => {
    if (activeStoryIdx !== null) {
      setActiveStoryIdx((activeStoryIdx - 1 + celebrityStories.length) % celebrityStories.length);
    }
  };

  const closeLightbox = () => {
    setActiveStoryIdx(null);
  };

  const renderLightbox = () => {
    if (activeStoryIdx === null) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 backdrop-blur-md select-none"
        >
          {/* Click outside to close */}
          <div className="absolute inset-0 cursor-pointer" onClick={closeLightbox}></div>

          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-red-500 p-3 text-2xl z-[999999] bg-black/50 hover:bg-black/80 rounded-full transition-all cursor-pointer"
            aria-label="Close Story"
          >
            <FiX />
          </button>

          {/* Nav Arrows */}
          <button
            onClick={prevStory}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-[999999] text-white hover:text-red-500 p-3 text-3xl bg-black/50 hover:bg-black/80 rounded-full transition-all cursor-pointer hidden md:block"
            aria-label="Previous Story"
          >
            <FiChevronLeft />
          </button>

          <button
            onClick={nextStory}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-[999999] text-white hover:text-red-500 p-3 text-3xl bg-black/50 hover:bg-black/80 rounded-full transition-all cursor-pointer hidden md:block"
          >
            <FiChevronRight />
          </button>

          {/* Story Card Box */}
          <motion.div
            key={activeStoryIdx}
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: -30, opacity: 0 }}
            transition={{ duration: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm aspect-[9/16] bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-50 flex flex-col justify-between p-4"
          >
            {/* Background Story Image */}
            <div className="absolute inset-0 bg-neutral-950 z-0 flex items-center justify-center">
              <img 
                src={celebrityStories[activeStoryIdx].storyImg} 
                alt="Story content" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/45 pointer-events-none"></div>
            </div>

            {/* Progress and Profile Header */}
            <div className="z-10 w-full space-y-3">
              {/* Horizontal Progress bar indicator */}
              <div className="w-full flex gap-1 h-1 select-none">
                {celebrityStories.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-full rounded flex-grow transition-all duration-300 ${
                      index === activeStoryIdx 
                        ? 'bg-red-600 w-full' 
                        : index < activeStoryIdx 
                          ? 'bg-white' 
                          : 'bg-white/30'
                    }`}
                  ></div>
                ))}
              </div>

              {/* Profile Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full border-2 border-red-500 overflow-hidden">
                    <img 
                      src={celebrityStories[activeStoryIdx].avatar} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col text-white">
                    <span className="text-xs font-bold">{celebrityStories[activeStoryIdx].name}</span>
                    <span className="text-[9px] text-neutral-350">Active now</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tap areas for mobile stories navigation */}
            <div className="absolute inset-0 z-10 flex">
              <div className="w-1/3 h-full cursor-w-resize" onClick={prevStory}></div>
              <div className="w-1/3 h-full"></div>
              <div className="w-1/3 h-full cursor-e-resize" onClick={nextStory}></div>
            </div>

            {/* Story text caption & Call to action */}
            <div className="z-20 w-full space-y-4 pt-16">
              <p className="text-white text-sm font-semibold leading-relaxed drop-shadow-md text-center px-2">
                {celebrityStories[activeStoryIdx].caption}
              </p>

              <div className="w-full pt-3 border-t border-white/10 flex items-center justify-center">
                <Link
                  to={celebrityStories[activeStoryIdx].link}
                  onClick={closeLightbox}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  <FiLink />
                  <span>వార్తలు చూడండి (View News)</span>
                </Link>
              </div>
            </div>

          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="w-full relative py-4 border-b border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-955/20 select-none">
      
      {/* Scroll controls */}
      <button 
        onClick={() => handleScroll('left')} 
        className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-red-655 cursor-pointer"
        aria-label="Scroll Left"
      >
        <FiChevronLeft className="text-lg" />
      </button>

      <button 
        onClick={() => handleScroll('right')} 
        className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-red-655 cursor-pointer"
        aria-label="Scroll Right"
      >
        <FiChevronRight className="text-lg" />
      </button>

      {/* Stories list container */}
      <div 
        ref={scrollContainerRef}
        className="w-full overflow-x-auto flex items-center gap-6 px-10 py-1 no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {celebrityStories.map((story, idx) => (
          <div 
            key={story.name} 
            onClick={() => setActiveStoryIdx(idx)}
            className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group text-center"
          >
            {/* Circular Avatar Frame */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-[3px] bg-gradient-to-tr from-yellow-500 via-red-500 to-pink-500 hover:scale-105 duration-300 transform shadow-md relative">
              <div className="w-full h-full rounded-full border-2 border-white dark:border-neutral-950 overflow-hidden">
                <img 
                  src={story.avatar} 
                  alt={story.name} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Active dot */}
              {idx < 3 && (
                <span className="absolute bottom-0 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-neutral-950 rounded-full animate-pulse"></span>
              )}
            </div>
            
            {/* Celebrity name */}
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-300 group-hover:text-red-655 transition-colors">
              {story.name}
            </span>
          </div>
        ))}
      </div>

      {/* Stories Lightbox Overlay using Portal */}
      {typeof document !== 'undefined' && createPortal(renderLightbox(), document.body)}

    </div>
  );
};

export default StatusBar;
