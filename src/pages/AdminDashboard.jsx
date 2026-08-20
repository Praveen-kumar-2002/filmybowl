import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiGrid, 
  FiFileText, 
  FiFolder, 
  FiMessageSquare, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiTrendingUp, 
  FiCheckCircle, 
  FiUser, 
  FiCalendar,
  FiEye,
  FiAlertCircle,
  FiLayout,
  FiRadio,
  FiImage,
  FiVideo,
  FiActivity,
  FiSettings,
  FiGlobe,
  FiShare2,
  FiMoon,
  FiSun,
  FiTv
} from 'react-icons/fi';
import { useAdminData } from '../context/AdminDataContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { 
    articles, 
    categories, 
    comments, 
    popupAds,
    breakingNews,
    photos,
    videos,
    settings,
    addArticle, 
    editArticle, 
    deleteArticle, 
    addCategory, 
    editCategory, 
    deleteCategory, 
    deleteComment,
    addPopupAd,
    editPopupAd,
    deletePopupAd,
    addBreakingNews,
    editBreakingNews,
    deleteBreakingNews,
    addPhoto,
    deletePhoto,
    addVideo,
    deleteVideo,
    updateSettings,
    resetSettings
  } = useAdminData();

  // Tab State & Sidebar Toggle
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Authentication & Session Expiry gate check
  useEffect(() => {
    // Initial check
    if (sessionStorage.getItem('filmybowl_admin_auth') !== 'true') {
      navigate('/admin/login');
      return;
    }

    const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes

    const checkSession = () => {
      const authTime = sessionStorage.getItem('filmybowl_admin_auth_time');
      if (authTime) {
        const timeElapsed = Date.now() - parseInt(authTime, 10);
        if (timeElapsed > SESSION_TIMEOUT) {
          sessionStorage.removeItem('filmybowl_admin_auth');
          sessionStorage.removeItem('filmybowl_admin_auth_time');
          navigate('/admin/login?expired=true');
        }
      } else {
        // No timestamp, logout
        sessionStorage.removeItem('filmybowl_admin_auth');
        navigate('/admin/login');
      }
    };

    const resetSessionTimer = () => {
      if (sessionStorage.getItem('filmybowl_admin_auth') === 'true') {
        sessionStorage.setItem('filmybowl_admin_auth_time', Date.now().toString());
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 10000); // Check every 10 seconds

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'click'];
    events.forEach(event => window.addEventListener(event, resetSessionTimer));

    return () => {
      clearInterval(interval);
      events.forEach(event => window.removeEventListener(event, resetSessionTimer));
    };
  }, [navigate]);

  const confirmLogout = () => {
    sessionStorage.removeItem('filmybowl_admin_auth');
    setShowLogoutModal(false);
    navigate('/admin/login');
  };

  // -------------------------------------------------------------
  // ARTICLES HANDLERS
  // -------------------------------------------------------------
  const [artSearch, setArtSearch] = useState('');
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [artTitle, setArtTitle] = useState('');
  const [artCategory, setArtCategory] = useState('film-news');
  const [artAuthor, setArtAuthor] = useState('');
  const [artImage, setArtImage] = useState('');
  const [artDesc, setArtDesc] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artStatus, setArtStatus] = useState('Published');

  const openArticleModal = (art = null) => {
    if (art) {
      setEditingArticle(art);
      setArtTitle(art.title);
      setArtCategory(art.category);
      setArtAuthor(art.author);
      setArtImage(art.image);
      setArtDesc(art.description);
      setArtContent(Array.isArray(art.content) ? art.content.join('\n\n') : art.content || '');
      setArtStatus(art.featured ? 'Published' : 'Draft');
    } else {
      setEditingArticle(null);
      setArtTitle('');
      setArtCategory(categories[0]?.key || 'film-news');
      setArtAuthor('Admin Editor');
      setArtImage('https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80');
      setArtDesc('');
      setArtContent('');
      setArtStatus('Published');
    }
    setIsArticleModalOpen(true);
  };

  const handleArticleSubmit = (e) => {
    e.preventDefault();
    const articlePayload = {
      title: artTitle,
      category: artCategory,
      categoryTelugu: categories.find(c => c.key === artCategory)?.nameTelugu || 'వార్తలు',
      author: artAuthor,
      image: artImage,
      description: artDesc,
      content: artContent.split('\n\n').filter(p => p.trim() !== ''),
      featured: artStatus === 'Published',
      trending: true
    };
    if (editingArticle) {
      editArticle(editingArticle.id, articlePayload);
    } else {
      addArticle(articlePayload);
    }
    setIsArticleModalOpen(false);
  };

  // -------------------------------------------------------------
  // CATEGORIES HANDLERS
  // -------------------------------------------------------------
  const [catTelugu, setCatTelugu] = useState('');
  const [catEnglish, setCatEnglish] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const openCategoryModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCatTelugu(cat.nameTelugu);
      setCatEnglish(cat.nameEnglish);
    } else {
      setEditingCategory(null);
      setCatTelugu('');
      setCatEnglish('');
    }
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    const catPayload = {
      nameTelugu: catTelugu,
      nameEnglish: catEnglish
    };
    if (editingCategory) {
      editCategory(editingCategory.id, catPayload);
    } else {
      addCategory(catPayload);
    }
    setIsCategoryModalOpen(false);
  };

  // -------------------------------------------------------------
  // COMMENTS HANDLERS
  // -------------------------------------------------------------
  const [comSearch, setComSearch] = useState('');

  // -------------------------------------------------------------
  // POPUP ADS HANDLERS
  // -------------------------------------------------------------
  const [adSearch, setAdSearch] = useState('');
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [adTitle, setAdTitle] = useState('');
  const [adImage, setAdImage] = useState('');
  const [adRedirect, setAdRedirect] = useState('');
  const [adStatus, setAdStatus] = useState('Active');
  const [adStart, setAdStart] = useState('');
  const [adEnd, setAdEnd] = useState('');

  const openAdModal = (ad = null) => {
    if (ad) {
      setEditingAd(ad);
      setAdTitle(ad.title);
      setAdImage(ad.image);
      setAdRedirect(ad.redirectUrl);
      setAdStatus(ad.status);
      setAdStart(ad.startDate);
      setAdEnd(ad.endDate);
    } else {
      setEditingAd(null);
      setAdTitle('');
      setAdImage('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80');
      setAdRedirect('https://images.unsplash.com');
      setAdStatus('Active');
      setAdStart(new Date().toISOString().split('T')[0]);
      setAdEnd(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    }
    setIsAdModalOpen(true);
  };

  const handleAdSubmit = (e) => {
    e.preventDefault();
    const adPayload = {
      title: adTitle,
      image: adImage,
      redirectUrl: adRedirect,
      status: adStatus,
      startDate: adStart,
      endDate: adEnd
    };
    if (editingAd) {
      editPopupAd(editingAd.id, adPayload);
    } else {
      addPopupAd(adPayload);
    }
    setIsAdModalOpen(false);
  };

  // -------------------------------------------------------------
  // BREAKING NEWS HANDLERS
  // -------------------------------------------------------------
  const [bnSearch, setBnSearch] = useState('');
  const [isBnModalOpen, setIsBnModalOpen] = useState(false);
  const [editingBn, setEditingBn] = useState(null);
  const [bnTitle, setBnTitle] = useState('');
  const [bnPriority, setBnPriority] = useState('High');
  const [bnStatus, setBnStatus] = useState('Active');
  const [bnPublishDate, setBnPublishDate] = useState('');

  const openBnModal = (bn = null) => {
    if (bn) {
      setEditingBn(bn);
      setBnTitle(bn.title);
      setBnPriority(bn.priority);
      setBnStatus(bn.status);
      setBnPublishDate(bn.publishDate);
    } else {
      setEditingBn(null);
      setBnTitle('');
      setBnPriority('High');
      setBnStatus('Active');
      setBnPublishDate(new Date().toISOString().split('T')[0]);
    }
    setIsBnModalOpen(true);
  };

  const handleBnSubmit = (e) => {
    e.preventDefault();
    const bnPayload = {
      title: bnTitle,
      priority: bnPriority,
      status: bnStatus,
      publishDate: bnPublishDate
    };
    if (editingBn) {
      editBreakingNews(editingBn.id, bnPayload);
    } else {
      addBreakingNews(bnPayload);
    }
    setIsBnModalOpen(false);
  };

  // -------------------------------------------------------------
  // PHOTOS & VIDEOS HANDLERS
  // -------------------------------------------------------------
  const [mediaSubTab, setMediaSubTab] = useState('photos'); // photos or videos
  const [mediaSearch, setMediaSearch] = useState('');
  
  // Media creation modal variables
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [phTitle, setPhTitle] = useState('');
  const [phCategory, setPhCategory] = useState('Movies');
  const [phImage, setPhImage] = useState('');

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [vdTitle, setVdTitle] = useState('');
  const [vdCategory, setVdCategory] = useState('Movies');
  const [vdThumbnail, setVdThumbnail] = useState('');
  const [vdUrl, setVdUrl] = useState('');

  const handlePhotoSubmit = (e) => {
    e.preventDefault();
    addPhoto({
      title: phTitle,
      category: phCategory,
      image: phImage
    });
    setPhTitle('');
    setPhImage('');
    setIsPhotoModalOpen(false);
  };

  const handleVideoSubmit = (e) => {
    e.preventDefault();
    addVideo({
      title: vdTitle,
      category: vdCategory,
      thumbnail: vdThumbnail,
      videoUrl: vdUrl
    });
    setVdTitle('');
    setVdThumbnail('');
    setVdUrl('');
    setIsVideoModalOpen(false);
  };

  // -------------------------------------------------------------
  // SETTINGS HANDLERS
  // -------------------------------------------------------------
  const [setWebName, setSetWebName] = useState(settings.websiteName);
  const [setLogo, setSetLogo] = useState(settings.logoUrl);
  const [setFavicon, setSetFavicon] = useState(settings.faviconUrl);
  const [setEmail, setSetEmail] = useState(settings.contactEmail);
  const [setPhone, setSetPhone] = useState(settings.phoneNumber);

  const [setFacebook, setSetFacebook] = useState(settings.facebookUrl);
  const [setInstagram, setSetInstagram] = useState(settings.instagramUrl);
  const [setYoutube, setSetYoutube] = useState(settings.youtubeUrl);
  const [setTwitter, setSetTwitter] = useState(settings.twitterUrl);

  const [setMetaTitle, setSetMetaTitle] = useState(settings.metaTitle);
  const [setMetaDesc, setSetMetaDesc] = useState(settings.metaDescription);
  const [setKeywords, setSetKeywords] = useState(settings.keywords);
  const [setThemeMode, setSetThemeMode] = useState(settings.theme);

  const [setBillboardImage, setSetBillboardImage] = useState(settings.billboardAdImage || '');
  const [setBillboardLink, setSetBillboardLink] = useState(settings.billboardAdLink || '');

  const handleSettingsSave = (e) => {
    e.preventDefault();
    updateSettings({
      websiteName: setWebName,
      logoUrl: setLogo,
      faviconUrl: setFavicon,
      contactEmail: setEmail,
      phoneNumber: setPhone,
      facebookUrl: setFacebook,
      instagramUrl: setInstagram,
      youtubeUrl: setYoutube,
      twitterUrl: setTwitter,
      metaTitle: setMetaTitle,
      metaDescription: setMetaDesc,
      keywords: setKeywords,
      theme: setThemeMode,
      billboardAdImage: setBillboardImage,
      billboardAdLink: setBillboardLink
    });
    alert('మ్యాప్ చేయబడిన వివరాలు సేవ్ చేయబడ్డాయి! (Settings saved successfully)');
  };

  const handleSettingsReset = () => {
    resetSettings();
    setSetWebName('Filmybowl');
    setSetLogo('https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=150&q=80');
    setSetFavicon('https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=32&q=80');
    setSetEmail('support@filmybowl.com');
    setSetPhone('+91 98765 43210');
    setSetFacebook('https://facebook.com/filmybowl');
    setSetInstagram('https://instagram.com/filmybowl');
    setSetYoutube('https://youtube.com/filmybowl');
    setSetTwitter('https://twitter.com/filmybowl');
    setSetMetaTitle('Filmybowl - తాజా టాలీవుడ్ సినిమా వార్తలు, రివ్యూలు');
    setSetMetaDesc('ఫిల్మీబౌల్ న్యూస్ పోర్టల్ మీకు నిష్పక్షపాతంగా, వేగంగా మరియు కచ్చితమైన టాలీవుడ్ సినిమా వార్తలను, రివ్యూలను మరియు బాక్సాఫీస్ అప్‌డేట్స్‌ను అందిస్తుంది.');
    setSetKeywords('Filmybowl, Telugu Cinema, Tollywood, Movie Reviews, Gossips, Box Office');
    setSetThemeMode('Dark');
    setSetBillboardImage('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80');
    setSetBillboardLink('https://images.unsplash.com');
  };

  // -------------------------------------------------------------
  // STATS & FILTERED DATA CALCULATIONS
  // -------------------------------------------------------------
  const totalArticles = articles.length;
  const publishedArticles = articles.filter(a => a.featured).length;
  const totalCategoriesCount = categories.length;
  const totalCommentsCount = comments.length;

  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
  const todayViews = 24500;
  const weeklyViews = 185900;
  const monthlyViews = 792400;
  const totalVisitors = 456800;

  const filteredArticles = articles.filter(art => 
    art.title.toLowerCase().includes(artSearch.toLowerCase()) ||
    art.author.toLowerCase().includes(artSearch.toLowerCase())
  );

  const filteredPopupAds = popupAds.filter(ad =>
    ad.title.toLowerCase().includes(adSearch.toLowerCase())
  );

  const filteredBreakingNews = breakingNews.filter(bn =>
    bn.title.toLowerCase().includes(bnSearch.toLowerCase())
  );

  const filteredPhotos = photos.filter(ph =>
    ph.title.toLowerCase().includes(mediaSearch.toLowerCase()) ||
    ph.category.toLowerCase().includes(mediaSearch.toLowerCase())
  );

  const filteredVideos = videos.filter(vd =>
    vd.title.toLowerCase().includes(mediaSearch.toLowerCase()) ||
    vd.category.toLowerCase().includes(mediaSearch.toLowerCase())
  );

  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'articles', label: 'Articles', icon: FiFileText },
    { id: 'categories', label: 'Categories', icon: FiFolder },
    { id: 'comments', label: 'Comments', icon: FiMessageSquare },
    { id: 'popup-ads', label: 'Popup Ads', icon: FiLayout },
    { id: 'breaking-news', label: 'Breaking News', icon: FiRadio },
    { id: 'photos-videos', label: 'Photos & Videos', icon: FiImage },
    { id: 'analytics', label: 'Analytics', icon: FiActivity },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  return (
    <div className="min-h-screen flex bg-neutral-950 text-neutral-100 font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-neutral-900 border-r border-neutral-850 flex flex-col justify-between transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-x lg:translate-x-0'}`}>
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-neutral-850 flex items-center justify-between">
            <span className="text-xl font-black tracking-wider text-white">
              FILMY<span className="text-red-650">BOWL</span>
              <span className="text-[10px] bg-red-600/10 text-red-500 font-extrabold ml-1 px-1.5 py-0.5 rounded border border-red-500/20">ADMIN</span>
            </span>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-neutral-400 hover:text-white cursor-pointer">
              <FiX className="text-lg" />
            </button>
          </div>

          {/* Links list */}
          <nav className="p-4 space-y-1 h-[calc(100vh-160px)] overflow-y-auto scrollbar-thin">
            {sidebarLinks.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === tab.id ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:bg-neutral-850 hover:text-white'}`}
              >
                <tab.icon className="text-lg shrink-0" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout button at bottom */}
        <div className="p-4 border-t border-neutral-850">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-neutral-400 hover:bg-red-950/20 hover:text-red-400 transition-colors cursor-pointer"
          >
            <FiLogOut className="text-lg shrink-0" />
            <span>Logout (నిష్క్రమించు)</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT SPACE */}
      <div className="flex-1 min-h-screen flex flex-col lg:pl-64">
        
        {/* HEADER TOP BAR */}
        <header className="h-16 border-b border-neutral-850 bg-neutral-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-1.5 hover:bg-neutral-850 rounded-lg text-neutral-400 hover:text-white cursor-pointer">
              <FiMenu className="text-xl" />
            </button>
            <h1 className="text-sm md:text-base font-extrabold text-white select-none capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-neutral-400 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 bg-neutral-850 px-3 py-1.5 rounded-full border border-neutral-800">
              <FiCalendar className="text-neutral-500" />
              <span>{new Date().toLocaleDateString('te-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center font-bold">
              <FiUser />
            </div>
          </div>
        </header>

        {/* CONTAINER CONTENT */}
        <main className="p-6 flex-1 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* 1. DASHBOARD HOME */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Stats cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: 'Total Articles', val: totalArticles, icon: FiFileText, color: 'text-blue-500', desc: 'రాసిన మొత్తం కథనాలు' },
                    { title: 'Published Articles', val: publishedArticles, icon: FiCheckCircle, color: 'text-green-500', desc: 'ప్రచురించిన కథనాలు' },
                    { title: 'Total Categories', val: totalCategoriesCount, icon: FiFolder, color: 'text-purple-500', desc: 'మొత్తం విభాగాలు' },
                    { title: 'Total Comments', val: totalCommentsCount, icon: FiMessageSquare, color: 'text-yellow-500', desc: 'పాఠకుల అభిప్రాయాలు' }
                  ].map((stat, i) => (
                    <div key={i} className="p-5 bg-neutral-900 border border-neutral-850 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden">
                      <div className="space-y-1 relative z-10">
                        <span className="text-xs text-neutral-400 font-bold">{stat.title}</span>
                        <div className="text-2xl font-black text-white">{stat.val}</div>
                        <p className="text-[10px] text-neutral-500 leading-none pt-1">{stat.desc}</p>
                      </div>
                      <div className={`p-3 bg-neutral-950 border border-neutral-800 rounded-xl ${stat.color} text-xl relative z-10`}>
                        <stat.icon />
                      </div>
                      <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>
                    </div>
                  ))}
                </div>

                {/* Dashboard micro metrics allocation view */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Category allocation progress meter */}
                  <div className="lg:col-span-2 p-5 bg-neutral-900 border border-neutral-850 rounded-2xl space-y-4">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5"><FiTrendingUp className="text-red-500" /> Category Allocation Metrics</h3>
                    <div className="space-y-3 pt-2">
                      {categories.map((cat, idx) => {
                        const count = articles.filter(a => a.category === cat.key).length;
                        const pct = totalArticles > 0 ? Math.round((count / totalArticles) * 100) : 0;
                        const barColors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
                        
                        return (
                          <div key={cat.id} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-neutral-350">{cat.nameEnglish} ({cat.nameTelugu})</span>
                              <span className="text-neutral-400">{count} Articles ({pct}%)</span>
                            </div>
                            <div className="w-full bg-neutral-950 rounded-full h-2">
                              <div className={`h-full rounded-full ${barColors[idx % barColors.length]}`} style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Activity Logger feed list */}
                  <div className="p-5 bg-neutral-900 border border-neutral-850 rounded-2xl space-y-4">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Recent Activity Feed</h3>
                    <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1">
                      {articles.slice(0, 4).map((art, idx) => (
                        <div key={art.id} className="flex gap-2 text-xs border-b border-neutral-850 pb-2 last:border-0 last:pb-0">
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-red-650 shrink-0"></div>
                          <div className="space-y-0.5">
                            <p className="font-bold text-neutral-200 line-clamp-1">{art.title}</p>
                            <span className="text-[9px] text-neutral-500">Published by {art.author} • {art.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 2. ARTICLES PANEL */}
            {activeTab === 'articles' && (
              <motion.div
                key="articles"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900 p-4 border border-neutral-850 rounded-2xl shadow">
                  <div className="relative w-full sm:w-80">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                      <FiSearch />
                    </span>
                    <input
                      type="text"
                      placeholder="శోధించండి (Search title, author...)"
                      value={artSearch}
                      onChange={(e) => setArtSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 text-sm rounded-xl outline-none focus:border-red-650 transition-colors placeholder-neutral-500 animate-none"
                    />
                  </div>
                  <button
                    onClick={() => openArticleModal()}
                    className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow transition-colors"
                  >
                    <FiPlus />
                    <span>కథనాన్ని జోడించు (Add Article)</span>
                  </button>
                </div>

                <div className="bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-neutral-950 text-neutral-455 uppercase tracking-widest text-[10px] font-bold border-b border-neutral-850">
                        <tr>
                          <th className="px-6 py-4">Article</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Author</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Views</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-850/40 text-neutral-250">
                        {filteredArticles.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="px-6 py-8 text-center text-neutral-550">No articles found.</td>
                          </tr>
                        ) : (
                          filteredArticles.map(art => (
                            <tr key={art.id} className="hover:bg-neutral-850/20 transition-colors animate-none">
                              <td className="px-6 py-4 max-w-xs sm:max-w-sm">
                                <div className="flex items-center gap-3">
                                  <img src={art.image} className="w-10 h-7 rounded object-cover bg-neutral-950 border border-neutral-800 shrink-0" alt="" />
                                  <div className="space-y-0.5">
                                    <p className="font-bold text-neutral-100 line-clamp-1">{art.title}</p>
                                    <p className="text-[10px] text-neutral-500 line-clamp-1">{art.description}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-0.5 bg-neutral-950 border border-neutral-800 rounded font-semibold text-[10px]">
                                  {art.categoryTelugu} ({art.category})
                                </span>
                              </td>
                              <td className="px-6 py-4 font-bold text-neutral-350">{art.author}</td>
                              <td className="px-6 py-4 text-neutral-500">{art.date}</td>
                              <td className="px-6 py-4 font-mono font-semibold text-neutral-450">{art.views.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${art.featured ? 'bg-green-950/60 border border-green-900/30 text-green-400' : 'bg-yellow-950/60 border border-yellow-900/30 text-yellow-400'}`}>
                                  {art.featured ? 'Published' : 'Draft'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2.5">
                                  <button onClick={() => openArticleModal(art)} className="p-1 hover:text-red-500 text-neutral-400 cursor-pointer">
                                    <FiEdit />
                                  </button>
                                  <button onClick={() => deleteArticle(art.id)} className="p-1 hover:text-red-650 text-neutral-400 cursor-pointer">
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. CATEGORIES PANEL */}
            {activeTab === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between bg-neutral-900 p-4 border border-neutral-850 rounded-2xl shadow">
                  <span className="text-xs text-neutral-450 font-bold">విభాగాలు (Manage category metadata labels)</span>
                  <button
                    onClick={() => openCategoryModal()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow transition-colors"
                  >
                    <FiPlus />
                    <span>విభాగం జోడించు (Add Category)</span>
                  </button>
                </div>

                <div className="bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-neutral-950 text-neutral-455 uppercase tracking-widest text-[10px] font-bold border-b border-neutral-850">
                        <tr>
                          <th className="px-6 py-4">Telugu Name</th>
                          <th className="px-6 py-4">English Label</th>
                          <th className="px-6 py-4">Url Slug / Key</th>
                          <th className="px-6 py-4">Total Articles</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-850/40 text-neutral-250">
                        {categories.map(cat => {
                          const count = articles.filter(a => a.category === cat.key).length;
                          return (
                            <tr key={cat.id} className="hover:bg-neutral-850/20 transition-colors">
                              <td className="px-6 py-4 font-bold text-neutral-100">{cat.nameTelugu}</td>
                              <td className="px-6 py-4 font-bold text-neutral-350">{cat.nameEnglish}</td>
                              <td className="px-6 py-4 font-mono text-neutral-500">{cat.key}</td>
                              <td className="px-6 py-4 font-mono font-semibold text-neutral-450">{count} Articles</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2.5">
                                  <button onClick={() => openCategoryModal(cat)} className="p-1 hover:text-red-500 text-neutral-400 cursor-pointer">
                                    <FiEdit />
                                  </button>
                                  <button onClick={() => deleteCategory(cat.id)} className="p-1 hover:text-red-650 text-neutral-400 cursor-pointer">
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. COMMENTS PANEL */}
            {activeTab === 'comments' && (
              <motion.div
                key="comments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-neutral-900 p-4 border border-neutral-850 rounded-2xl shadow">
                  <div className="relative w-full sm:w-80">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                      <FiSearch />
                    </span>
                    <input
                      type="text"
                      placeholder="అభిప్రాయాలు శోధించండి (Search comments...)"
                      value={comSearch}
                      onChange={(e) => setComSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-neutral-955 border border-neutral-800 text-sm rounded-xl outline-none focus:border-red-650 transition-colors placeholder-neutral-500"
                    />
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-neutral-950 text-neutral-455 uppercase tracking-widest text-[10px] font-bold border-b border-neutral-850">
                        <tr>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Comment Text</th>
                          <th className="px-6 py-4">Article Reference</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-850/40 text-neutral-250">
                        {comments.filter(c => c.name.toLowerCase().includes(comSearch.toLowerCase()) || c.text.toLowerCase().includes(comSearch.toLowerCase())).map(com => (
                          <tr key={com.id} className="hover:bg-neutral-850/20 transition-colors">
                            <td className="px-6 py-4 font-bold text-neutral-100 flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-red-600/10 text-red-500 border border-red-500/20 flex items-center justify-center font-bold text-[10px] shrink-0">
                                {com.name[0]?.toUpperCase()}
                              </div>
                              <span>{com.name}</span>
                            </td>
                            <td className="px-6 py-4 italic text-neutral-350">{com.text}</td>
                            <td className="px-6 py-4 max-w-xs truncate text-neutral-450 font-semibold">{com.articleTitle}</td>
                            <td className="px-6 py-4 text-neutral-500">{com.date}</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => deleteComment(com.id)} className="p-1 hover:text-red-650 text-neutral-450 cursor-pointer">
                                <FiTrash2 />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. POPUP ADS MODULE */}
            {activeTab === 'popup-ads' && (
              <motion.div
                key="popup-ads"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900 p-4 border border-neutral-850 rounded-2xl shadow">
                  <div className="relative w-full sm:w-80">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                      <FiSearch />
                    </span>
                    <input
                      type="text"
                      placeholder="జాహిరాతులు శోధించండి (Search popups...)"
                      value={adSearch}
                      onChange={(e) => setAdSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 text-sm rounded-xl outline-none focus:border-red-650 transition-colors placeholder-neutral-500"
                    />
                  </div>
                  <button
                    onClick={() => openAdModal()}
                    className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow transition-colors"
                  >
                    <FiPlus />
                    <span>జాహిరాతు సృష్టించు (Create Popup Ad)</span>
                  </button>
                </div>

                <div className="bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-neutral-950 text-neutral-455 uppercase tracking-widest text-[10px] font-bold border-b border-neutral-850">
                        <tr>
                          <th className="px-6 py-4">Title</th>
                          <th className="px-6 py-4">Image Banner</th>
                          <th className="px-6 py-4">Redirect Url</th>
                          <th className="px-6 py-4">Start Date</th>
                          <th className="px-6 py-4">End Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-850/40 text-neutral-250">
                        {filteredPopupAds.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="px-6 py-8 text-center text-neutral-500">No popups found.</td>
                          </tr>
                        ) : (
                          filteredPopupAds.map(ad => (
                            <tr key={ad.id} className="hover:bg-neutral-850/20 transition-colors">
                              <td className="px-6 py-4 font-bold text-neutral-100">{ad.title}</td>
                              <td className="px-6 py-4">
                                <img src={ad.image} className="w-16 h-10 object-cover bg-neutral-950 border border-neutral-800 rounded" alt="" />
                              </td>
                              <td className="px-6 py-4 font-mono text-neutral-450">{ad.redirectUrl}</td>
                              <td className="px-6 py-4 text-neutral-500">{ad.startDate}</td>
                              <td className="px-6 py-4 text-neutral-500">{ad.endDate}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${ad.status === 'Active' ? 'bg-green-950/60 border border-green-900/30 text-green-400' : 'bg-red-950/60 border border-red-900/30 text-red-400'}`}>
                                  {ad.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2.5">
                                  <button onClick={() => openAdModal(ad)} className="p-1 hover:text-red-500 text-neutral-400 cursor-pointer">
                                    <FiEdit />
                                  </button>
                                  <button onClick={() => deletePopupAd(ad.id)} className="p-1 hover:text-red-650 text-neutral-400 cursor-pointer">
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 6. BREAKING NEWS MODULE */}
            {activeTab === 'breaking-news' && (
              <motion.div
                key="breaking-news"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900 p-4 border border-neutral-850 rounded-2xl shadow">
                  <div className="relative w-full sm:w-80">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                      <FiSearch />
                    </span>
                    <input
                      type="text"
                      placeholder="వార్తలు శోధించండి (Search breaking news...)"
                      value={bnSearch}
                      onChange={(e) => setBnSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 text-sm rounded-xl outline-none focus:border-red-650 transition-colors placeholder-neutral-500"
                    />
                  </div>
                  <button
                    onClick={() => openBnModal()}
                    className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow transition-colors"
                  >
                    <FiPlus />
                    <span>ప్రకటన జోడించు (Add Breaking News)</span>
                  </button>
                </div>

                <div className="bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-neutral-950 text-neutral-455 uppercase tracking-widest text-[10px] font-bold border-b border-neutral-850">
                        <tr>
                          <th className="px-6 py-4">Title</th>
                          <th className="px-6 py-4">Priority</th>
                          <th className="px-6 py-4">Publish Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-850/40 text-neutral-250">
                        {filteredBreakingNews.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-neutral-500">No tickers found.</td>
                          </tr>
                        ) : (
                          filteredBreakingNews.map(bn => (
                            <tr key={bn.id} className="hover:bg-neutral-850/20 transition-colors">
                              <td className="px-6 py-4 font-bold text-neutral-100 max-w-sm sm:max-w-md truncate">{bn.title}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${bn.priority === 'High' ? 'bg-red-950/80 border border-red-900/30 text-red-400' : bn.priority === 'Medium' ? 'bg-yellow-950/80 border border-yellow-900/30 text-yellow-400' : 'bg-blue-950/80 border border-blue-900/30 text-blue-400'}`}>
                                  {bn.priority}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-neutral-500">{bn.publishDate}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${bn.status === 'Active' ? 'bg-green-950/60 border border-green-900/30 text-green-400' : 'bg-red-950/60 border border-red-900/30 text-red-400'}`}>
                                  {bn.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2.5">
                                  <button onClick={() => openBnModal(bn)} className="p-1 hover:text-red-500 text-neutral-400 cursor-pointer">
                                    <FiEdit />
                                  </button>
                                  <button onClick={() => deleteBreakingNews(bn.id)} className="p-1 hover:text-red-650 text-neutral-400 cursor-pointer">
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 7. PHOTOS & VIDEOS MODULE */}
            {activeTab === 'photos-videos' && (
              <motion.div
                key="photos-videos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Tabs selection: Photos / Videos */}
                <div className="flex items-center justify-between bg-neutral-900 p-4 border border-neutral-850 rounded-2xl shadow">
                  <div className="flex bg-neutral-950 p-1.5 rounded-xl border border-neutral-800">
                    {['photos', 'videos'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => {
                          setMediaSubTab(tab);
                          setMediaSearch('');
                        }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${mediaSubTab === tab ? 'bg-neutral-800 text-white shadow' : 'text-neutral-500 hover:text-neutral-250'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative hidden sm:block">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                        <FiSearch />
                      </span>
                      <input
                        type="text"
                        placeholder="శోధించండి (Search title...)"
                        value={mediaSearch}
                        onChange={(e) => setMediaSearch(e.target.value)}
                        className="pl-9 pr-4 py-1.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl outline-none focus:border-red-650 transition-colors placeholder-neutral-550"
                      />
                    </div>

                    {mediaSubTab === 'photos' ? (
                      <button
                        onClick={() => setIsPhotoModalOpen(true)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow transition-colors"
                      >
                        <FiPlus />
                        <span>ఫొటో జోడించు (Upload Photo)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsVideoModalOpen(true)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow transition-colors"
                      >
                        <FiPlus />
                        <span>వీడియో జోడించు (Upload Video)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-tab view: Photos grid */}
                {mediaSubTab === 'photos' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredPhotos.length === 0 ? (
                      <div className="col-span-full py-8 text-center text-neutral-500">No photos found.</div>
                    ) : (
                      filteredPhotos.map(ph => (
                        <div key={ph.id} className="bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden shadow group relative flex flex-col justify-between">
                          <div className="aspect-[4/3] w-full bg-neutral-950 relative overflow-hidden">
                            <img src={ph.image} className="w-full h-full object-cover group-hover:scale-105 duration-300 transition-transform" alt="" />
                            <span className="absolute top-2 left-2 bg-neutral-900/90 text-white font-semibold text-[8px] tracking-wider uppercase px-2 py-0.5 rounded border border-white/10">
                              {ph.category}
                            </span>
                          </div>
                          <div className="p-3 space-y-1.5">
                            <p className="text-xs font-bold text-neutral-200 line-clamp-1">{ph.title}</p>
                            <div className="flex justify-end pt-1">
                              <button onClick={() => deletePhoto(ph.id)} className="text-neutral-500 hover:text-red-650 cursor-pointer text-xs flex items-center gap-1">
                                <FiTrash2 /> <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Sub-tab view: Videos grid */}
                {mediaSubTab === 'videos' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredVideos.length === 0 ? (
                      <div className="col-span-full py-8 text-center text-neutral-500">No videos found.</div>
                    ) : (
                      filteredVideos.map(vd => (
                        <div key={vd.id} className="bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden shadow group flex flex-col justify-between">
                          <div className="aspect-video w-full bg-neutral-950 relative overflow-hidden">
                            <img src={vd.thumbnail} className="w-full h-full object-cover" alt="" />
                            <a
                              href={vd.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 bg-black/45 flex items-center justify-center text-white text-3xl opacity-90 group-hover:opacity-100 transition-opacity"
                            >
                              <FiTv className="text-red-500 animate-pulse" />
                            </a>
                            <span className="absolute top-2 left-2 bg-neutral-900/95 text-white font-semibold text-[8px] tracking-wider uppercase px-2 py-0.5 rounded border border-white/10">
                              {vd.category}
                            </span>
                          </div>
                          <div className="p-4 space-y-2">
                            <p className="text-xs font-bold text-neutral-200 line-clamp-1">{vd.title}</p>
                            <p className="text-[10px] text-neutral-500 font-mono truncate">{vd.videoUrl}</p>
                            <div className="flex justify-end border-t border-neutral-850 pt-2">
                              <button onClick={() => deleteVideo(vd.id)} className="text-neutral-550 hover:text-red-650 cursor-pointer text-xs flex items-center gap-1">
                                <FiTrash2 /> <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

              </motion.div>
            )}

            {/* 8. ANALYTICS MODULE */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Stats cards grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { label: 'Total Views', val: totalViews.toLocaleString(), color: 'text-red-500' },
                    { label: "Today's Views", val: todayViews.toLocaleString(), color: 'text-blue-500' },
                    { label: 'Weekly Views', val: weeklyViews.toLocaleString(), color: 'text-green-500' },
                    { label: 'Monthly Views', val: monthlyViews.toLocaleString(), color: 'text-purple-500' },
                    { label: 'Total Visitors', val: totalVisitors.toLocaleString(), color: 'text-yellow-500' }
                  ].map((stat, idx) => (
                    <div key={idx} className="p-4 bg-neutral-900 border border-neutral-850 rounded-2xl space-y-1 shadow">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">{stat.label}</span>
                      <div className={`text-lg font-black ${stat.color}`}>{stat.val}</div>
                    </div>
                  ))}
                </div>

                {/* SVG Charts visual layouts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Premium SVG Line graph for weekly views */}
                  <div className="lg:col-span-2 p-5 bg-neutral-900 border border-neutral-850 rounded-2xl space-y-4">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1"><FiActivity className="text-red-500" /> Views Velocity (Weekly trend)</h3>
                    
                    <div className="w-full aspect-[2/1] sm:aspect-[3/1] bg-neutral-950 rounded-xl p-3 border border-neutral-850 relative">
                      {/* Premium clean SVG grid vectors */}
                      <svg className="w-full h-full" viewBox="0 0 600 200">
                        {/* Grid lines */}
                        <line x1="50" y1="20" x2="550" y2="20" stroke="#1f1f1f" strokeDasharray="3" />
                        <line x1="50" y1="70" x2="550" y2="70" stroke="#1f1f1f" strokeDasharray="3" />
                        <line x1="50" y1="120" x2="550" y2="120" stroke="#1f1f1f" strokeDasharray="3" />
                        <line x1="50" y1="170" x2="550" y2="170" stroke="#1f1f1f" strokeDasharray="3" />

                        {/* Chart path line */}
                        <path
                          d="M 50 170 L 133 130 L 216 145 L 300 80 L 383 105 L 466 50 L 550 30"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Circles on dots points */}
                        <circle cx="50" cy="170" r="5.5" fill="#ef4444" stroke="#0a0a0a" strokeWidth="1.5" />
                        <circle cx="133" cy="130" r="5.5" fill="#ef4444" stroke="#0a0a0a" strokeWidth="1.5" />
                        <circle cx="216" cy="145" r="5.5" fill="#ef4444" stroke="#0a0a0a" strokeWidth="1.5" />
                        <circle cx="300" cy="80" r="5.5" fill="#ef4444" stroke="#0a0a0a" strokeWidth="1.5" />
                        <circle cx="383" cy="105" r="5.5" fill="#ef4444" stroke="#0a0a0a" strokeWidth="1.5" />
                        <circle cx="466" cy="50" r="5.5" fill="#ef4444" stroke="#0a0a0a" strokeWidth="1.5" />
                        <circle cx="550" cy="30" r="5.5" fill="#ef4444" stroke="#0a0a0a" strokeWidth="1.5" />

                        {/* Axis markers */}
                        <text x="50" y="192" fill="#555" fontSize="10" textAnchor="middle">Mon</text>
                        <text x="133" y="192" fill="#555" fontSize="10" textAnchor="middle">Tue</text>
                        <text x="216" y="192" fill="#555" fontSize="10" textAnchor="middle">Wed</text>
                        <text x="300" y="192" fill="#555" fontSize="10" textAnchor="middle">Thu</text>
                        <text x="383" y="192" fill="#555" fontSize="10" textAnchor="middle">Fri</text>
                        <text x="466" y="192" fill="#555" fontSize="10" textAnchor="middle">Sat</text>
                        <text x="550" y="192" fill="#555" fontSize="10" textAnchor="middle">Sun</text>

                        <text x="40" y="24" fill="#555" fontSize="9" textAnchor="end">50K</text>
                        <text x="40" y="74" fill="#555" fontSize="9" textAnchor="end">35K</text>
                        <text x="40" y="124" fill="#555" fontSize="9" textAnchor="end">20K</text>
                        <text x="40" y="174" fill="#555" fontSize="9" textAnchor="end">5K</text>
                      </svg>
                    </div>
                  </div>

                  {/* SVG Pie Chart allocation */}
                  <div className="p-5 bg-neutral-900 border border-neutral-850 rounded-2xl space-y-4 flex flex-col justify-between">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Category distribution</h3>
                    <div className="flex justify-center items-center py-2 relative">
                      <svg className="w-40 h-40" viewBox="0 0 36 36">
                        {/* Segment 1: News 35% */}
                        <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#ef4444" strokeWidth="4.2" strokeDasharray="35 65" strokeDashoffset="25" />
                        {/* Segment 2: Film News 45% */}
                        <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#3b82f6" strokeWidth="4.2" strokeDasharray="45 55" strokeDashoffset="90" />
                        {/* Segment 3: Reviews 20% */}
                        <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#10b981" strokeWidth="4.2" strokeDasharray="20 80" strokeDashoffset="135" />
                      </svg>

                      {/* Legend overlay inside center */}
                      <div className="absolute inset-0 flex items-center justify-center flex-col text-[10px] font-bold text-neutral-400">
                        <span>Film News 45%</span>
                        <span className="text-[9px] text-neutral-500">Dominant</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-center border-t border-neutral-850 pt-3">
                      <div className="flex flex-col items-center"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 mb-1"></span> Film News</div>
                      <div className="flex flex-col items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-500 mb-1"></span> News</div>
                      <div className="flex flex-col items-center"><span className="w-2.5 h-2.5 rounded-full bg-green-500 mb-1"></span> Reviews</div>
                    </div>
                  </div>

                </div>

                {/* Most Viewed Articles */}
                <div className="bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden shadow">
                  <div className="p-4 border-b border-neutral-850 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Most Viewed Articles</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-neutral-950 text-neutral-450 uppercase tracking-widest text-[9px] font-bold border-b border-neutral-850">
                        <tr>
                          <th className="px-6 py-3">Article Title</th>
                          <th className="px-6 py-3">Category</th>
                          <th className="px-6 py-3">Views count</th>
                          <th className="px-6 py-3">Publish Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-850/40 text-neutral-350">
                        {articles.slice(0, 5).sort((a, b) => b.views - a.views).map(art => (
                          <tr key={art.id} className="hover:bg-neutral-850/20 transition-colors">
                            <td className="px-6 py-3 font-semibold text-neutral-200">{art.title}</td>
                            <td className="px-6 py-3 font-semibold text-neutral-455 capitalize">{art.category}</td>
                            <td className="px-6 py-3 font-mono font-bold text-red-500">{art.views.toLocaleString()}</td>
                            <td className="px-6 py-3 text-neutral-500">{art.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </motion.div>
            )}

            {/* 9. SETTINGS MODULE */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl"
              >
                <form onSubmit={handleSettingsSave} className="space-y-6">
                  
                  {/* General settings card */}
                  <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-5 space-y-4 shadow">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5"><FiSettings className="text-red-500" /> General Settings</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-450">Website Name</label>
                        <input
                          type="text"
                          required
                          value={setWebName}
                          onChange={(e) => setSetWebName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl outline-none focus:border-red-650 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-455">Contact Email</label>
                        <input
                          type="email"
                          required
                          value={setEmail}
                          onChange={(e) => setSetEmail(e.target.value)}
                          className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl outline-none focus:border-red-650 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-455">Phone Number</label>
                        <input
                          type="text"
                          required
                          value={setPhone}
                          onChange={(e) => setSetPhone(e.target.value)}
                          className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl outline-none focus:border-red-650 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-455">Logo Url</label>
                        <input
                          type="text"
                          required
                          value={setLogo}
                          onChange={(e) => setSetLogo(e.target.value)}
                          className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl outline-none focus:border-red-650 text-white font-mono"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[11px] font-bold text-neutral-455">Favicon Url</label>
                        <input
                          type="text"
                          required
                          value={setFavicon}
                          onChange={(e) => setSetFavicon(e.target.value)}
                          className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl outline-none focus:border-red-650 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social media settings card */}
                  <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-5 space-y-4 shadow">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5"><FiShare2 className="text-red-500" /> Social Media Links</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-455">Facebook Link</label>
                        <input
                          type="text"
                          value={setFacebook}
                          onChange={(e) => setSetFacebook(e.target.value)}
                          className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl outline-none focus:border-red-650 text-white font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-455">Instagram Link</label>
                        <input
                          type="text"
                          value={setInstagram}
                          onChange={(e) => setSetInstagram(e.target.value)}
                          className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl outline-none focus:border-red-650 text-white font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-455">YouTube Link</label>
                        <input
                          type="text"
                          value={setYoutube}
                          onChange={(e) => setSetYoutube(e.target.value)}
                          className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl outline-none focus:border-red-650 text-white font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-455">Twitter (X) Link</label>
                        <input
                          type="text"
                          value={setTwitter}
                          onChange={(e) => setSetTwitter(e.target.value)}
                          className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl outline-none focus:border-red-650 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SEO settings card */}
                  <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-5 space-y-4 shadow">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5"><FiGlobe className="text-red-500" /> SEO Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-455">Meta Title</label>
                        <input
                          type="text"
                          required
                          value={setMetaTitle}
                          onChange={(e) => setSetMetaTitle(e.target.value)}
                          className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl outline-none focus:border-red-650 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-455">Meta Keywords</label>
                        <input
                          type="text"
                          required
                          value={setKeywords}
                          onChange={(e) => setSetKeywords(e.target.value)}
                          className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl outline-none focus:border-red-650 text-white"
                          placeholder="keyword1, keyword2..."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-455">Meta Description</label>
                        <textarea
                          required
                          rows="3"
                          value={setMetaDesc}
                          onChange={(e) => setSetMetaDesc(e.target.value)}
                          className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl outline-none focus:border-red-650 text-white resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Billboard Ad Settings card */}
                  <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-5 space-y-4 shadow">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 font-sans">Homepage Billboard Ad Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-455">Ad Banner Image URL</label>
                        <input
                          type="text"
                          required
                          value={setBillboardImage}
                          onChange={(e) => setSetBillboardImage(e.target.value)}
                          className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl outline-none focus:border-red-650 text-white"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-455">Ad Redirect Destination URL</label>
                        <input
                          type="text"
                          required
                          value={setBillboardLink}
                          onChange={(e) => setSetBillboardLink(e.target.value)}
                          className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl outline-none focus:border-red-650 text-white"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Theme settings card */}
                  <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-5 space-y-4 shadow">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">Theme Settings</h3>
                    <div className="flex items-center gap-4">
                      {['Dark', 'Light'].map(mode => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setSetThemeMode(mode)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer border transition-colors ${setThemeMode === mode ? 'bg-red-600 border-red-600 text-white' : 'bg-neutral-950 border-neutral-850 text-neutral-400'}`}
                        >
                          {mode === 'Dark' ? <FiMoon /> : <FiSun />}
                          <span>{mode} Mode</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Save & Reset buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleSettingsReset}
                      className="px-6 py-3 border border-neutral-800 text-neutral-400 hover:bg-neutral-850 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>

                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* -------------------------------------------------------------
          MODALS & OVERLAYS PORTALS
      ------------------------------------------------------------- */}

      {/* LOGOUT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-500/25 text-red-500 flex items-center justify-center text-xl mx-auto">
                <FiAlertCircle />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white">నిష్క్రమించాలనుకుంటున్నారా?</h3>
                <p className="text-xs text-neutral-450">Are you sure you want to log out of the admin panel?</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="py-2.5 border border-neutral-800 text-neutral-450 hover:bg-neutral-850 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ARTICLE EDITOR MODAL */}
      <AnimatePresence>
        {isArticleModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 space-y-4 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
                <h3 className="text-base font-extrabold text-white">
                  {editingArticle ? 'కథనాన్ని సవరించు (Edit Article)' : 'కథనాన్ని జోడించు (Create Article)'}
                </h3>
                <button onClick={() => setIsArticleModalOpen(false)} className="text-neutral-450 hover:text-white cursor-pointer">
                  <FiX className="text-lg" />
                </button>
              </div>

              <form onSubmit={handleArticleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-450">Title (శీర్షిక)</label>
                  <input
                    type="text"
                    required
                    value={artTitle}
                    onChange={(e) => setArtTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl outline-none focus:border-red-650 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-455">Category</label>
                    <select
                      value={artCategory}
                      onChange={(e) => setArtCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl outline-none focus:border-red-650 text-xs text-white cursor-pointer"
                    >
                      {categories.map(c => <option key={c.id} value={c.key}>{c.nameEnglish}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-455">Author</label>
                    <input
                      type="text"
                      required
                      value={artAuthor}
                      onChange={(e) => setArtAuthor(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl outline-none focus:border-red-650 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-neutral-455">Image Link</label>
                    <input
                      type="text"
                      required
                      value={artImage}
                      onChange={(e) => setArtImage(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl outline-none focus:border-red-650 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-neutral-455">Short Description</label>
                    <textarea
                      required
                      rows="2"
                      value={artDesc}
                      onChange={(e) => setArtDesc(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl outline-none focus:border-red-650 text-xs text-white resize-none"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-neutral-455">Content paragraphs (Separate with blank line)</label>
                    <textarea
                      required
                      rows="5"
                      value={artContent}
                      onChange={(e) => setArtContent(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl outline-none focus:border-red-650 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-455">Status</label>
                    <div className="flex gap-4 pt-1">
                      {['Published', 'Draft'].map(status => (
                        <label key={status} className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer">
                          <input type="radio" name="modalArtStatus" value={status} checked={artStatus === status} onChange={(e) => setArtStatus(e.target.value)} className="text-red-600 focus:ring-0 border-neutral-800 bg-neutral-950" />
                          <span>{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-850">
                  <button type="button" onClick={() => setIsArticleModalOpen(false)} className="px-4 py-2 border border-neutral-850 text-neutral-400 hover:bg-neutral-850 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer">Submit</button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CATEGORY EDITOR MODAL */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
                <h3 className="text-base font-extrabold text-white">
                  {editingCategory ? 'విభాగాన్ని సవరించు' : 'విభాగాన్ని జోడించు'}
                </h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="text-neutral-450 hover:text-white cursor-pointer">
                  <FiX className="text-lg" />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-455">Telugu Label</label>
                  <input type="text" required value={catTelugu} onChange={(e) => setCatTelugu(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl text-white outline-none focus:border-red-650" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-455">English Label</label>
                  <input type="text" required value={catEnglish} onChange={(e) => setCatEnglish(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl text-white outline-none focus:border-red-650 font-sans" />
                </div>
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-850">
                  <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:bg-neutral-850 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer">Submit</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POPUP AD EDITOR MODAL */}
      <AnimatePresence>
        {isAdModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
                <h3 className="text-base font-extrabold text-white">
                  {editingAd ? 'జాహిరాతు సవరించు (Edit Popup Ad)' : 'జాహిరాతు సృష్టించు (Create Popup Ad)'}
                </h3>
                <button onClick={() => setIsAdModalOpen(false)} className="text-neutral-450 hover:text-white cursor-pointer">
                  <FiX className="text-lg" />
                </button>
              </div>

              <form onSubmit={handleAdSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-455">Title</label>
                  <input type="text" required value={adTitle} onChange={(e) => setAdTitle(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl text-white outline-none focus:border-red-650" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-455">Image Url</label>
                  <input type="text" required value={adImage} onChange={(e) => setAdImage(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl text-white outline-none focus:border-red-650 font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-455">Redirect URL</label>
                  <input type="text" required value={adRedirect} onChange={(e) => setAdRedirect(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl text-white outline-none focus:border-red-650 font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-455">Start Date</label>
                    <input type="date" required value={adStart} onChange={(e) => setAdStart(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl text-white outline-none focus:border-red-650" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-455">End Date</label>
                    <input type="date" required value={adEnd} onChange={(e) => setAdEnd(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl text-white outline-none focus:border-red-650" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-455">Status</label>
                  <div className="flex gap-4 pt-1">
                    {['Active', 'Inactive'].map(status => (
                      <label key={status} className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer">
                        <input type="radio" name="modalAdStatus" value={status} checked={adStatus === status} onChange={(e) => setAdStatus(e.target.value)} className="text-red-600 focus:ring-0 border-neutral-800 bg-neutral-950" />
                        <span>{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-850">
                  <button type="button" onClick={() => setIsAdModalOpen(false)} className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:bg-neutral-850 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer">Submit</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BREAKING NEWS EDITOR MODAL */}
      <AnimatePresence>
        {isBnModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
                <h3 className="text-base font-extrabold text-white">
                  {editingBn ? 'ప్రకటన సవరించు (Edit Ticker)' : 'ప్రకటన జోడించు (Add Ticker)'}
                </h3>
                <button onClick={() => setIsBnModalOpen(false)} className="text-neutral-455 hover:text-white cursor-pointer">
                  <FiX className="text-lg" />
                </button>
              </div>

              <form onSubmit={handleBnSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-455">Title</label>
                  <textarea required rows="3" value={bnTitle} onChange={(e) => setBnTitle(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl text-white outline-none focus:border-red-650 resize-none" placeholder="రాష్ట్ర ముఖ్యమంత్రి కీలక ప్రకటన..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-455">Priority</label>
                    <select value={bnPriority} onChange={(e) => setBnPriority(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl text-white outline-none focus:border-red-650 cursor-pointer">
                      {['High', 'Medium', 'Low'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-455">Publish Date</label>
                    <input type="date" required value={bnPublishDate} onChange={(e) => setBnPublishDate(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl text-white outline-none focus:border-red-650" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-455">Status</label>
                  <div className="flex gap-4 pt-1">
                    {['Active', 'Inactive'].map(status => (
                      <label key={status} className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer">
                        <input type="radio" name="modalBnStatus" value={status} checked={bnStatus === status} onChange={(e) => setBnStatus(e.target.value)} className="text-red-600 focus:ring-0 border-neutral-800 bg-neutral-950" />
                        <span>{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-850">
                  <button type="button" onClick={() => setIsBnModalOpen(false)} className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:bg-neutral-850 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer">Submit</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHOTO UPLOADER MODAL */}
      <AnimatePresence>
        {isPhotoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
                <h3 className="text-base font-extrabold text-white">ఫొటో అప్‌లోడ్ (Upload Photo)</h3>
                <button onClick={() => setIsPhotoModalOpen(false)} className="text-neutral-450 hover:text-white cursor-pointer">
                  <FiX className="text-lg" />
                </button>
              </div>

              <form onSubmit={handlePhotoSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-455">Photo Title</label>
                  <input type="text" required value={phTitle} onChange={(e) => setPhTitle(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl text-white outline-none focus:border-red-650" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-455">Category</label>
                  <input type="text" required value={phCategory} onChange={(e) => setPhCategory(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl text-white outline-none focus:border-red-650" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-455">Image URL</label>
                  <input type="text" required value={phImage} onChange={(e) => setPhImage(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl text-white outline-none focus:border-red-650 font-mono" />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-850">
                  <button type="button" onClick={() => setIsPhotoModalOpen(false)} className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:bg-neutral-850 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer">Upload</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIDEO UPLOADER MODAL */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
                <h3 className="text-base font-extrabold text-white">వీడియో అప్‌లోడ్ (Upload Video)</h3>
                <button onClick={() => setIsVideoModalOpen(false)} className="text-neutral-450 hover:text-white cursor-pointer">
                  <FiX className="text-lg" />
                </button>
              </div>

              <form onSubmit={handleVideoSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-455">Video Title</label>
                  <input type="text" required value={vdTitle} onChange={(e) => setVdTitle(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl text-white outline-none focus:border-red-650" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-455">Category</label>
                  <input type="text" required value={vdCategory} onChange={(e) => setVdCategory(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl text-white outline-none focus:border-red-650" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-455">Thumbnail URL</label>
                  <input type="text" required value={vdThumbnail} onChange={(e) => setVdThumbnail(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl text-white outline-none focus:border-red-650 font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-455">Video / YouTube Link URL</label>
                  <input type="text" required value={vdUrl} onChange={(e) => setVdUrl(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs rounded-xl text-white outline-none focus:border-red-650 font-mono" />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-850">
                  <button type="button" onClick={() => setIsVideoModalOpen(false)} className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:bg-neutral-850 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer">Upload</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;
