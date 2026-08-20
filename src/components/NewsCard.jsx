import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiEye, FiArrowRight } from 'react-icons/fi';
import { useAdminData } from '../context/AdminDataContext';
import { translateText } from '../utils/translator';

const NewsCard = ({ article, layout = 'grid' }) => {
  const { id, title, description, category, categoryTelugu, image, date, views } = article;
  const { language } = useAdminData();

  // Format date to readable string
  const formattedDate = new Date(date).toLocaleDateString(language === 'te' ? 'te-IN' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group p-3"
      >
        {/* Card Image */}
        <div className="w-full sm:w-2/5 aspect-[16/10] sm:aspect-square md:aspect-[16/10] shrink-0 rounded-lg overflow-hidden relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <Link
            to={`/category/${category}`}
            className="absolute top-2 left-2 bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow-sm hover:bg-red-700 transition-colors"
          >
            {translateText(categoryTelugu, language)}
          </Link>
        </div>

        {/* Card Content */}
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <div className="flex items-center gap-4 text-neutral-400 dark:text-neutral-500 text-[11px] mb-2 font-medium">
              <span className="flex items-center gap-1">
                <FiClock /> {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <FiEye /> {views.toLocaleString()} {translateText('వీక్షణలు', language)}
              </span>
            </div>
            
            <Link to={`/news/${id}`}>
              <h3 className="text-base font-bold text-neutral-950 dark:text-neutral-50 leading-snug hover:text-red-600 dark:hover:text-red-500 transition-colors duration-200 line-clamp-2 mb-2">
                {translateText(title, language)}
              </h3>
            </Link>
            
            <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed line-clamp-2 md:line-clamp-3">
              {translateText(description, language)}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end">
            <Link 
              to={`/news/${id}`}
              className="inline-flex items-center gap-1 text-red-600 dark:text-red-505 text-xs font-bold hover:gap-2 transition-all cursor-pointer"
            >
              <span>{translateText('మరింత చదవండి', language)}</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid Layout (Default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="flex flex-col bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
    >
      {/* Card Image */}
      <div className="aspect-[16/10] w-full overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        <Link
          to={`/category/${category}`}
          className="absolute top-3 left-3 bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm hover:bg-red-700 transition-colors z-10"
        >
          {translateText(categoryTelugu, language)}
        </Link>
      </div>

      {/* Card Content */}
      <div className="flex flex-col justify-between flex-grow p-4">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-4 text-neutral-400 dark:text-neutral-500 text-[11px] mb-2 font-medium">
            <span className="flex items-center gap-1">
              <FiClock /> {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <FiEye /> {views.toLocaleString()} {translateText('వీక్షణలు', language)}
            </span>
          </div>

          {/* Title */}
          <Link to={`/news/${id}`}>
            <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-neutral-50 leading-snug hover:text-red-600 dark:hover:text-red-500 transition-colors duration-200 line-clamp-2 mb-2">
              {translateText(title, language)}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm leading-relaxed line-clamp-3">
            {translateText(description, language)}
          </p>
        </div>

        {/* Read More Link */}
        <div className="mt-4 pt-3 border-t border-neutral-150 dark:border-neutral-800 flex items-center justify-between">
          <Link
            to={`/news/${id}`}
            className="inline-flex items-center gap-1 text-red-600 dark:text-red-500 text-xs md:text-sm font-bold hover:gap-2 transition-all group-hover:text-red-700 cursor-pointer"
          >
            <span>{translateText('మరింత చదవండి', language)}</span>
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
