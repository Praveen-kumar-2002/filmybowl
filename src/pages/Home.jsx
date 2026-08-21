import React from 'react';
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
import { FiMail, FiVideo, FiImage, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { galleryArticles } from '../data/newsData';

const Home = () => {
  const { articles: newsArticles, language } = useAdminData();

  // Create home page gallery items (portrait cards)
  const homeGalleryItems = galleryArticles.slice(0, 3).map((art, idx) => ({
    id: `${art.id}-0`,
    src: art.gallery[0] || art.image,
    title: art.title,
    category: art.categoryTelugu,
    parentArticleId: art.id
  }));
  return (
    <div className="space-y-6">
      
      {/* Top Banner Billboard Advertisement with 30s auto-skip */}
      <HomepageBillboardAd />

      {/* Celebrity Stories/Status Bar */}
      <StatusBar />

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Slider, Category Blocks, In-between Ads */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Swiper Hero Slider */}
          <HeroSlider articles={newsArticles} />

          {/* Film News Category Block */}
          <CategoryBlock 
            categoryKey="film-news" 
            categoryTelugu="ఫిల్మ్ న్యూస్ (Film News)" 
            articles={newsArticles} 
          />

          {/* Inline Advertisement */}
          <AdBanner slotId="mid-home-film-news-ads" size="inline" />

          {/* News Category Block */}
          <CategoryBlock 
            categoryKey="news" 
            categoryTelugu="వార్తలు (News)" 
            articles={newsArticles} 
          />

          {/* Inline Advertisement */}
          <AdBanner slotId="mid-home-news-ads" size="inline" />

          {/* Box Office Section */}
          <section className="my-10 w-full">
            <div className="flex items-center justify-between border-b-2 border-neutral-100 dark:border-neutral-850 pb-3 mb-6 relative">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  {language === 'te' ? 'బాక్స్ ఆఫీస్ (Box Office)' : 'Box Office'}
                </h2>
              </div>
              <Link
                to="/category/box-office-news"
                className="inline-flex items-center gap-1 text-xs md:text-sm font-bold text-red-600 dark:text-red-505 hover:text-red-700 transition-colors"
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
                        {new Date(art.date).toLocaleDateString(language === 'te' ? 'te-IN' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Inline Advertisement */}
          <AdBanner slotId="mid-home-reviews-ads" size="inline" />

          {/* Reviews Section */}
          <section className="my-10 w-full">
            <div className="flex items-center justify-between border-b-2 border-neutral-100 dark:border-neutral-850 pb-3 mb-6 relative">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  {language === 'te' ? 'సినిమా రివ్యూలు (Reviews)' : 'Reviews'}
                </h2>
              </div>
              <Link
                to="/category/reviews"
                className="inline-flex items-center gap-1 text-xs md:text-sm font-bold text-red-600 dark:text-red-505 hover:text-red-700 transition-colors"
              >
                <span>{translateText('అన్నీ చూడండి', language)}</span>
                <FiChevronRight className="text-base" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {newsArticles
                .filter(art => art.category === 'reviews')
                .slice(0, 3)
                .map(art => {
                  const rating = (art.id.charCodeAt(art.id.length - 1) % 3) / 2 + 3.5;
                  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(rating));
                  
                  return (
                    <div key={art.id} className="flex flex-col bg-white dark:bg-neutral-900 border border-neutral-150/60 dark:border-neutral-850 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group relative">
                      <Link to={`/news/${art.id}`} className="absolute inset-0 z-10" />
                      <div className="aspect-[2/3] w-full overflow-hidden relative bg-neutral-950">
                        <img src={art.image} alt={art.title} className="w-full h-full object-cover transform duration-500 group-hover:scale-105" />
                        <div className="absolute top-3 right-3 bg-black/80 text-white text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10 shadow z-20">
                          <span className="text-yellow-500">★</span>
                          <span>{rating.toFixed(1)} / 5</span>
                        </div>
                      </div>
                      <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-0.5 text-xs text-yellow-500">
                            {stars.map((filled, i) => (
                              <span key={i}>{filled ? '★' : '☆'}</span>
                            ))}
                          </div>
                          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white line-clamp-2 leading-snug group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                            {translateText(art.title, language)}
                          </h3>
                        </div>
                        <p className="text-neutral-500 text-[11px] line-clamp-2 leading-relaxed">
                          {translateText(art.description, language)}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* Photo Gallery Section */}
          <section className="my-10 w-full">
            <div className="flex items-center justify-between border-b-2 border-neutral-100 dark:border-neutral-850 pb-3 mb-6 relative">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  {language === 'te' ? 'చిత్ర మాలిక (Gallery)' : 'Gallery'}
                </h2>
              </div>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-1 text-xs md:text-sm font-bold text-red-600 dark:text-red-505 hover:text-red-700 transition-colors"
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
                  <div className="absolute bottom-0 inset-x-0 bg-red-600 hover:bg-red-750 text-white text-center py-2.5 px-3 flex items-center justify-center transition-colors duration-300 select-none z-20">
                    <p className="text-white text-[11px] md:text-xs font-bold leading-tight font-sans line-clamp-2">
                      {translateText(item.title, language)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Side: Sidebar, Newsletter, Small Ads */}
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
              తాజా వార్తలు, విశ్లేషణలు మరియు ప్రత్యేక ఇంటర్వ్యూలను మా అధికారిక వీడియో విభాగంలో వీక్షించండి.
            </p>
            <Link
              to="/videos"
              className="w-full py-2.5 bg-white text-red-700 hover:bg-neutral-100 text-center font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>వీడియోల విభాగం చూడండి</span>
            </Link>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FiImage className="text-red-600 text-lg" />
              <span>చిత్ర మాలిక (Gallery)</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              కీలక రాజకీయ సంఘటనలు, సినీ వేడుకలు మరియు క్రీడా విశేషాల అద్భుతమైన చిత్రాలను మా గ్యాలరీలో చూడండి.
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
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4 leading-relaxed">
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
    </div>
  );
};

export default Home;
