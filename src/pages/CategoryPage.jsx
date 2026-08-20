import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import NewsCard from '../components/NewsCard';
import TrendingSidebar from '../components/TrendingSidebar';
import AdBanner from '../components/AdBanner';
import { FiHome, FiChevronRight, FiGrid, FiList } from 'react-icons/fi';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { articles: newsArticles } = useAdminData();
  const [layoutMode, setLayoutMode] = useState('grid'); // grid or list
  const [filteredArticles, setFilteredArticles] = useState([]);

  // Category translation mapping
  const categoryTitles = {
    'film-news': { te: 'ఫిల్మ్ న్యూస్', en: 'Film News' },
    'news': { te: 'వార్తలు', en: 'News' },
    'reviews': { te: 'రివ్యూలు', en: 'Reviews' },
    'gallery': { te: 'గ్యాలరీ', en: 'Gallery' },
    'box-office-news': { te: 'బాక్స్ ఆఫీస్ వార్తలు', en: 'Box Office News' },
    'live-tracking': { te: 'లైవ్ ట్రాకింగ్', en: 'Live Tracking' },
    'polls': { te: 'పోల్స్', en: 'Polls' }
  };

  const currentCategory = categoryTitles[categoryName] || { te: 'వార్తలు', en: 'News' };

  useEffect(() => {
    // Filter and sort by date descending
    const filtered = newsArticles
      .filter((a) => a.category === categoryName)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredArticles(filtered);

    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryName]);

  return (
    <div className="space-y-6">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-450 font-medium py-1">
        <Link to="/" className="hover:text-red-600 flex items-center gap-1">
          <FiHome />
          <span>హోమ్</span>
        </Link>
        <FiChevronRight className="text-neutral-400" />
        <span className="text-neutral-900 dark:text-neutral-200 font-bold">
          {currentCategory.te}
        </span>
      </nav>

      {/* Category Header with Layout Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 dark:border-neutral-850 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-7 bg-red-650 rounded-full"></span>
            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
              {currentCategory.te} <span className="text-sm font-bold text-neutral-400 font-mono">({currentCategory.en})</span>
            </h1>
          </div>
          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            తాజా {currentCategory.te} వార్తలు మరియు విశ్లేషణలు
          </p>
        </div>

        {/* View Switcher buttons */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg shrink-0 w-fit self-end sm:self-auto select-none">
          <button
            onClick={() => setLayoutMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              layoutMode === 'grid' 
                ? 'bg-white dark:bg-neutral-800 text-red-600' 
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
            aria-label="Grid View"
          >
            <FiGrid className="text-base" />
          </button>
          <button
            onClick={() => setLayoutMode('list')}
            className={`p-2 rounded-md transition-colors ${
              layoutMode === 'list' 
                ? 'bg-white dark:bg-neutral-800 text-red-600' 
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
            aria-label="List View"
          >
            <FiList className="text-base" />
          </button>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* News Items list */}
        <div className="lg:col-span-2 space-y-6">
          {filteredArticles.length > 0 ? (
            <div className={layoutMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
              {filteredArticles.map((article) => (
                <NewsCard key={article.id} article={article} layout={layoutMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-850 rounded-2xl p-6">
              <p className="text-neutral-500 dark:text-neutral-450 font-bold">
                ఈ విభాగంలో ప్రచురితమైన వార్తలు ప్రస్తుతానికి అందుబాటులో లేవు.
              </p>
              <Link 
                to="/" 
                className="mt-4 inline-block px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl"
              >
                తిరిగి హోమ్ పేజీకి వెళ్ళండి
              </Link>
            </div>
          )}

          {/* Pagination Placeholder */}
          {filteredArticles.length > 0 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-neutral-100 dark:border-neutral-900 select-none">
              <button disabled className="px-3.5 py-1.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 rounded-lg text-xs font-bold cursor-not-allowed">
                వెనుకకు
              </button>
              <button className="px-3.5 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold shadow-md">
                1
              </button>
              <button className="px-3.5 py-1.5 bg-white dark:bg-neutral-900 hover:bg-neutral-50 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-bold">
                2
              </button>
              <button className="px-3.5 py-1.5 bg-white dark:bg-neutral-900 hover:bg-neutral-50 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-bold">
                3
              </button>
              <button className="px-3.5 py-1.5 bg-white dark:bg-neutral-900 hover:bg-neutral-50 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-bold">
                ముందుకు
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <TrendingSidebar articles={newsArticles} />
          <AdBanner slotId="category-sidebar-ad" size="sidebar" />
        </div>

      </div>

      {/* Bottom Ad */}
      <AdBanner slotId="category-bottom-ad" size="leaderboard" />

    </div>
  );
};

export default CategoryPage;
