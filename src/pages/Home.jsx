import React, { useState } from 'react';
import HeroSlider from '../components/HeroSlider';
import TrendingSidebar from '../components/TrendingSidebar';
import CategoryBlock from '../components/CategoryBlock';
import AdBanner from '../components/AdBanner';
import StatusBar from '../components/StatusBar';
import PopUpAd from '../components/PopUpAd';
import CornerAd from '../components/CornerAd';
import HomepageBillboardAd from '../components/HomepageBillboardAd';
import { useAdminData } from '../context/AdminDataContext';
import { translateText } from '../utils/translator';
import { FiMail, FiVideo, FiImage, FiChevronRight, FiPlay, FiCalendar, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { galleryArticles, videoArticles } from '../data/newsData';

const Home = () => {
  const { articles: newsArticles, language } = useAdminData();
  const [activeVideo, setActiveVideo] = useState(null);

  // Setup Home Gallery Items
  const homeGalleryItems = galleryArticles.slice(0, 3).map((art) => ({
    id: `${art.id}-0`,
    src: art.gallery[0] || art.image,
    title: art.title,
    category: art.categoryTelugu,
    parentArticleId: art.id
  }));

  // Helper for date formatting
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(language === 'te' ? 'te-IN' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Billboard Advertisement with 30s auto-skip */}
      <HomepageBillboardAd />

      {/* Celebrity Stories/Status Bar */}
      <StatusBar />

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Hero Slider, Custom Sections, Ads */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Swiper Hero Slider */}
          <HeroSlider articles={newsArticles} />

          {/* Inline Advertisement */}
          <AdBanner slotId="mid-home-film-news-ads" size="inline" />

          {/* 1. FILM NEWS SECTION */}
          <section className="w-full">
            <div className="flex items-center justify-between border-b-2 border-neutral-100 dark:border-neutral-850 pb-3 mb-6 relative">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  {language === 'te' ? 'ఫిల్మ్ న్యూస్ (Film News)' : 'Film News'}
                </h2>
              </div>
              <Link
                to="/category/film-news"
                className="inline-flex items-center gap-1 text-xs md:text-sm font-bold text-red-655 hover:text-red-700 transition-colors"
              >
                <span>{translateText('అన్నీ చూడండి', language)}</span>
                <FiChevronRight className="text-base" />
              </Link>
            </div>

            {/* Split layout: Large featured + right side lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side: Featured Card */}
              {newsArticles.filter(art => art.category === 'film-news').slice(0, 1).map(art => (
                <div key={art.id} className="flex flex-col bg-white dark:bg-neutral-900 border border-neutral-150/60 dark:border-neutral-850 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group relative">
                  <Link to={`/news/${art.id}`} className="absolute inset-0 z-10" />
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={art.image} alt={art.title} className="w-full h-full object-cover transform duration-500 group-hover:scale-103" />
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider z-20">
                      {translateText('ఫిల్మ్ న్యూస్', language)}
                    </span>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white leading-snug group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                        {translateText(art.title, language)}
                      </h3>
                      <p className="text-xs text-neutral-550 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                        {translateText(art.description, language)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-neutral-450 mt-4 border-t border-neutral-100 dark:border-neutral-850 pt-3">
                      <span>{art.author || 'Cineveduka Team'}</span>
                      <span>&bull;</span>
                      <span>{formatDate(art.date)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Right Side: Vertical List */}
              <div className="space-y-4">
                {newsArticles.filter(art => art.category === 'film-news').slice(1, 4).map(art => (
                  <div key={art.id} className="flex gap-4 p-3 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-2xl shadow-sm hover:shadow transition-all group relative">
                    <Link to={`/news/${art.id}`} className="absolute inset-0 z-10" />
                    <div className="w-24 h-20 md:w-28 md:h-24 rounded-xl overflow-hidden shrink-0 relative">
                      <img src={art.image} alt={art.title} className="w-full h-full object-cover transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <h3 className="text-xs md:text-sm font-extrabold text-neutral-900 dark:text-white line-clamp-2 leading-snug group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                        {translateText(art.title, language)}
                      </h3>
                      <p className="text-[10px] text-neutral-450 flex items-center gap-1.5 mt-1">
                        <FiCalendar /> {formatDate(art.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 2. NEWS SECTION */}
          <section className="w-full">
            <div className="flex items-center justify-between border-b-2 border-neutral-100 dark:border-neutral-850 pb-3 mb-6 relative">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  {language === 'te' ? 'తాజా వార్తలు (General News)' : 'News'}
                </h2>
              </div>
              <Link
                to="/category/news"
                className="inline-flex items-center gap-1 text-xs md:text-sm font-bold text-red-655 hover:text-red-700 transition-colors"
              >
                <span>{translateText('అన్నీ చూడండి', language)}</span>
                <FiChevronRight className="text-base" />
              </Link>
            </div>

            {/* Split layout: Large featured + right side lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side: Featured Card */}
              {newsArticles.filter(art => art.category === 'news').slice(0, 1).map(art => (
                <div key={art.id} className="flex flex-col bg-white dark:bg-neutral-900 border border-neutral-150/60 dark:border-neutral-850 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group relative">
                  <Link to={`/news/${art.id}`} className="absolute inset-0 z-10" />
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={art.image} alt={art.title} className="w-full h-full object-cover transform duration-500 group-hover:scale-103" />
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider z-20">
                      {translateText('వార్తలు', language)}
                    </span>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white leading-snug group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                        {translateText(art.title, language)}
                      </h3>
                      <p className="text-xs text-neutral-550 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                        {translateText(art.description, language)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-neutral-450 mt-4 border-t border-neutral-100 dark:border-neutral-850 pt-3">
                      <span>{art.author || 'Cineveduka Team'}</span>
                      <span>&bull;</span>
                      <span>{formatDate(art.date)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Right Side: Vertical List */}
              <div className="space-y-4">
                {newsArticles.filter(art => art.category === 'news').slice(1, 4).map(art => (
                  <div key={art.id} className="flex gap-4 p-3 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-2xl shadow-sm hover:shadow transition-all group relative">
                    <Link to={`/news/${art.id}`} className="absolute inset-0 z-10" />
                    <div className="w-24 h-20 md:w-28 md:h-24 rounded-xl overflow-hidden shrink-0 relative">
                      <img src={art.image} alt={art.title} className="w-full h-full object-cover transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <h3 className="text-xs md:text-sm font-extrabold text-neutral-900 dark:text-white line-clamp-2 leading-snug group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                        {translateText(art.title, language)}
                      </h3>
                      <p className="text-[10px] text-neutral-450 flex items-center gap-1.5 mt-1">
                        <FiCalendar /> {formatDate(art.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. PHOTO GALLERY SECTION */}
          <section className="w-full">
            <div className="flex items-center justify-between border-b-2 border-neutral-100 dark:border-neutral-850 pb-3 mb-6 relative">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  {language === 'te' ? 'చిత్ర మాలిక (Gallery)' : 'Gallery'}
                </h2>
              </div>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-1 text-xs md:text-sm font-bold text-red-655 hover:text-red-700 transition-colors"
              >
                <span>{translateText('అన్నీ చూడండి', language)}</span>
                <FiChevronRight className="text-base" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {homeGalleryItems.map(item => (
                <div key={item.id} className="relative aspect-[3/4.2] rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-neutral-200/50 dark:border-neutral-850 bg-white dark:bg-neutral-900 group flex flex-col justify-end transition-transform duration-300 hover:scale-[1.01] cursor-pointer">
                  <Link to={`/gallery/${item.parentArticleId}/photo-1`} className="absolute inset-0 z-10" />
                  <img src={item.src} alt={item.title} className="absolute inset-0 w-full h-full object-cover transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10"></div>
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10 z-20 shadow">
                    <FiImage />
                    <span>5 {language === 'te' ? 'ఫోటోలు' : 'Photos'}</span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-red-600 hover:bg-red-750 text-white text-center py-2.5 px-3 flex items-center justify-center transition-colors duration-300 select-none z-20">
                    <p className="text-white text-[11px] md:text-xs font-bold leading-tight font-sans line-clamp-2">
                      {translateText(item.title, language)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Inline Advertisement */}
          <AdBanner slotId="mid-home-reviews-ads" size="inline" />

          {/* 4. VIDEO STORIES SECTION */}
          <section className="w-full">
            <div className="flex items-center justify-between border-b-2 border-neutral-100 dark:border-neutral-850 pb-3 mb-6 relative">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  {language === 'te' ? 'వీడియో కథనాలు (Video Stories)' : 'Video Stories'}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {videoArticles.slice(0, 3).map(art => (
                <div key={art.id} className="flex flex-col bg-white dark:bg-neutral-900 border border-neutral-150/60 dark:border-neutral-850 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group relative">
                  <button 
                    onClick={() => setActiveVideo(art.videoUrl)}
                    className="absolute inset-0 z-10 cursor-pointer w-full h-full text-left bg-transparent border-none"
                    aria-label={`Play ${art.title}`}
                  />
                  <div className="aspect-video overflow-hidden relative bg-neutral-950">
                    <img src={art.image} alt={art.title} className="w-full h-full object-cover transform duration-500 group-hover:scale-105 opacity-90" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors z-20">
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform duration-300 transform group-hover:scale-110">
                        <FiPlay className="text-xl translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <h3 className="text-xs md:text-sm font-extrabold text-neutral-900 dark:text-white line-clamp-2 leading-snug group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                      {translateText(art.title, language)}
                    </h3>
                    <p className="text-[10px] text-neutral-450 mt-2 flex items-center gap-1">
                      <FiEye /> {art.views.toLocaleString()} {language === 'te' ? 'వీక్షణలు' : 'views'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. REVIEWS SECTION */}
          <section className="w-full">
            <div className="flex items-center justify-between border-b-2 border-neutral-100 dark:border-neutral-850 pb-3 mb-6 relative">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  {language === 'te' ? 'సినిమా రివ్యూలు (Reviews)' : 'Reviews'}
                </h2>
              </div>
              <Link
                to="/category/reviews"
                className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm"
              >
                <span>{language === 'te' ? 'మరిన్ని' : 'See More'}</span>
              </Link>
            </div>

            {/* Grid of 4 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {newsArticles
                .filter(art => art.category === 'reviews')
                .slice(0, 4)
                .map(art => {
                  const isVishwanath = art.title.includes("Vishwanath") || art.title.includes("విశ్వనాథ్");
                  return (
                    <div key={art.id} className="flex flex-col group relative cursor-pointer">
                      <Link to={`/news/${art.id}`} className="absolute inset-0 z-10" />
                      
                      {/* Image container aspect-video */}
                      <div className="aspect-[1.6/1] w-full rounded-2xl overflow-hidden relative shadow-sm border border-neutral-100 dark:border-neutral-850 bg-neutral-100 dark:bg-neutral-950">
                        <img 
                          src={art.image} 
                          alt={art.title} 
                          className="w-full h-full object-cover transform duration-500 group-hover:scale-103" 
                        />
                        
                        {/* Rating Overlay on Image */}
                        {isVishwanath && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 z-10 pointer-events-none">
                            <div className="bg-white/95 dark:bg-black/95 px-2.5 py-1 rounded-xl border border-neutral-200/50 dark:border-neutral-800 shadow-md text-center">
                              <p className="text-[7.5px] font-black text-neutral-400 uppercase tracking-widest leading-none">Rating</p>
                              <p className="text-xs font-black text-orange-500 mt-0.5">3.25 / 5</p>
                            </div>
                          </div>
                        )}

                        {/* Brown overlay tag bottom left */}
                        <span className="absolute bottom-3 left-3 bg-[#9A5B20] text-white text-[8px] md:text-[8.5px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider z-20">
                          {language === 'te' ? 'రివ్యూ' : 'REVIEW'}
                        </span>
                      </div>
                      
                      {/* Title only, bold dark text */}
                      <h3 className="text-xs md:text-sm font-black text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-snug mt-2.5 group-hover:text-orange-500 transition-colors">
                        {translateText(art.title, language)}
                      </h3>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* 6. BOX OFFICE SECTION */}
          <section className="w-full">
            <div className="flex items-center justify-between border-b-2 border-neutral-100 dark:border-neutral-850 pb-3 mb-6 relative">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  {language === 'te' ? 'బాక్స్ ఆఫీస్ (Box Office)' : 'Box Office'}
                </h2>
              </div>
              <Link
                to="/category/box-office-news"
                className="inline-flex items-center gap-1 text-xs md:text-sm font-bold text-red-655 hover:text-red-700 transition-colors"
              >
                <span>{translateText('అన్నీ చూడండి', language)}</span>
                <FiChevronRight className="text-base" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {newsArticles
                .filter(art => art.category === 'box-office-news')
                .slice(0, 3)
                .map(art => (
                  <div key={art.id} className="flex flex-col bg-white dark:bg-neutral-900 border border-neutral-150/60 dark:border-neutral-850 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group relative">
                    <Link to={`/news/${art.id}`} className="absolute inset-0 z-10" />
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img src={art.image} alt={art.title} className="w-full h-full object-cover transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white line-clamp-2 leading-snug group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                        {translateText(art.title, language)}
                      </h3>
                      <p className="text-[10px] text-neutral-450 mt-2">
                        {formatDate(art.date)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* 7. ADDITIONAL CATEGORIES SECTION (Sports, Business, Tech) */}
          <section className="w-full border-t border-neutral-100 dark:border-neutral-850 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Sports Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-neutral-100 dark:border-neutral-850 pb-2">
                  <span className="w-1 h-4 bg-red-600 rounded-full"></span>
                  <h3 className="text-sm font-black uppercase text-neutral-900 dark:text-white">
                    {language === 'te' ? 'క్రీడలు (Sports)' : 'Sports'}
                  </h3>
                </div>
                <div className="space-y-3">
                  {newsArticles.filter(art => art.id.startsWith('spo-')).slice(0, 3).map(art => (
                    <div key={art.id} className="relative group flex flex-col py-1">
                      <Link to={`/news/${art.id}`} className="absolute inset-0 z-10" />
                      <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 line-clamp-2 leading-snug group-hover:text-red-650 dark:group-hover:text-red-500 transition-colors">
                        {translateText(art.title, language)}
                      </h4>
                      <span className="text-[9px] text-neutral-450 mt-1">{formatDate(art.date)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-neutral-100 dark:border-neutral-850 pb-2">
                  <span className="w-1 h-4 bg-red-600 rounded-full"></span>
                  <h3 className="text-sm font-black uppercase text-neutral-900 dark:text-white">
                    {language === 'te' ? 'వ్యాపారం (Business)' : 'Business'}
                  </h3>
                </div>
                <div className="space-y-3">
                  {newsArticles.filter(art => art.id.startsWith('bus-')).slice(0, 3).map(art => (
                    <div key={art.id} className="relative group flex flex-col py-1">
                      <Link to={`/news/${art.id}`} className="absolute inset-0 z-10" />
                      <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 line-clamp-2 leading-snug group-hover:text-red-655 dark:group-hover:text-red-500 transition-colors">
                        {translateText(art.title, language)}
                      </h4>
                      <span className="text-[9px] text-neutral-450 mt-1">{formatDate(art.date)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technology Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-neutral-100 dark:border-neutral-850 pb-2">
                  <span className="w-1 h-4 bg-red-600 rounded-full"></span>
                  <h3 className="text-sm font-black uppercase text-neutral-900 dark:text-white">
                    {language === 'te' ? 'సాంకేతికత (Technology)' : 'Technology'}
                  </h3>
                </div>
                <div className="space-y-3">
                  {newsArticles.filter(art => art.id.startsWith('tech-')).slice(0, 3).map(art => (
                    <div key={art.id} className="relative group flex flex-col py-1">
                      <Link to={`/news/${art.id}`} className="absolute inset-0 z-10" />
                      <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 line-clamp-2 leading-snug group-hover:text-red-655 dark:group-hover:text-red-500 transition-colors">
                        {translateText(art.title, language)}
                      </h4>
                      <span className="text-[9px] text-neutral-450 mt-1">{formatDate(art.date)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* Right Side: Sidebar, Newsletter, Ads */}
        <div className="space-y-6 lg:sticky lg:top-32 self-start">
          
          {/* Trending Stories Sidebar */}
          <TrendingSidebar articles={newsArticles} />

          {/* Sidebar Advertisement */}
          <AdBanner slotId="sidebar-rect-banner-ads" size="rectangle" />

          {/* Quick Media Widgets */}
          <div className="bg-gradient-to-br from-red-650 to-red-800 dark:from-red-950 dark:to-neutral-900 text-white rounded-2xl p-6 shadow-md border border-red-500/20 space-y-4">
            <h3 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
              <FiVideo className="text-lg animate-pulse" />
              <span>వీడియో వార్తలు</span>
            </h3>
            <p className="text-xs text-red-100 leading-relaxed">
              తాజా వార్తలు, విశ్లేషణలు మరియు ప్రత్యేక ఇంటర్వ్యూలను మా వీడియో విభాగంలో వీక్షించండి.
            </p>
            {videoArticles.length > 0 && (
              <button
                onClick={() => setActiveVideo(videoArticles[0].videoUrl)}
                className="w-full py-2.5 bg-white text-red-700 hover:bg-neutral-100 text-center font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer border-none"
              >
                <span>వీడియో వార్తలు చూడండి</span>
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FiImage className="text-red-600 text-lg" />
              <span>చిత్ర మాలిక (Gallery)</span>
            </h3>
            <p className="text-xs text-neutral-550 dark:text-neutral-400 leading-relaxed">
              కీలక సినీ వేడుకలు మరియు క్రీడా విశేషాల అద్భుతమైన చిత్రాలను మా గ్యాలరీలో చూడండి.
            </p>
            <Link
              to="/gallery"
              className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-950 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-250 text-center font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <span>{language === 'te' ? 'ఫోటో గ్యాలరీకి వెళ్ళండి' : 'Go to Photo Gallery'}</span>
            </Link>
          </div>

          {/* Newsletter subscription widget */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-neutral-950 dark:text-neutral-50 font-bold text-sm">
              <FiMail className="text-red-650 text-lg" />
              <span>{language === 'te' ? 'వార్తా లేఖకు సబ్‌స్క్రైబ్ అవ్వండి' : 'Subscribe to Newsletter'}</span>
            </div>
            <p className="text-xs text-neutral-550 dark:text-neutral-400 mb-4 leading-relaxed">
              {language === 'te' ? 'రోజూ తాజా వార్తలను మీ ఈమెయిల్ లో నేరుగా పొందడానికి మీ వివరాలను ఇక్కడ నమోదు చేయండి.' : 'Enter your email to receive daily latest updates directly in your inbox.'}
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder={language === 'te' ? 'మీ ఈమెయిల్ చిరునామా' : 'Your Email Address'}
                required
                className="w-full px-4 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-red-650 rounded-xl outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                {language === 'te' ? 'సబ్‌స్క్రైబ్' : 'Subscribe'}
              </button>
            </form>
          </div>

          {/* Small Footer banner */}
          <AdBanner slotId="sidebar-footer-ads" size="inline" className="!my-2" />

        </div>

      </div>

      {/* Delayed Popup Ad Overlay */}
      <PopUpAd />
      
      {/* Corner Ad Floating widget */}
      <CornerAd />

      {/* 8. VIDEO PLAYBACK MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
          <div className="bg-neutral-950 border border-neutral-850 rounded-3xl overflow-hidden max-w-4xl w-full relative shadow-2xl animate-scaleUp">
            <button 
              onClick={() => setActiveVideo(null)} 
              className="absolute top-4 right-4 text-white hover:text-red-500 text-2xl z-50 bg-black/60 hover:bg-neutral-900 transition-colors p-2 rounded-full cursor-pointer w-10 h-10 flex items-center justify-center shadow"
              aria-label="Close video player"
            >
              &times;
            </button>
            <div className="aspect-video w-full">
              <iframe 
                src={activeVideo} 
                title="Video Player" 
                className="w-full h-full" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
