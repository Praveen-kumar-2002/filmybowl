import React from 'react';
import { Link } from 'react-router-dom';
import NewsCard from './NewsCard';
import { FiChevronRight, FiGrid } from 'react-icons/fi';
import { useAdminData } from '../context/AdminDataContext';
import { translateText } from '../utils/translator';

const CategoryBlock = ({ categoryKey, categoryTelugu, articles = [] }) => {
  const { language } = useAdminData();

  // Filter articles matching this category
  const categoryArticles = articles
    .filter((a) => a.category === categoryKey)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (categoryArticles.length === 0) return null;

  // Split into 1 featured and others
  const featuredArticle = categoryArticles[0];
  const listArticles = categoryArticles.slice(1, 4); // Take next 3 for sidebar list

  return (
    <section className="my-10 w-full">
      {/* Category Header */}
      <div className="flex items-center justify-between border-b-2 border-neutral-100 dark:border-neutral-800 pb-3 mb-6 relative">
        <div className="flex items-center gap-2">
          {/* Accent decoration */}
          <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
          <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            {translateText(categoryTelugu, language)}
          </h2>
        </div>
        
        <Link
          to={`/category/${categoryKey}`}
          className="inline-flex items-center gap-1 text-xs md:text-sm font-bold text-red-600 dark:text-red-500 hover:text-red-700 transition-colors"
        >
          <span>{translateText('అన్నీ చూడండి', language)}</span>
          <FiChevronRight className="text-base" />
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 1 Featured Article (Large Preview) */}
        <div className="lg:col-span-2">
          <NewsCard article={featuredArticle} layout="grid" />
        </div>

        {/* Right Column: 3 list articles (smaller) */}
        <div className="flex flex-col gap-4">
          {listArticles.map((article) => (
            <div 
              key={article.id} 
              className="flex items-center gap-4 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 p-3 rounded-xl hover:shadow-md transition-shadow group"
            >
              {/* Small Thumbnail */}
              <div className="w-24 h-20 shrink-0 rounded-lg overflow-hidden relative">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Title and date */}
              <div className="flex-grow space-y-1">
                <Link 
                  to={`/news/${article.id}`}
                  className="text-xs md:text-sm font-bold leading-snug line-clamp-2 text-neutral-900 dark:text-neutral-200 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors"
                >
                  {article.title}
                </Link>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">
                  {new Date(article.date).toLocaleDateString('te-IN', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
              </div>
            </div>
          ))}

          {/* Quick links to category list */}
          {categoryArticles.length > 4 && (
            <Link
              to={`/category/${categoryKey}`}
              className="flex items-center justify-center gap-1.5 py-3 border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-red-500 hover:bg-red-500/5 text-neutral-600 dark:text-neutral-450 hover:text-red-600 rounded-xl transition-all font-bold text-xs"
            >
              <FiGrid />
              <span>మరిన్ని {categoryTelugu} వార్తలు చదవండి</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryBlock;
