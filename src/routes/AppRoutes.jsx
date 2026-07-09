import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import CategoryPage from '../pages/CategoryPage';
import NewsDetails from '../pages/NewsDetails';
import Gallery from '../pages/Gallery';
import Videos from '../pages/Videos';
import SearchPage from '../pages/SearchPage';
import Contact from '../pages/Contact';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:categoryName" element={<CategoryPage />} />
      <Route path="/news/:id" element={<NewsDetails />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/contact" element={<Contact />} />
      {/* Fallback route */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
