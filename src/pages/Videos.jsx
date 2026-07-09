import React, { useState, useEffect } from 'react';
import { videoArticles } from '../data/newsData';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiChevronRight, FiPlay, FiX, FiVideo, FiEye, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Videos = () => {
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);

  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openVideoModal = (url) => {
    setActiveVideoUrl(url);
  };

  const closeVideoModal = () => {
    setActiveVideoUrl(null);
  };

  // Split into 1 featured and others
  const featuredVideo = videoArticles[0];
  const listVideos = videoArticles.slice(1);

  return (
    <div className="space-y-6">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-450 font-medium py-1">
        <Link to="/" className="hover:text-red-600 flex items-center gap-1">
          <FiHome />
          <span>హోమ్</span>
        </Link>
        <FiChevronRight className="text-neutral-400" />
        <span className="text-neutral-900 dark:text-neutral-200 font-bold">వీడియోలు</span>
      </nav>

      {/* Page Header */}
      <div className="border-b border-neutral-250 dark:border-neutral-850 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-7 bg-red-650 rounded-full"></span>
          <h1 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
            <FiVideo className="text-red-600 text-2xl md:text-3xl" />
            <span>వీడియో వార్తలు (Video News)</span>
          </h1>
        </div>
        <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          తాజా రాజకీయ విశ్లేషణలు, గ్రౌండ్ రిపోర్ట్స్, సినిమా ఇంటర్వ్యూలు మరియు మరిన్ని విశేషాలు వీడియో రూపంలో
        </p>
      </div>

      {/* Main Grid: Featured top section */}
      {featuredVideo && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-2xl overflow-hidden p-4 md:p-6 shadow-sm">
          {/* Featured Video Thumbnail */}
          <div className="lg:col-span-2 relative aspect-[16/9] rounded-xl overflow-hidden shadow group bg-neutral-950">
            <img 
              src={featuredVideo.image} 
              alt={featuredVideo.title} 
              className="w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-500"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 group-hover:bg-black/45 transition-colors">
              <button
                onClick={() => openVideoModal(featuredVideo.videoUrl)}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-2xl shadow-xl transition-all duration-300 transform group-hover:scale-110"
                aria-label="Play Featured Video"
              >
                <FiPlay className="translate-x-0.5" />
              </button>
            </div>
            <span className="absolute bottom-4 left-4 bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
              FEATURED VIDEO
            </span>
          </div>

          {/* Featured Video Text info */}
          <div className="flex flex-col justify-between py-2">
            <div className="space-y-4">
              <span className="bg-red-100 dark:bg-red-950/50 text-red-650 dark:text-red-400 font-extrabold text-[10px] uppercase px-2 py-1 rounded w-fit inline-block">
                {featuredVideo.categoryTelugu}
              </span>
              <h2 className="text-lg md:text-2xl font-extrabold text-neutral-900 dark:text-white leading-snug line-clamp-4">
                {featuredVideo.title}
              </h2>
              <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-450 leading-relaxed line-clamp-3 md:line-clamp-4">
                {featuredVideo.description}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-neutral-400 dark:text-neutral-500 pt-4 border-t border-neutral-100 dark:border-neutral-850">
              <span className="flex items-center gap-1"><FiClock /> {featuredVideo.date}</span>
              <span className="flex items-center gap-1"><FiEye /> {featuredVideo.views.toLocaleString()} వీక్షణలు</span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Other Video Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {listVideos.map((video) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-2xl overflow-hidden shadow-sm flex flex-col group"
          >
            {/* Video Thumbnail */}
            <div className="relative aspect-[16/10] bg-neutral-950 w-full overflow-hidden shrink-0">
              <img 
                src={video.image} 
                alt={video.title} 
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors">
                <button
                  onClick={() => openVideoModal(video.videoUrl)}
                  className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-lg shadow-lg transition-all duration-300 transform group-hover:scale-110"
                  aria-label={`Play ${video.title}`}
                >
                  <FiPlay className="translate-x-0.5" />
                </button>
              </div>
              <span className="absolute top-3 left-3 bg-neutral-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                {video.categoryTelugu}
              </span>
            </div>

            {/* Video Info */}
            <div className="p-4 flex flex-col justify-between flex-grow">
              <h3 className="text-sm md:text-base font-extrabold text-neutral-900 dark:text-neutral-150 leading-snug line-clamp-2 hover:text-red-600 cursor-pointer" onClick={() => openVideoModal(video.videoUrl)}>
                {video.title}
              </h3>
              
              <div className="flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-850">
                <span className="flex items-center gap-1"><FiClock /> {video.date}</span>
                <span className="flex items-center gap-1"><FiEye /> {video.views.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Modal Player Overlay */}
      <AnimatePresence>
        {activeVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            {/* Close Button */}
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 text-white hover:text-red-500 p-2 text-2xl"
              aria-label="Close Video Player"
            >
              <FiX />
            </button>

            {/* Iframe Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl aspect-[16/9] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <iframe
                src={`${activeVideoUrl}?autoplay=1`}
                title="YouTube Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Videos;
