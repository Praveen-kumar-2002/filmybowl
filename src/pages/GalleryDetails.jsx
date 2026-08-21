import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { galleryArticles } from '../data/newsData';
import { useAdminData } from '../context/AdminDataContext';
import { translateText } from '../utils/translator';
import TrendingSidebar from '../components/TrendingSidebar';
import { FiHome, FiChevronRight, FiChevronLeft, FiClock, FiEye, FiUser, FiArrowLeft } from 'react-icons/fi';

const GalleryDetails = () => {
  const { galleryId, photoIndex } = useParams();
  const { articles: newsArticles, language } = useAdminData();
  const navigate = useNavigate();

  // Find current gallery article
  const article = galleryArticles.find((art) => art.id === galleryId) || galleryArticles[0];

  useEffect(() => {
    // Scroll to top on photo changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [galleryId, photoIndex]);

  if (!article || !article.gallery || article.gallery.length === 0) {
    return (
      <div className="py-16 text-center text-neutral-500 font-bold">
        Gallery not found.
      </div>
    );
  }

  // Parse the current 1-based photo index
  const currentIndex = parseInt(photoIndex ? photoIndex.replace('photo-', '') : '1', 10) || 1;
  const totalPhotos = article.gallery.length;

  // Clamp index within bounds
  const activeIndex = Math.max(0, Math.min(currentIndex - 1, totalPhotos - 1));
  const currentPhotoUrl = article.gallery[activeIndex];

  // Helper paths for navigation
  const prevIndex = activeIndex === 0 ? totalPhotos : activeIndex; // 1-based prev
  const nextIndex = activeIndex === totalPhotos - 1 ? 1 : activeIndex + 2; // 1-based next

  const prevPath = `/gallery/${galleryId}/photo-${prevIndex}`;
  const nextPath = `/gallery/${galleryId}/photo-${nextIndex}`;

  const formattedDate = new Date(article.date).toLocaleDateString(language === 'te' ? 'te-IN' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Filter 3 related photo stories
  const relatedGalleries = galleryArticles
    .filter((art) => art.id !== galleryId)
    .slice(0, 3);

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-450 font-semibold py-1">
        <Link to="/" className="hover:text-red-600 flex items-center gap-1">
          <FiHome className="text-sm" />
          <span>{language === 'te' ? 'హోమ్' : 'Home'}</span>
        </Link>
        <FiChevronRight className="text-neutral-400" />
        <Link to="/gallery" className="hover:text-red-600">
          <span>{language === 'te' ? 'చిత్ర మాలిక (Gallery)' : 'Gallery'}</span>
        </Link>
        <FiChevronRight className="text-neutral-400" />
        <span className="text-red-655 font-bold line-clamp-1 max-w-[200px] md:max-w-xs">
          {translateText(article.title, language)}
        </span>
      </nav>

      {/* Main Grid structure: Details page (3 cols) + Trending Sidebar (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column (Gallery Detail Content) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Header Action Row (Back button) */}
          <Link
            to="/gallery"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-655 hover:text-red-700 transition-colors"
          >
            <FiArrowLeft className="text-sm" />
            <span>{language === 'te' ? 'చిత్ర మాలికకు తిరిగి వెళ్ళండి' : 'Back to Gallery'}</span>
          </Link>

          {/* Photo Gallery Main Title */}
          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-neutral-900 dark:text-white leading-tight">
              {translateText(article.title, language)} - {language === 'te' ? `ఫోటో ${activeIndex + 1}` : `Photo ${activeIndex + 1}`}
            </h1>
            
            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-850 pb-4">
              <span className="bg-red-600 text-white font-extrabold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
                {translateText(article.categoryTelugu, language)}
              </span>
              <span className="flex items-center gap-1">
                <FiClock /> {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <FiEye /> {article.views.toLocaleString()} {translateText('వీక్షణలు', language)}
              </span>
              <span className="flex items-center gap-1">
                <FiUser /> {translateText('రచన:', language)} {article.author || 'Cineveduka Team'}
              </span>
            </div>
          </div>

          {/* Top Prev | Next Navigation Row */}
          <div className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-900">
            <Link
              to={prevPath}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-red-655 hover:text-red-700 hover:bg-red-50 dark:hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer select-none"
            >
              <FiChevronLeft className="text-base" />
              <span>{language === 'te' ? 'మునుపటి' : 'Previous'}</span>
            </Link>

            <span className="text-xs font-extrabold text-neutral-500">
              {activeIndex + 1} / {totalPhotos}
            </span>

            <Link
              to={nextPath}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-red-655 hover:text-red-700 hover:bg-red-50 dark:hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer select-none"
            >
              <span>{language === 'te' ? 'తదుపరి' : 'Next'}</span>
              <FiChevronRight className="text-base" />
            </Link>
          </div>

          {/* Large Photo Frame Container */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-150 dark:border-neutral-900 shadow-lg flex items-center justify-center">
            
            {/* Nav click zones directly overlaying left/right edges of the photo for desktop */}
            <div className="absolute inset-y-0 left-0 w-1/5 z-20 cursor-w-resize" onClick={() => navigate(prevPath)}></div>
            <div className="absolute inset-y-0 right-0 w-1/5 z-20 cursor-e-resize" onClick={() => navigate(nextPath)}></div>

            <img
              src={currentPhotoUrl}
              alt={`${article.title} - ${activeIndex + 1}`}
              className="max-w-full max-h-full object-contain z-10"
            />
          </div>

          {/* Photo Counter centered indicator */}
          <div className="flex items-center justify-center">
            <span className="px-4 py-1.5 bg-neutral-900 text-white rounded-full text-xs font-black tracking-widest shadow-sm">
              {activeIndex + 1} / {totalPhotos}
            </span>
          </div>

          {/* Bottom Prev | Next Navigation Row */}
          <div className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-900">
            <Link
              to={prevPath}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-red-655 hover:text-red-700 hover:bg-red-50 dark:hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer select-none"
            >
              <FiChevronLeft className="text-base" />
              <span>{language === 'te' ? 'మునుపటి' : 'Previous'}</span>
            </Link>

            <span className="text-xs font-extrabold text-neutral-500">
              {activeIndex + 1} / {totalPhotos}
            </span>

            <Link
              to={nextPath}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-red-655 hover:text-red-700 hover:bg-red-50 dark:hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer select-none"
            >
              <span>{language === 'te' ? 'తదుపరి' : 'Next'}</span>
              <FiChevronRight className="text-base" />
            </Link>
          </div>

          {/* Photo Description / Article Content Section */}
          <div className="space-y-4 bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-850 shadow-sm">
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider border-l-3 border-red-600 pl-2">
              {language === 'te' ? 'వివరణ & వివరాలు' : 'Description & Details'}
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed whitespace-pre-line font-medium">
              {translateText(article.description, language)}
            </p>
            <p className="text-neutral-500 dark:text-neutral-450 text-xs leading-relaxed pt-2 border-t border-neutral-50 dark:border-neutral-850">
              {language === 'te' 
                ? 'గమనిక: ఈ గ్యాలరీ సమాచారం కేవలం వినోద ప్రయోజనాల కోసం మాత్రమే. అన్ని చిత్రాల హక్కులు వాటి సంబంధిత యజమానులకు చెందినవి.'
                : 'Note: This gallery information is for entertainment purposes only. All images belong to their respective copyright holders.'
              }
            </p>
          </div>

          {/* Related Gallery Stories Section at the bottom */}
          <div className="space-y-6 pt-6 border-t border-neutral-150 dark:border-neutral-850">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
              <h3 className="text-lg md:text-xl font-black text-neutral-900 dark:text-white">
                {language === 'te' ? 'ఇతర చిత్ర మాలికలు' : 'Related Photo Stories'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {relatedGalleries.map((item) => (
                <Link
                  key={item.id}
                  to={`/gallery/${item.id}/photo-1`}
                  className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-neutral-200/50 dark:border-neutral-850 bg-white dark:bg-neutral-900 group flex flex-col justify-end cursor-pointer transition-all duration-300 hover:scale-[1.01]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10"></div>
                  
                  <div className="absolute bottom-0 inset-x-0 bg-red-600 hover:bg-red-750 text-white text-center py-2.5 px-3 flex items-center justify-center transition-colors duration-300 z-20">
                    <p className="text-white text-[11px] md:text-xs font-bold leading-tight line-clamp-2">
                      {translateText(item.title, language)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (Trending Sidebar) */}
        <div className="lg:col-span-1">
          <TrendingSidebar articles={newsArticles} />
        </div>

      </div>

    </div>
  );
};

export default GalleryDetails;
