import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiEye, FiClock } from 'react-icons/fi';

const TrendingSidebar = ({ articles = [] }) => {
  const [activeTab, setActiveTab] = useState('popular'); // popular or recent

  // Get articles sorted by views
  const popularArticles = [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  // Get articles sorted by date
  const recentArticles = [...articles]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  const displayArticles = activeTab === 'popular' ? popularArticles : recentArticles;

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-2xl p-5 shadow-sm">
      {/* Header and Toggle */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-5">
        <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white text-base">
          <FiTrendingUp className="text-red-600 text-lg animate-bounce" />
          <span>ట్రెండింగ్ వార్తలు</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850 rounded-xl mb-5 text-xs font-bold">
        <button
          onClick={() => setActiveTab('popular')}
          className={`flex-1 py-2 text-center rounded-lg transition-all duration-300 ${
            activeTab === 'popular'
              ? 'bg-white dark:bg-neutral-800 text-red-600 dark:text-red-500 shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-855'
          }`}
        >
          అత్యధిక వీక్షణలు
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex-1 py-2 text-center rounded-lg transition-all duration-300 ${
            activeTab === 'recent'
              ? 'bg-white dark:bg-neutral-800 text-red-600 dark:text-red-500 shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-855'
          }`}
        >
          తాజా అప్‌డేట్స్
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {displayArticles.map((article, index) => {
          const formattedDate = new Date(article.date).toLocaleDateString('te-IN', {
            day: 'numeric',
            month: 'short'
          });

          return (
            <div 
              key={article.id} 
              className="flex items-start gap-3.5 pb-4 border-b border-neutral-50 dark:border-neutral-900/60 last:border-none last:pb-0 group"
            >
              {/* Number Badge */}
              <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center font-black text-xs border ${
                index === 0 
                  ? 'bg-red-600 border-red-600 text-white shadow-md'
                  : 'bg-neutral-50 border-neutral-200 dark:bg-neutral-950 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400'
              }`}>
                {index + 1}
              </span>

              {/* Title & Metadata */}
              <div className="space-y-1">
                <Link 
                  to={`/news/${article.id}`}
                  className="text-xs md:text-sm font-bold text-neutral-900 dark:text-neutral-200 leading-snug line-clamp-2 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-150"
                >
                  {article.title}
                </Link>
                <div className="flex items-center gap-3 text-[10px] text-neutral-400 dark:text-neutral-500">
                  <span className="bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 font-extrabold px-1.5 py-0.5 rounded text-[9px] uppercase">
                    {article.categoryTelugu}
                  </span>
                  <span className="flex items-center gap-0.5"><FiClock /> {formattedDate}</span>
                  <span className="flex items-center gap-0.5"><FiEye /> {article.views.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingSidebar;
