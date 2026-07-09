import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiHome, 
  FiChevronRight, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiSend, 
  FiAlertCircle, 
  FiCheckCircle 
} from 'react-icons/fi';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null); // 'sending', 'success', 'error'

  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim() && message.trim()) {
      setStatus('sending');
      
      // Mock API trigger
      setTimeout(() => {
        setStatus('success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }, 1500);
    } else {
      setStatus('error');
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
        <span className="text-neutral-900 dark:text-neutral-200 font-bold">సంప్రదించండి (Contact)</span>
      </nav>

      {/* Page Title */}
      <div className="border-b border-neutral-250 dark:border-neutral-850 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-7 bg-red-650 rounded-full"></span>
          <h1 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
            <FiMail className="text-red-650 text-2xl md:text-3xl" />
            <span>మమ్మల్ని సంప్రదించండి</span>
          </h1>
        </div>
        <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-450 mt-1">
          వార్తా ప్రచురణలు, ప్రకటనల వివరాలు లేదా ఏవైనా ఫిర్యాదుల కొరకు క్రింది ఫారమ్ ద్వారా మమ్మల్ని సంప్రదించగలరు
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Contact Form (Col span 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
          <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white">సందేశాన్ని పంపండి</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Alert boxes for submit state */}
            {status === 'success' && (
              <div className="flex items-center gap-2 text-xs md:text-sm text-green-700 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-4 rounded-xl">
                <FiCheckCircle className="text-lg text-green-600 shrink-0" />
                <span>మీ సందేశం విజయవంతంగా పంపబడింది! మా బృందం త్వరలోనే మిమ్మల్ని సంప్రదిస్తుంది.</span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 text-xs md:text-sm text-red-700 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-4 rounded-xl">
                <FiAlertCircle className="text-lg text-red-600 shrink-0" />
                <span>దయచేసి అన్ని వివరాలను సరిగ్గా పూరించండి.</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">పూర్తి పేరు *</label>
                <input
                  type="text"
                  required
                  placeholder="మీ పేరు రాయండి"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-red-650 rounded-xl outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">ఈమెయిల్ చిరునామా *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-red-650 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">విషయం (Subject)</label>
              <input
                type="text"
                placeholder="సందేశానికి సంబంధించిన విషయం"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-red-650 rounded-xl outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">సందేశం *</label>
              <textarea
                required
                rows="6"
                placeholder="మీ సందేశాన్ని ఇక్కడ వివరించండి..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-red-650 rounded-xl outline-none resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-neutral-400 text-white font-extrabold text-xs md:text-sm rounded-xl shadow-md transition-colors"
            >
              <FiSend />
              <span>{status === 'sending' ? 'పంపుతోంది...' : 'సందేశాన్ని పంపండి'}</span>
            </button>

          </form>
        </div>

        {/* Right Side: Contact Info & Map (Col span 1) */}
        <div className="space-y-6">
          {/* Info Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 p-6 rounded-2xl shadow-sm space-y-6">
            <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white">కార్యాలయ చిరునామా</h2>
            
            <ul className="space-y-4 text-xs md:text-sm text-neutral-600 dark:text-neutral-350">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-red-600 text-xl shrink-0 mt-0.5" />
                <span>
                  <strong>ప్రధాన కార్యాలయం:</strong><br />
                  3వ అంతస్తు, సిలికాన్ టవర్స్, ఐటీ కారిడార్, గచిబౌలి, హైదరాబాద్, తెలంగాణ - 500032
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-red-600 text-xl shrink-0" />
                <span>
                  <strong>ఫోన్ నంబర్:</strong><br />
                  +91 40 1234 5678, +91 40 8765 4321
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-red-600 text-xl shrink-0" />
                <span>
                  <strong>ఈమెయిల్:</strong><br />
                  contact@telugu360news.com
                </span>
              </li>
            </ul>
          </div>

          {/* Interactive Google Map Mock Placeholder */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-2xl overflow-hidden shadow-sm aspect-video sm:aspect-square relative group">
            {/* Mock Map Image */}
            <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
              {/* Premium dark-mode themed mock map elements */}
              <div className="absolute inset-0 bg-cover bg-center opacity-65 dark:opacity-40" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80')` }}></div>
              <div className="absolute inset-0 bg-red-900/10 dark:bg-red-950/20 mix-blend-overlay"></div>
              
              {/* Map pin decoration */}
              <div className="z-10 flex flex-col items-center gap-1 cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white text-base shadow-lg animate-bounce">
                  <FiMapPin />
                </div>
                <span className="bg-neutral-950/80 backdrop-blur-sm text-white text-[9px] font-black tracking-wider px-2 py-0.5 rounded shadow">
                  TELUGU360 NEWS
                </span>
              </div>
            </div>

            {/* Hint overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-[10px] text-white text-center font-bold uppercase tracking-wider">
                Google Maps లో తెరవడానికి క్లిక్ చేయండి
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
