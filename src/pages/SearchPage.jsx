import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { newsArticles } from '../data/newsData';
import NewsCard from '../components/NewsCard';
import TrendingSidebar from '../components/TrendingSidebar';
import AdBanner from '../components/AdBanner';
import { FiHome, FiChevronRight, FiSearch, FiInfo } from 'react-icons/fi';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(queryParam);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    setSearchInput(queryParam);
    if (queryParam.trim()) {
      const results = newsArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(queryParam.toLowerCase()) ||
          article.description.toLowerCase().includes(queryParam.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [queryParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-450 font-medium py-1">
        <Link to="/" className="hover:text-red-600 flex items-center gap-1">
          <FiHome />
          <span>హోమ్</span>
        </Link>
        <FiChevronRight className="text-neutral-400" />
        <span className="text-neutral-900 dark:text-neutral-250 font-bold">శోధన (Search)</span>
      </nav>

      {/* Page Header */}
      <div className="border-b border-neutral-250 dark:border-neutral-850 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-7 bg-red-650 rounded-full"></span>
          <h1 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
            <FiSearch className="text-red-600 text-2xl md:text-3xl" />
            <span>వార్తల శోధన (Search Portal)</span>
          </h1>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 p-6 rounded-2xl shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-2xl">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="వార్త శీర్షిక లేదా కీవర్డ్ నమోదు చేయండి..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-4 pr-10 py-3 text-sm md:text-base bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-red-650 rounded-xl outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-450 hover:text-neutral-600 text-xs font-bold"
              >
                క్లియర్
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm md:text-base rounded-xl shadow-md transition-colors flex items-center gap-1.5 shrink-0"
          >
            <FiSearch />
            <span className="hidden sm:inline">వెతకండి</span>
          </button>
        </form>
      </div>

      {/* Search Results Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Results list */}
        <div className="lg:col-span-2 space-y-6">
          {queryParam.trim() ? (
            <div className="space-y-4">
              {/* Summary message */}
              <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-550 dark:text-neutral-400 font-medium bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3.5 rounded-xl">
                <FiInfo className="text-red-600 text-base" />
                <span>
                  &ldquo;<strong className="text-neutral-950 dark:text-neutral-50">{queryParam}</strong>&rdquo; శోధనకు{' '}
                  <strong className="text-red-650">{searchResults.length}</strong> వార్తలు లభించాయి.
                </span>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {searchResults.map((article) => (
                    <NewsCard key={article.id} article={article} layout="grid" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-850 rounded-2xl">
                  <p className="text-neutral-500 font-bold">ఎటువంటి వార్తలు లభించలేదు.</p>
                  <p className="text-neutral-400 text-xs mt-1">వేరే పదాలతో తిరిగి శోధించండి.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-850 rounded-2xl p-6">
              <p className="text-neutral-500 dark:text-neutral-450 font-bold">
                పైన ఉన్న శోధన పెట్టెలో ఏదైనా కీవర్డ్‌ను టైప్ చేసి శోధించండి.
              </p>
              <div className="mt-6 max-w-sm mx-auto">
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-2.5">
                  జనాదరణ పొందిన శోధనలు
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['ఏపీ అసెంబ్లీ', 'ఐపీఎల్', 'పాన్ ఇండియా', 'బడ్జెట్', 'క్రిప్టో'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSearchInput(tag);
                        setSearchParams({ q: tag });
                      }}
                      className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-red-500/10 hover:text-red-600 rounded-lg text-xs font-bold text-neutral-600 dark:text-neutral-300 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <TrendingSidebar articles={newsArticles} />
          <AdBanner slotId="search-sidebar-ad" size="rectangle" />
        </div>

      </div>

    </div>
  );
};

export default SearchPage;
