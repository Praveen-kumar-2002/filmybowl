import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
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
    <nav className="hidden md:block w-full bg-neutral-900 text-neutral-100 border-y border-neutral-800 sticky top-16 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <ul className="flex items-center gap-1.5 lg:gap-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    relative block px-4 py-3.5 text-sm font-bold tracking-wide uppercase transition-all duration-300 hover:text-red-500
                    after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-red-600 after:scale-x-0 after:transition-transform after:duration-300
                    ${isActive ? 'text-red-500 after:scale-x-100' : 'text-neutral-200'}
                  `}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Dynamic date & weather ticker placeholder */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            <span>లైవ్ అప్‌డేట్స్ అందుబాటులో ఉన్నాయి</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
