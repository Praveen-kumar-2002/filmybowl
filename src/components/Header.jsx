import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiSearch, 
  FiSun, 
  FiMoon, 
  FiMenu, 
  FiX, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiYoutube,
  FiGlobe,
  FiClock
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAdminData } from '../context/AdminDataContext';
import { newsArticles } from '../data/newsData';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useAdminData();
  const [dateTime, setDateTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Dynamic Date & Time formatting in Telugu
  useEffect(() => {
    const updateDateTime = () => {
      const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      
      const localDate = new Date().toLocaleDateString('te-IN', dateOptions);
      const localTime = new Date().toLocaleTimeString('te-IN', timeOptions);
      
      setDateTime(`${localDate} | ${localTime}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Search Suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = newsArticles
        .filter(article => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // Click outside listener to close search suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const selectSuggestion = (id) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    navigate(`/news/${id}`);
  };

  const navItems = [
    { name: 'హోమ్', path: '/' },
    { name: 'ఫిల్మ్ న్యూస్', path: '/category/film-news' },
    { name: 'వార్తలు', path: '/category/news' },
    { name: 'రివ్యూలు', path: '/category/reviews' },
    { name: 'గ్యాలరీ', path: '/gallery' },
    { name: 'బాక్స్ ఆఫీస్ వార్తలు', path: '/category/box-office-news' },
    { name: 'లైవ్ ట్రాకింగ్', path: '/category/live-tracking' },
    { name: 'పోల్స్', path: '/category/polls' },
    { name: 'సంప్రదించండి', path: '/contact' }
  ];

  return (
    <header className="w-full bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-900 sticky top-0 z-40 shadow-sm transition-colors duration-300">
      
      {/* Top bar (Hidden on mobile) */}
      <div className="hidden md:block w-full bg-neutral-50 dark:bg-neutral-900 py-1.5 px-4 md:px-6 border-b border-neutral-100 dark:border-neutral-800 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-neutral-500 dark:text-neutral-400">
          {/* Time & Date */}
          <div className="flex items-center gap-2 font-medium">
            <FiClock className="text-red-600 animate-spin-slow" />
            <span>{dateTime}</span>
          </div>

          {/* Socials & Language toggle */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <a href="#" className="w-12 h-12 rounded-full bg-neutral-200/50 dark:bg-neutral-800 hover:bg-red-600 hover:text-white dark:hover:bg-red-655 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm text-xl border border-neutral-350/20 dark:border-neutral-750" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" className="w-12 h-12 rounded-full bg-neutral-200/50 dark:bg-neutral-800 hover:bg-red-600 hover:text-white dark:hover:bg-red-655 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm text-xl border border-neutral-350/20 dark:border-neutral-750" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" className="w-12 h-12 rounded-full bg-neutral-200/50 dark:bg-neutral-800 hover:bg-red-600 hover:text-white dark:hover:bg-red-655 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm text-xl border border-neutral-350/20 dark:border-neutral-750" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" className="w-12 h-12 rounded-full bg-neutral-200/50 dark:bg-neutral-800 hover:bg-red-600 hover:text-white dark:hover:bg-red-655 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm text-xl border border-neutral-350/20 dark:border-neutral-750" aria-label="YouTube"><FiYoutube /></a>
            </div>
            
            <div className="h-3 w-px bg-neutral-200 dark:bg-neutral-800"></div>

            {/* Language switch */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 cursor-pointer hover:text-red-655 select-none bg-transparent border-none outline-none text-xs font-bold text-neutral-500 dark:text-neutral-450 transition-colors"
            >
              <FiGlobe className="text-sm text-red-600" />
              <span>{language === 'te' ? 'English (ఇంగ్లీష్)' : 'తెలుగు (Telugu)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Toggle Hamburger button (Mobile) */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:text-red-600 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
        </button>

        {/* Logo */}
        <Link to="/" className="shrink-0 flex items-center">
          <span className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white tracking-wider flex items-center uppercase">
            FILMY<span className="text-red-600">BOWL</span>
          </span>
        </Link>

        {/* Search Bar Container */}
        <div ref={searchRef} className="relative flex-grow max-w-md hidden sm:block">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="వార్తల కోసం శోధించండి..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-4 pr-10 py-1.5 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-red-600 dark:focus:border-red-500 rounded-full text-neutral-900 dark:text-neutral-50 outline-none transition-all"
              />
              <button 
                type="submit" 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-600 transition-colors"
                aria-label="Search"
              >
                <FiSearch className="text-lg" />
              </button>
            </div>
          </form>

          {/* Suggestions Dropdown */}
          {isSearchFocused && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850 rounded-xl shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto">
              <div className="p-2 text-[10px] uppercase font-bold text-neutral-400 border-b border-neutral-50 dark:border-neutral-850">
                సూచించిన వార్తలు
              </div>
              {suggestions.map((art) => (
                <button
                  key={art.id}
                  onClick={() => selectSuggestion(art.id)}
                  className="w-full text-left px-4 py-2.5 text-xs md:text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 border-b border-neutral-50 dark:border-neutral-900/40 text-neutral-800 dark:text-neutral-200 line-clamp-1 last:border-none"
                >
                  {art.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Widgets (Theme, Language, etc.) */}
        <div className="flex items-center gap-1.5 md:gap-3">
          
          {/* Mobile Search Button toggle */}
          <Link
            to="/search"
            className="sm:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:text-red-600 transition-colors"
            aria-label="Search Page"
          >
            <FiSearch className="text-xl" />
          </Link>

          {/* Language Toggle (Mobile responsive) */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-250 dark:border-neutral-800 text-[10px] font-black text-neutral-600 dark:text-neutral-350 hover:text-red-655 cursor-pointer bg-neutral-100/60 dark:bg-neutral-900 transition-colors flex items-center gap-1 select-none"
            aria-label="Toggle Language"
          >
            <FiGlobe className="text-[11px] text-red-600" />
            <span>{language === 'te' ? 'EN' : 'తెలుగు'}</span>
          </button>

          {/* Theme switch button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:text-red-600 transition-all duration-300 cursor-pointer"
            aria-label="Toggle Theme Mode"
          >
            {theme === 'dark' ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black/60 z-40 backdrop-blur-sm animate-fade-in">
          <div className="w-4/5 max-w-sm h-full bg-white dark:bg-neutral-950 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto border-r border-neutral-100 dark:border-neutral-900">
            <div className="space-y-6">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                మెనూ విభాగాలు
              </div>
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-3 px-4 rounded-xl text-neutral-700 dark:text-neutral-250 font-bold hover:bg-red-500/10 hover:text-red-600 transition-all duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900 text-center text-xs text-neutral-400 space-y-4">
              <div className="flex items-center justify-center gap-3.5">
                <a href="#" className="w-12 h-12 rounded-full border border-neutral-250 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md text-xl" aria-label="Facebook">
                  <FiFacebook />
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-neutral-250 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md text-xl" aria-label="Twitter">
                  <FiTwitter />
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-neutral-250 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md text-xl" aria-label="Instagram">
                  <FiInstagram />
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-neutral-250 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md text-xl" aria-label="YouTube">
                  <FiYoutube />
                </a>
              </div>
              <p>&copy; {new Date().getFullYear()} Filmybowl</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
