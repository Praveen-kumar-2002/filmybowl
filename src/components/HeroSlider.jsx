import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { FiClock, FiEye, FiArrowRight } from 'react-icons/fi';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const HeroSlider = ({ articles = [] }) => {
  const featuredArticles = articles.filter(a => a.featured).slice(0, 5);

  if (featuredArticles.length === 0) return null;

  return (
    <div className="w-full relative rounded-2xl overflow-hidden shadow-xl border border-neutral-100 dark:border-neutral-900">
      <Swiper
        spaceBetween={0}
        effect={'fade'}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="hero-swiper h-[400px] md:h-[550px] w-full"
      >
        {featuredArticles.map((article) => {
          const formattedDate = new Date(article.date).toLocaleDateString('te-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          return (
            <SwiperSlide key={article.id} className="relative w-full h-full">
              {/* Slide Background Image */}
              <div className="absolute inset-0 bg-neutral-950">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover opacity-85 dark:opacity-75"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>

              {/* Slide Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white flex flex-col justify-end z-10 max-w-4xl">
                {/* Category Badge */}
                <div className="mb-3">
                  <Link
                    to={`/category/${article.category}`}
                    className="bg-red-600 hover:bg-red-700 text-white text-[11px] md:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-lg transition-colors inline-block"
                  >
                    {article.categoryTelugu}
                  </Link>
                </div>

                {/* Title */}
                <Link to={`/news/${article.id}`}>
                  <h2 className="text-xl md:text-4xl font-extrabold tracking-tight leading-tight hover:text-red-400 transition-colors duration-200 line-clamp-2 md:line-clamp-3 mb-4">
                    {article.title}
                  </h2>
                </Link>

                {/* Description - hidden on small mobile */}
                <p className="hidden md:block text-neutral-250 text-sm md:text-base leading-relaxed line-clamp-2 mb-6 opacity-90">
                  {article.description}
                </p>

                {/* Metadata & CTA */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
                  <div className="flex items-center gap-4 text-xs text-neutral-350">
                    <span className="flex items-center gap-1">
                      <FiClock /> {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiEye /> {article.views.toLocaleString()} వీక్షణలు
                    </span>
                    <span className="hidden sm:inline-block">•</span>
                    <span className="hidden sm:inline-block">రచయిత: {article.author}</span>
                  </div>

                  <Link
                    to={`/news/${article.id}`}
                    className="inline-flex items-center gap-2 bg-white text-neutral-950 font-bold hover:bg-red-600 hover:text-white px-5 py-2.5 rounded-lg text-xs md:text-sm shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <span>చదవండి</span>
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
