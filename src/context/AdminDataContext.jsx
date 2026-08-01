import React, { createContext, useContext, useState, useEffect } from 'react';
import { newsArticles } from '../data/newsData';

const AdminDataContext = createContext();
const API_BASE = 'https://filmybowl-production.up.railway.app/api';

export const useAdminData = () => useContext(AdminDataContext);

export const AdminDataProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(false);

  // 1. Articles State
  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('filmybowl_articles');
    return saved ? JSON.parse(saved) : newsArticles;
  });

  // 2. Categories State
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('filmybowl_categories');
    return saved ? JSON.parse(saved) : [
      { id: 'cat-1', key: 'politics', nameTelugu: 'రాజకీయాలు', nameEnglish: 'Politics' },
      { id: 'cat-2', key: 'movies', nameTelugu: 'సినిమాలు', nameEnglish: 'Movies' },
      { id: 'cat-3', key: 'sports', nameTelugu: 'క్రీడలు', nameEnglish: 'Sports' },
      { id: 'cat-4', key: 'business', nameTelugu: 'వ్యాపారం', nameEnglish: 'Business' },
      { id: 'cat-5', key: 'technology', nameTelugu: 'సాంకేతిక సమాచారం', nameEnglish: 'Technology' }
    ];
  });

  // 3. Comments State
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem('filmybowl_comments');
    return saved ? JSON.parse(saved) : [
      { id: 'com-1', articleId: 'pol-1', articleTitle: 'ఏపీ అసెంబ్లీ బడ్జెట్ సమావేశాలు...', name: 'రమేష్ కుమార్', text: 'చాలా మంచి వార్త. బడ్జెట్ ప్రజారంజకంగా ఉండాలని కోరుకుంటున్నాం.', date: '2026-07-08' },
      { id: 'com-2', articleId: 'mov-1', articleTitle: 'సరిపోదా శనివారం రివ్యూ', name: 'శ్రీను రాజు', text: 'సినిమా చాలా బాగుంది. నాని నటన అద్భుతం.', date: '2026-07-08' },
      { id: 'com-3', articleId: 'spo-1', articleTitle: 'ధోనీ రిటైర్మెంట్ నిర్ణయం', name: 'ధోని ఫ్యాన్', text: 'మా లెజెండ్ ఎప్పటికీ మా గుండెల్లోనే ఉంటారు.', date: '2026-07-07' },
      { id: 'com-4', articleId: 'mov-2', articleTitle: 'దేవర సినిమా అప్‌డేట్స్', name: 'తారక్ ఆర్మీ', text: 'దేవర అప్డేట్ కోసం వెయిటింగ్.. సినిమా బ్లాక్ బస్టర్ అవుతుంది!', date: '2026-07-06' },
      { id: 'com-5', articleId: 'tech-1', articleTitle: '5G విప్లవం భారతదేశంలో', name: 'టెక్ గీక్', text: 'స్పీడ్ చాలా బాగుంది కానీ ప్లాన్స్ ధరలు పెరగకూడదు.', date: '2026-07-05' }
    ];
  });

  // 4. Popup Ads State
  const [popupAds, setPopupAds] = useState(() => {
    const saved = localStorage.getItem('filmybowl_popup_ads');
    return saved ? JSON.parse(saved) : [
      { id: 'ad-1', title: 'Gaming Championship 2026', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80', redirectUrl: 'https://images.unsplash.com', status: 'Active', startDate: '2026-07-01', endDate: '2026-08-01' },
      { id: 'ad-2', title: 'New Movie Release Promo', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80', redirectUrl: 'https://images.unsplash.com', status: 'Inactive', startDate: '2026-07-15', endDate: '2026-07-30' }
    ];
  });

  // 5. Breaking News State
  const [breakingNews, setBreakingNews] = useState(() => {
    const saved = localStorage.getItem('filmybowl_breaking_news');
    return saved ? JSON.parse(saved) : [
      { id: 'bn-1', title: 'బ్రేకింగ్: ఏపీ అసెంబ్లీ బడ్జెట్ సమావేశాలు ముగింపు!', priority: 'High', status: 'Active', publishDate: '2026-07-08' },
      { id: 'bn-2', title: 'ధోనీ ఐపీఎల్ 2026 ఆడే విషయంపై సంచలన ప్రకటన!', priority: 'Medium', status: 'Active', publishDate: '2026-07-08' },
      { id: 'bn-3', title: 'విడుదలకు సిద్ధమైన పాన్ ఇండియా మూవీ ట్రైలర్ రిలీజ్ డేట్ ఖరారు!', priority: 'High', status: 'Inactive', publishDate: '2026-07-07' }
    ];
  });

  // 6. Photos State
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('filmybowl_photos');
    return saved ? JSON.parse(saved) : [
      { id: 'ph-1', title: 'NTR దేవర షూటింగ్ సెట్ స్పెషల్ పిక్స్', category: 'Movies', image: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&w=150&q=80' },
      { id: 'ph-2', title: 'రామ్ చరణ్ గేమ్ ఛేంజర్ ప్రెస్ మీట్ క్యూట్ గ్యాలరీ', category: 'Movies', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
      { id: 'ph-3', title: 'ధోనీ సరికొత్త హెయిర్ స్టైల్ ఫొటోలు వైరుల్', category: 'Sports', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }
    ];
  });

  // 7. Videos State
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('filmybowl_videos');
    return saved ? JSON.parse(saved) : [
      { id: 'vd-1', title: 'దేవర అఫీషియల్ ట్రైలర్ లాంచ్ ప్రెస్ మీట్ వీడియో', category: 'Movies', thumbnail: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { id: 'vd-2', title: '5G నెట్‌వర్క్ స్పీడ్ టెస్టింగ్ & లైవ్ డెమో రిపోర్ట్', category: 'Technology', thumbnail: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
    ];
  });

  // 8. Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('filmybowl_settings');
    const defaultSettings = {
      websiteName: 'Filmybowl',
      logoUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=150&q=80',
      faviconUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=32&q=80',
      contactEmail: 'support@filmybowl.com',
      phoneNumber: '+91 98765 43210',
      facebookUrl: 'https://facebook.com/filmybowl',
      instagramUrl: 'https://instagram.com/filmybowl',
      youtubeUrl: 'https://youtube.com/filmybowl',
      twitterUrl: 'https://twitter.com/filmybowl',
      metaTitle: 'Filmybowl - తాజా టాలీవుడ్ సినిమా వార్తలు, రివ్యూలు',
      metaDescription: 'ఫిల్మీబౌల్ న్యూస్ పోర్టల్ మీకు నిష్పక్షపాతంగా, వేగంగా మరియు కచ్చితమైన టాలీవుడ్ సినిమా వార్తలను, రివ్యూలను మరియు బాక్సాఫీస్ అప్‌డేట్స్‌ను అందిస్తుంది.',
      keywords: 'Filmybowl, Telugu Cinema, Tollywood, Movie Reviews, Gossips, Box Office',
      theme: 'Dark'
    };
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // Helper auth headers
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('filmybowl_admin_auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // INITIAL DATABASE SYNC ON LOAD
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [arts, cats, coms, ads, news, phs, vds, sets] = await Promise.all([
          fetch(`${API_BASE}/articles`).then(res => res.json()),
          fetch(`${API_BASE}/categories`).then(res => res.json()),
          fetch(`${API_BASE}/comments`).then(res => res.json()),
          fetch(`${API_BASE}/popup-ads`).then(res => res.json()),
          fetch(`${API_BASE}/breaking-news`).then(res => res.json()),
          fetch(`${API_BASE}/photos`).then(res => res.json()),
          fetch(`${API_BASE}/videos`).then(res => res.json()),
          fetch(`${API_BASE}/settings`).then(res => res.json())
        ]);
        
        setArticles(arts);
        setCategories(cats);
        setComments(coms);
        setPopupAds(ads);
        setBreakingNews(news);
        setPhotos(phs);
        setVideos(vds);
        setSettings(sets);
        setIsOnline(true);
        console.log('Connected to Filmybowl local backend API.');
      } catch (err) {
        console.warn('Backend server offline. Running in Local Mock Storage mode.', err);
        setIsOnline(false);
      }
    };
    fetchAllData();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('filmybowl_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('filmybowl_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('filmybowl_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('filmybowl_popup_ads', JSON.stringify(popupAds));
  }, [popupAds]);

  useEffect(() => {
    localStorage.setItem('filmybowl_breaking_news', JSON.stringify(breakingNews));
  }, [breakingNews]);

  useEffect(() => {
    localStorage.setItem('filmybowl_photos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('filmybowl_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('filmybowl_settings', JSON.stringify(settings));
  }, [settings]);

  // ARTICLES OPERATIONS
  const addArticle = async (article) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/articles`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(article)
        });
        if (response.ok) {
          const newArticle = await response.json();
          setArticles(prev => [newArticle, ...prev]);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    const newArticle = {
      ...article,
      id: `art-${Date.now()}`,
      views: 0,
      date: new Date().toISOString().split('T')[0]
    };
    setArticles((prev) => [newArticle, ...prev]);
  };

  const editArticle = async (id, updatedFields) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/articles/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(updatedFields)
        });
        if (response.ok) {
          const updated = await response.json();
          setArticles(prev => prev.map(art => art.id === id ? updated : art));
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    setArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, ...updatedFields } : art))
    );
  };

  const deleteArticle = async (id) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/articles/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (response.ok) {
          setArticles(prev => prev.filter(art => art.id !== id));
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    setArticles((prev) => prev.filter((art) => art.id !== id));
  };

  // CATEGORIES OPERATIONS
  const addCategory = async (category) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/categories`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(category)
        });
        if (response.ok) {
          const newCategory = await response.json();
          setCategories(prev => [...prev, newCategory]);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    const newCategory = {
      ...category,
      id: `cat-${Date.now()}`,
      key: category.nameEnglish.toLowerCase().replace(/\s+/g, '-')
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const editCategory = async (id, updatedFields) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/categories/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(updatedFields)
        });
        if (response.ok) {
          const updated = await response.json();
          setCategories(prev => prev.map(cat => cat.id === id ? updated : cat));
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updatedFields, key: (updatedFields.nameEnglish || cat.nameEnglish).toLowerCase().replace(/\s+/g, '-') } : cat))
    );
  };

  const deleteCategory = async (id) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/categories/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (response.ok) {
          setCategories(prev => prev.filter(cat => cat.id !== id));
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  // COMMENTS OPERATIONS
  const deleteComment = async (id) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/comments/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (response.ok) {
          setComments(prev => prev.filter(com => com.id !== id));
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    setComments((prev) => prev.filter((com) => com.id !== id));
  };

  const addComment = async (comment) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(comment)
        });
        if (response.ok) {
          const newComment = await response.json();
          setComments(prev => [newComment, ...prev]);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    const newComment = {
      ...comment,
      id: `com-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setComments((prev) => [newComment, ...prev]);
  };

  // POPUP ADS OPERATIONS
  const addPopupAd = async (ad) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/popup-ads`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(ad)
        });
        if (response.ok) {
          const newAd = await response.json();
          setPopupAds(prev => [newAd, ...prev]);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    const newAd = { ...ad, id: `ad-${Date.now()}` };
    setPopupAds((prev) => [newAd, ...prev]);
  };

  const editPopupAd = async (id, updatedFields) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/popup-ads/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(updatedFields)
        });
        if (response.ok) {
          const updated = await response.json();
          setPopupAds(prev => prev.map(ad => ad.id === id ? updated : ad));
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    setPopupAds((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, ...updatedFields } : ad))
    );
  };

  const deletePopupAd = async (id) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/popup-ads/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (response.ok) {
          setPopupAds(prev => prev.filter(ad => ad.id !== id));
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    setPopupAds((prev) => prev.filter((ad) => ad.id !== id));
  };

  // BREAKING NEWS OPERATIONS
  const addBreakingNews = async (news) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/breaking-news`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(news)
        });
        if (response.ok) {
          const newNews = await response.json();
          setBreakingNews(prev => [newNews, ...prev]);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    const newNews = { ...news, id: `bn-${Date.now()}` };
    setBreakingNews((prev) => [newNews, ...prev]);
  };

  const editBreakingNews = async (id, updatedFields) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/breaking-news/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(updatedFields)
        });
        if (response.ok) {
          const updated = await response.json();
          setBreakingNews(prev => prev.map(n => n.id === id ? updated : n));
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    setBreakingNews((prev) =>
      prev.map((news) => (news.id === id ? { ...news, ...updatedFields } : news))
    );
  };

  const deleteBreakingNews = async (id) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/breaking-news/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (response.ok) {
          setBreakingNews(prev => prev.filter(n => n.id !== id));
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    setBreakingNews((prev) => prev.filter((news) => news.id !== id));
  };

  // PHOTOS OPERATIONS
  const addPhoto = async (photo) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/photos`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(photo)
        });
        if (response.ok) {
          const newPhoto = await response.json();
          setPhotos(prev => [newPhoto, ...prev]);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    const newPhoto = { ...photo, id: `ph-${Date.now()}` };
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  const deletePhoto = async (id) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/photos/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (response.ok) {
          setPhotos(prev => prev.filter(ph => ph.id !== id));
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    setPhotos((prev) => prev.filter((ph) => ph.id !== id));
  };

  // VIDEOS OPERATIONS
  const addVideo = async (video) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/videos`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(video)
        });
        if (response.ok) {
          const newVideo = await response.json();
          setVideos(prev => [newVideo, ...prev]);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    const newVideo = { ...video, id: `vd-${Date.now()}` };
    setVideos((prev) => [newVideo, ...prev]);
  };

  const deleteVideo = async (id) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/videos/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (response.ok) {
          setVideos(prev => prev.filter(vd => vd.id !== id));
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    setVideos((prev) => prev.filter((vd) => vd.id !== id));
  };

  // SETTINGS OPERATIONS
  const updateSettings = async (updatedFields) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/settings`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(updatedFields)
        });
        if (response.ok) {
          const updated = await response.json();
          setSettings(updated);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    setSettings((prev) => ({ ...prev, ...updatedFields }));
  };

  const resetSettings = async () => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/admin/settings/reset`, {
          method: 'POST',
          headers: getAuthHeaders()
        });
        if (response.ok) {
          const updated = await response.json();
          setSettings(updated);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Local fallback
    const defaultSettings = {
      websiteName: 'Filmybowl',
      logoUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=150&q=80',
      faviconUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=32&q=80',
      contactEmail: 'support@filmybowl.com',
      phoneNumber: '+91 98765 43210',
      facebookUrl: 'https://facebook.com/filmybowl',
      instagramUrl: 'https://instagram.com/filmybowl',
      youtubeUrl: 'https://youtube.com/filmybowl',
      twitterUrl: 'https://twitter.com/filmybowl',
      metaTitle: 'Filmybowl - తాజా టాలీవుడ్ సినిమా వార్తలు, రివ్యూలు',
      metaDescription: 'ఫిల్మీబౌల్ న్యూస్ పోర్టల్ మీకు నిష్పక్షపాతంగా, వేగంగా మరియు కచ్చితమైన టాలీవుడ్ సినిమా వార్తలను, రివ్యూలను మరియు బాక్సాఫీస్ అప్‌డేట్స్‌ను అందిస్తుంది.',
      keywords: 'Filmybowl, Telugu Cinema, Tollywood, Movie Reviews, Gossips, Box Office',
      theme: 'Dark'
    };
    setSettings(defaultSettings);
  };

  return (
    <AdminDataContext.Provider
      value={{
        isOnline,
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
        addComment,
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
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};
