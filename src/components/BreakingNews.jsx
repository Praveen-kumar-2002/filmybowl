import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const BreakingNews = ({ articles = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const breakingArticles = articles.slice(0, 5); // Take top 5 for breaking news

  useEffect(() => {
    if (!isPlaying || breakingArticles.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % breakingArticles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, breakingArticles.length]);

  if (breakingArticles.length === 0) return null;

  const currentArticle = breakingArticles[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % breakingArticles.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + breakingArticles.length) % breakingArticles.length);
  };

  return (
    <div className="w-full bg-red-700 dark:bg-red-950 text-white py-2 px-4 shadow-md overflow-hidden relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-3">
        {/* Badge */}
        <div className="flex items-center gap-1.5 shrink-0 bg-white text-red-700 dark:bg-red-900 dark:text-white px-3 py-1 rounded font-bold text-xs uppercase tracking-wider animate-pulse select-none">
          <FiTrendingUp className="text-sm" />
          <span>తాజా వార్తలు</span>
        </div>

        {/* Content Slider */}
        <div 
          className="flex-grow overflow-hidden relative min-h-[24px] flex items-center justify-center md:justify-start w-full"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full text-center md:text-left text-sm md:text-base font-medium truncate"
            >
              <Link 
                to={`/news/${currentArticle.id}`} 
                className="hover:underline hover:text-red-100 transition-colors duration-150"
              >
                <span className="bg-red-800 dark:bg-red-900 px-2 py-0.5 rounded text-xs mr-2 border border-red-500/30">
                  {currentArticle.categoryTelugu}
                </span>
                {currentArticle.title}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0 select-none">
          <button 
            onClick={handlePrev} 
            className="p-1 rounded-full hover:bg-red-600 dark:hover:bg-red-900 transition-colors"
            aria-label="Previous News"
          >
            <FiChevronLeft className="text-lg" />
          </button>
          <button 
            onClick={handleNext} 
            className="p-1 rounded-full hover:bg-red-600 dark:hover:bg-red-900 transition-colors"
            aria-label="Next News"
          >
            <FiChevronRight className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;
