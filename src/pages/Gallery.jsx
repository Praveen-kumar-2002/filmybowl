import React, { useState, useEffect } from 'react';
import { galleryArticles } from '../data/newsData';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiChevronRight, FiX, FiChevronLeft, FiImage } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Gallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [selectedGallery, setSelectedGallery] = useState([]);

  // Flatten all gallery pictures into a single array of items with parent title info
  const allGalleryItems = galleryArticles.reduce((acc, article) => {
    if (article.gallery && article.gallery.length > 0) {
      article.gallery.forEach((imgUrl, idx) => {
        acc.push({
          id: `${article.id}-${idx}`,
          src: imgUrl,
          title: article.title,
          category: article.categoryTelugu,
          parentArticleId: article.id
        });
      });
    }
    return acc;
  }, []);

  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextSlide = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % allGalleryItems.length);
    }
  };

  const prevSlide = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + allGalleryItems.length) % allGalleryItems.length);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-450 font-medium py-1">
        <Link to="/" className="hover:text-red-600 flex items-center gap-1">
          <FiHome />
          <span>హోమ్</span>
        </Link>
        <FiChevronRight className="text-neutral-400" />
        <span className="text-neutral-900 dark:text-neutral-200 font-bold">చిత్ర మాలిక (Gallery)</span>
      </nav>

      {/* Page Title */}
      <div className="border-b border-neutral-250 dark:border-neutral-850 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-7 bg-red-650 rounded-full"></span>
          <h1 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
            <FiImage className="text-red-600 text-2xl md:text-3xl" />
            <span>చిత్ర మాలిక (Photo Gallery)</span>
          </h1>
        </div>
        <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          రాజకీయ, చలనచిత్ర, క్రీడా ప్రముఖుల తాజా ఫోటో షూట్స్ మరియు పండుగ వేడుకలు
        </p>
      </div>

      {/* Masonry-like Responsive Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {allGalleryItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.3 }}
            onClick={() => openLightbox(index)}
            className="break-inside-avoid relative rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer border border-neutral-100 dark:border-neutral-900 group bg-neutral-100 dark:bg-neutral-900"
          >
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-auto object-cover transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Overlay Info on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
              <span className="text-[10px] bg-red-600 font-extrabold uppercase tracking-wider px-2 py-0.5 rounded w-fit mb-2">
                {item.category}
              </span>
              <p className="text-xs md:text-sm font-bold line-clamp-2 leading-snug">
                {item.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 select-none backdrop-blur-sm"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-red-500 p-2 text-2xl"
              aria-label="Close Lightbox"
            >
              <FiX />
            </button>

            {/* Left navigation arrow */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-red-500 p-3 text-3xl bg-white/5 rounded-full hover:bg-white/10"
              aria-label="Previous Slide"
            >
              <FiChevronLeft />
            </button>

            {/* Slide display */}
            <div className="max-w-4xl max-h-[80vh] flex flex-col items-center justify-center gap-4 text-white px-8">
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={allGalleryItems[lightboxIndex].src}
                alt={allGalleryItems[lightboxIndex].title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl border border-white/5"
              />

              <div className="text-center space-y-1">
                <span className="text-[10px] bg-red-600 font-black px-2 py-0.5 rounded uppercase">
                  {allGalleryItems[lightboxIndex].category}
                </span>
                <p className="text-xs md:text-base font-bold line-clamp-2">
                  {allGalleryItems[lightboxIndex].title}
                </p>
                <Link
                  to={`/news/${allGalleryItems[lightboxIndex].parentArticleId}`}
                  onClick={closeLightbox}
                  className="inline-block text-xs font-bold text-red-500 hover:text-red-400 underline mt-1"
                >
                  పూర్తి వార్త కథనం చదవండి
                </Link>
              </div>
            </div>

            {/* Right navigation arrow */}
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-red-500 p-3 text-3xl bg-white/5 rounded-full hover:bg-white/10"
              aria-label="Next Slide"
            >
              <FiChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Gallery;
