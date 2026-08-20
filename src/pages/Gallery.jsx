import React, { useState, useEffect } from 'react';
import { galleryArticles } from '../data/newsData';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiChevronRight, FiX, FiChevronLeft, FiImage, FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { translateText } from '../utils/translator';
import TrendingSidebar from '../components/TrendingSidebar';

const Gallery = () => {
  const { articles: newsArticles, language } = useAdminData();
  const [activeTab, setActiveTab] = useState('Latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const ITEMS_PER_PAGE = 9;

  // Flatten all gallery pictures into a single array of items with parent title info
  const allGalleryItems = galleryArticles.reduce((acc, article) => {
    if (article.gallery && article.gallery.length > 0) {
      article.gallery.forEach((imgUrl, idx) => {
        acc.push({
          id: `${article.id}-${idx}`,
          src: imgUrl,
          title: article.title,
          category: article.categoryTelugu,
          parentArticleId: article.id
        });
      });
    }
    return acc;
  }, []);

  // Filter items based on activeTab categories (Latest, Actor, Actress, Events, Movies)
  const filteredItems = allGalleryItems.filter(item => {
    if (activeTab === 'Latest') return true;
    const titleLower = item.title.toLowerCase();
    
    if (activeTab === 'Actor') {
      return titleLower.includes('చరణ్') || titleLower.includes('మహేష్') || titleLower.includes('ప్రభాస్') || titleLower.includes('ధోనీ') || titleLower.includes('actor') || titleLower.includes('charan') || titleLower.includes('mahesh') || titleLower.includes('prabhas');
    }
    if (activeTab === 'Actress') {
      return titleLower.includes('కీర్తి') || titleLower.includes('రష్మిక') || titleLower.includes('నభా') || titleLower.includes('లావణ్య') || titleLower.includes('ప్రీతి') || titleLower.includes('actress') || titleLower.includes('nabha') || titleLower.includes('rashmika') || titleLower.includes('keerthy') || titleLower.includes('lavanya');
    }
    if (activeTab === 'Events') {
      return titleLower.includes('ప్రెస్ మీట్') || titleLower.includes('వేడుకలు') || titleLower.includes('లంచ్') || titleLower.includes('event') || titleLower.includes('launch') || titleLower.includes('meet');
    }
    if (activeTab === 'Movies') {
      return titleLower.includes('సినిమా') || titleLower.includes('షూటింగ్') || titleLower.includes('మూవీ') || titleLower.includes('movie') || titleLower.includes('film');
    }
    return true;
  });

  // Calculate pages
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;

  // Reset pagination on tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const openLightbox = (index) => {
    // Map paginated index back to filtered list index
    const actualIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
    setLightboxIndex(actualIndex);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextSlide = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevSlide = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const visibleItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-450 font-semibold py-1">
        <Link to="/" className="hover:text-red-600 flex items-center gap-1">
          <FiHome className="text-sm" />
          <span>{language === 'te' ? 'హోమ్' : 'Home'}</span>
        </Link>
        <FiChevronRight className="text-neutral-400" />
        <span className="text-red-655 font-bold">
          {language === 'te' ? 'చిత్ర మాలిక (Photo Gallery)' : 'Photo Gallery'}
        </span>
      </nav>

      {/* Main Core Grid Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Gallery Content Area (Left 75% width) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Solid Red Header Banner Title */}
          <div className="w-full bg-red-600 rounded-md py-3 px-4 flex items-center justify-center text-white font-extrabold text-sm md:text-base uppercase tracking-wider shadow-sm">
            <span>{language === 'te' ? 'ఫొటో గ్యాలరీ (Photo Gallery)' : 'Photo Gallery'}</span>
          </div>

          {/* Filter tabs categories bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-neutral-100 dark:border-neutral-850 pb-4">
            {['Latest', 'Actor', 'Actress', 'Events', 'Movies'].map((tab) => {
              const displayTab = tab === 'Latest' ? (language === 'te' ? 'తాజా' : 'Latest') : tab;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 text-[10px] md:text-xs font-bold uppercase rounded border transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-neutral-900 border-neutral-900 dark:bg-neutral-800 dark:border-neutral-800 text-white' 
                      : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:bg-neutral-950 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900'
                  }`}
                >
                  {displayTab}
                </button>
              );
            })}
          </div>

          {/* Portrait Aspect Ratio Grid (3 Columns) */}
          {visibleItems.length === 0 ? (
            <div className="w-full py-16 text-center text-neutral-500 font-bold text-sm">
              No photo galleries found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {visibleItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.3 }}
                  onClick={() => openLightbox(index)}
                  className="relative aspect-[3/4.2] rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-neutral-200/50 dark:border-neutral-850 bg-white dark:bg-neutral-900 group flex flex-col justify-end cursor-pointer"
                >
                  {/* Photo image */}
                  <img
                    src={item.src}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient to darken bottom overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10"></div>

                  {/* Caption Overlay (Red Box Banner at the bottom edge) */}
                  <div className="absolute bottom-0 inset-x-0 bg-red-600 hover:bg-red-750 text-white text-center py-2.5 px-3 flex items-center justify-center transition-colors duration-300 select-none z-20">
                    <p className="text-white text-[11px] md:text-xs font-bold leading-tight font-sans line-clamp-2">
                      {translateText(item.title, language)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Navigation / Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={`px-5 py-2 text-[10px] md:text-xs font-bold uppercase rounded transition-all select-none border ${
                  currentPage === 1 
                    ? 'bg-red-50/50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-900 text-red-200 dark:text-neutral-700 cursor-not-allowed' 
                    : 'bg-white hover:bg-neutral-50 border-neutral-300 text-red-650 cursor-pointer dark:bg-neutral-950 dark:border-neutral-800'
                }`}
              >
                {language === 'te' ? 'మునుపటి' : 'Prev'}
              </button>
              
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={`px-5 py-2 text-[10px] md:text-xs font-bold uppercase rounded transition-all select-none shadow-sm ${
                  currentPage === totalPages 
                    ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-750 text-white cursor-pointer'
                }`}
              >
                {language === 'te' ? 'తదుపరి' : 'Next'}
              </button>
            </div>
          )}

        </div>

        {/* Trending Sidebar (Right 25% width) */}
        <div className="lg:col-span-1">
          <TrendingSidebar articles={newsArticles} />
        </div>

      </div>

      {/* Fullscreen Lightbox Modal Overlay using React Portals */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[99999] flex items-center justify-center p-4 select-none backdrop-blur-sm"
          >
            {/* Click outside to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={closeLightbox}></div>

            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-red-500 p-2.5 text-2xl z-[999999] bg-black/40 rounded-full"
              aria-label="Close Lightbox"
            >
              <FiX />
            </button>

            {/* Left navigation arrow */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-red-500 p-3 text-3xl bg-black/50 hover:bg-black/80 rounded-full cursor-pointer z-[999999]"
              aria-label="Previous Slide"
            >
              <FiChevronLeft />
            </button>

            {/* Slide display */}
            <div className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center gap-4 text-white px-8 z-50">
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={filteredItems[lightboxIndex].src}
                alt={filteredItems[lightboxIndex].title}
                className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-2xl border border-white/5"
              />

              <div className="text-center space-y-1.5">
                <span className="text-[10px] bg-red-655 font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  {translateText(filteredItems[lightboxIndex].category, language)}
                </span>
                <p className="text-sm md:text-base font-bold line-clamp-2">
                  {translateText(filteredItems[lightboxIndex].title, language)}
                </p>
                <Link
                  to={`/news/${filteredItems[lightboxIndex].parentArticleId}`}
                  onClick={closeLightbox}
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-400 underline mt-1 cursor-pointer"
                >
                  <FiExternalLink />
                  <span>{language === 'te' ? 'పూర్తి వార్త కథనం చదవండి' : 'Read Full Story Article'}</span>
                </Link>
              </div>
            </div>

            {/* Right navigation arrow */}
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-red-500 p-3 text-3xl bg-black/50 hover:bg-black/80 rounded-full cursor-pointer z-[999999]"
              aria-label="Next Slide"
            >
              <FiChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Gallery;
