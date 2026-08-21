import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiYoutube, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiArrowUp 
} from 'react-icons/fi';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-900 pt-16 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block py-1">
              <img 
                src="/cineveduka-logo.png" 
                alt="Cineveduka Logo" 
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400">
              సినీవేడుక న్యూస్ పోర్టల్ మీకు నిష్పక్షపాతంగా, వేగంగా మరియు కచ్చితమైన టాలీవుడ్ సినిమా వార్తలను, రివ్యూలను మరియు బాక్సాఫీస్ అప్‌డేట్స్‌ను అందిస్తుంది.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3.5 pt-2">
              <a href="#" className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300 shadow-md text-lg cursor-pointer" aria-label="Facebook">
                <FiFacebook />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300 shadow-md text-lg cursor-pointer" aria-label="Twitter">
                <FiTwitter />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300 shadow-md text-lg cursor-pointer" aria-label="Instagram">
                <FiInstagram />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300 shadow-md text-lg cursor-pointer" aria-label="YouTube">
                <FiYoutube />
              </a>
            </div>
          </div>

          {/* Categories Links */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider relative before:absolute before:bottom-0 before:left-0 before:w-8 before:h-0.5 before:bg-red-600 pb-2">
              విభాగాలు
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li>
                <Link to="/category/film-news" className="hover:text-red-500 transition-colors duration-200 block py-1">ఫిల్మ్ న్యూస్</Link>
              </li>
              <li>
                <Link to="/category/news" className="hover:text-red-500 transition-colors duration-200 block py-1">వార్తలు</Link>
              </li>
              <li>
                <Link to="/category/reviews" className="hover:text-red-500 transition-colors duration-200 block py-1">రివ్యూలు</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-red-500 transition-colors duration-200 block py-1">గ్యాలరీ</Link>
              </li>
              <li>
                <Link to="/category/box-office-news" className="hover:text-red-500 transition-colors duration-200 block py-1">బాక్స్ ఆఫీస్ వార్తలు</Link>
              </li>
              <li>
                <Link to="/category/live-tracking" className="hover:text-red-500 transition-colors duration-200 block py-1">లైవ్ ట్రాకింగ్</Link>
              </li>
              <li>
                <Link to="/category/polls" className="hover:text-red-500 transition-colors duration-200 block py-1">పోల్స్</Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider relative before:absolute before:bottom-0 before:left-0 before:w-8 before:h-0.5 before:bg-red-600 pb-2">
              లింకులు
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-red-500 transition-colors duration-200 block py-1">హోమ్ పేజీ</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-red-500 transition-colors duration-200 block py-1">మమ్మల్ని సంప్రదించండి</Link>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors duration-200 block py-1">గోప్యతా విధానం (Privacy Policy)</a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors duration-200 block py-1">నిబంధనలు మరియు షరతులు</a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors duration-200 block py-1">ప్రకటనలు ఇవ్వండి</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider relative before:absolute before:bottom-0 before:left-0 before:w-8 before:h-0.5 before:bg-red-600 pb-2">
              సహాయం & మద్దతు
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <FiMapPin className="text-red-600 text-lg shrink-0 mt-0.5" />
                <span>ఐటీ హబ్, గచ్చిబౌలి, హైదరాబాద్, తెలంగాణ - 500032</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone className="text-red-600 text-lg shrink-0" />
                <span>+91 40 1234 5678</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="text-red-600 text-lg shrink-0" />
                <span>support@cineveduka.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-neutral-900 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-neutral-500 text-center md:text-left">
            &copy; {currentYear} Cineveduka. All rights reserved. Built with React & Tailwind CSS.
          </p>
          <div className="flex items-center gap-4 text-neutral-500">
            <a href="#" className="hover:underline">సభ్యత్వం</a>
            <span>&bull;</span>
            <a href="#" className="hover:underline">ఆర్కైవ్</a>
            <span>&bull;</span>
            <button 
              onClick={scrollToTop} 
              className="flex items-center gap-1 font-bold text-red-500 hover:text-red-400 transition-colors"
            >
              పైకి వెళ్ళండి <FiArrowUp className="animate-bounce" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
