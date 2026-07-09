import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsArticles } from '../data/newsData';
import TrendingSidebar from '../components/TrendingSidebar';
import AdBanner from '../components/AdBanner';
import NewsCard from '../components/NewsCard';
import { 
  FiHome, 
  FiChevronRight, 
  FiClock, 
  FiEye, 
  FiUser, 
  FiFacebook, 
  FiTwitter, 
  FiSend,
  FiMessageSquare,
  FiShare2
} from 'react-icons/fi';

const NewsDetails = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [comments, setComments] = useState([
    { name: 'కిరణ్ ప్రసాద్', text: 'నిజంగా చాలా ఉపయోగకరమైన వార్త. ఇలాంటి సమాచారం మరిన్ని అందించాలని కోరుకుంటున్నాను.', date: '2026-07-07 14:30' },
    { name: 'లక్ష్మి దేవి', text: 'చాలా స్పష్టంగా విశ్లేషించారు. అభినందనలు!', date: '2026-07-07 16:15' }
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    // Find article by id or slug
    const foundArticle = newsArticles.find((a) => a.id === id || a.slug === id);
    if (foundArticle) {
      setArticle(foundArticle);
      
      // Filter related articles from same category, excluding current one
      const related = newsArticles
        .filter((a) => a.category === foundArticle.category && a.id !== foundArticle.id)
        .slice(0, 3);
      setRelatedArticles(related);
      
      // Increment views count dynamically for realism
      foundArticle.views += Math.floor(Math.random() * 5) + 1;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!article) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500 font-bold">వార్త లోడ్ అవుతోంది లేదా లభించలేదు...</p>
        <Link to="/" className="mt-4 inline-block px-5 py-2 bg-red-600 text-white rounded-lg">
          హోమ్ పేజీకి తిరిగి వెళ్ళండి
        </Link>
      </div>
    );
  }

  const { title, description, content, category, categoryTelugu, image, date, author, views } = article;

  const formattedDate = new Date(date).toLocaleDateString('te-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newCommentName.trim() && newCommentText.trim()) {
      const now = new Date();
      const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      setComments([
        ...comments,
        { name: newCommentName, text: newCommentText, date: formattedNow }
      ]);
      setNewCommentName('');
      setNewCommentText('');
    }
  };

  const handleShare = (platform) => {
    const shareUrl = window.location.href;
    const shareText = encodeURIComponent(`${title}\nRead more at: `);
    let url = '';

    if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`;
    } else if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${shareText}${encodeURIComponent(shareUrl)}`;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
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
        <Link to={`/category/${category}`} className="hover:text-red-650">
          {categoryTelugu}
        </Link>
        <FiChevronRight className="text-neutral-400" />
        <span className="text-neutral-900 dark:text-neutral-300 font-semibold truncate max-w-[200px] md:max-w-sm">
          {title}
        </span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Article Content */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-2xl p-5 md:p-8 shadow-sm space-y-6">
          
          {/* Article Header */}
          <div className="space-y-4">
            <Link
              to={`/category/${category}`}
              className="bg-red-600 text-white text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1 rounded shadow-sm inline-block hover:bg-red-700 transition-colors"
            >
              {categoryTelugu}
            </Link>
            
            <h1 className="text-xl md:text-3xl font-extrabold text-neutral-900 dark:text-white leading-tight">
              {title}
            </h1>

            {/* Metadata and Share buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-neutral-100 dark:border-neutral-800 py-3 text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1">
                  <FiUser className="text-red-600" /> {author}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock className="text-red-600" /> {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <FiEye className="text-red-600" /> {views.toLocaleString()} వీక్షణలు
                </span>
              </div>

              {/* Social Share Group */}
              <div className="flex items-center gap-2 select-none">
                <span className="text-xs font-bold text-neutral-450 uppercase flex items-center gap-1">
                  <FiShare2 /> షేర్:
                </span>
                <button 
                  onClick={() => handleShare('facebook')}
                  className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Share on Facebook"
                >
                  <FiFacebook />
                </button>
                <button 
                  onClick={() => handleShare('twitter')}
                  className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Share on Twitter"
                >
                  <FiTwitter />
                </button>
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Share on WhatsApp"
                >
                  <FiSend className="rotate-45 -translate-x-0.5 text-xs" />
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-xl overflow-hidden aspect-[16/9] w-full shadow-sm border border-neutral-100 dark:border-neutral-800">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Description Summary */}
          <p className="text-base font-bold text-neutral-800 dark:text-neutral-100 border-l-4 border-red-650 pl-4 py-1 leading-relaxed">
            {description}
          </p>

          {/* Article Body Content */}
          <div className="space-y-4 text-neutral-700 dark:text-neutral-300 text-base md:text-lg leading-relaxed font-normal">
            {content.map((paragraph, index) => (
              <React.Fragment key={index}>
                <p>{paragraph}</p>
                {/* Insert ad inside body midway */}
                {index === 0 && (
                  <AdBanner slotId="in-article-inline-ad" size="inline" className="!my-6" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Comments Section */}
          <div className="border-t border-neutral-150 dark:border-neutral-800 pt-8 space-y-6">
            <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
              <FiMessageSquare className="text-red-600" />
              <span>వ్యాఖ్యలు (Comments) - {comments.length}</span>
            </h3>

            {/* List existing comments */}
            <div className="space-y-4">
              {comments.map((comment, idx) => (
                <div key={idx} className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-900">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-500 dark:text-neutral-450 mb-2">
                    <span className="text-neutral-900 dark:text-neutral-100">{comment.name}</span>
                    <span className="font-mono">{comment.date}</span>
                  </div>
                  <p className="text-xs md:text-sm text-neutral-700 dark:text-neutral-350 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Write comment form */}
            <form onSubmit={handleCommentSubmit} className="space-y-4 bg-neutral-50 dark:bg-neutral-950 p-4 md:p-6 rounded-2xl border border-neutral-100 dark:border-neutral-900">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">మీ వ్యాఖ్యను రాయండి</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="మీ పేరు" 
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  required
                  className="px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs md:text-sm outline-none focus:border-red-650"
                />
              </div>
              <textarea 
                rows="4" 
                placeholder="మీ వ్యాఖ్య..." 
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs md:text-sm outline-none focus:border-red-650 resize-none"
              ></textarea>
              <button 
                type="submit"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm rounded-xl shadow-md transition-colors"
              >
                సమర్పించండి
              </button>
            </form>
          </div>

        </div>

        {/* Right Side: Sidebar */}
        <div className="space-y-6">
          <TrendingSidebar articles={newsArticles} />
          <AdBanner slotId="article-detail-sidebar-ad" size="rectangle" />
        </div>

      </div>

      {/* Related News Section */}
      {relatedArticles.length > 0 && (
        <section className="border-t border-neutral-200 dark:border-neutral-850 pt-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-6 bg-red-650 rounded-full"></span>
            <h3 className="text-lg md:text-xl font-extrabold text-neutral-900 dark:text-white">
              సంబంధిత వార్తలు (Related News)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((art) => (
              <NewsCard key={art.id} article={art} layout="grid" />
            ))}
          </div>
        </section>
      )}

      {/* Bottom Ad */}
      <AdBanner slotId="article-detail-bottom-ad" size="leaderboard" />

    </div>
  );
};

export default NewsDetails;
