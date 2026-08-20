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
import { FiMail, FiVideo, FiImage } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Home = () => {
  const { articles: newsArticles, language } = useAdminData();
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

          {/* Reviews Category Block */}
          <CategoryBlock 
            categoryKey="reviews" 
            categoryTelugu="రివ్యూలు (Reviews)" 
            articles={newsArticles} 
          />

          {/* Inline Advertisement */}
          <AdBanner slotId="mid-home-reviews-ads" size="inline" />

          {/* Box Office News Category Block */}
          <CategoryBlock 
            categoryKey="box-office-news" 
            categoryTelugu="బాక్స్ ఆఫీస్ వార్తలు (Box Office News)" 
            articles={newsArticles} 
          />

          {/* Live Tracking Category Block */}
          <CategoryBlock 
            categoryKey="live-tracking" 
            categoryTelugu="లైవ్ ట్రాకింగ్ (Live Tracking)" 
            articles={newsArticles} 
          />

          {/* Polls Category Block */}
          <CategoryBlock 
            categoryKey="polls" 
            categoryTelugu="పోల్స్ (Polls)" 
            articles={newsArticles} 
          />

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
