import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiUser, FiAlertCircle } from 'react-icons/fi';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === 'true') {
      setError('సెషన్ గడువు ముగిసింది. భద్రతా కారణాల దృష్ట్యా మీరు లాగ్ అవుట్ చేయబడ్డారు. (Session expired. Please log in again.)');
    }
  }, []);

  useEffect(() => {
    // If already authenticated, redirect straight to dashboard
    if (sessionStorage.getItem('filmybowl_admin_auth') === 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Attempt API authentication
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('filmybowl_admin_auth', 'true');
        sessionStorage.setItem('filmybowl_admin_auth_token', data.token);
        sessionStorage.setItem('filmybowl_admin_auth_time', Date.now().toString());
        navigate('/admin');
        return;
      } else {
        const data = await response.json();
        setError(data.error || 'వినియోగదారు పేరు లేదా పాస్‌వర్డ్ తప్పు.');
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Authentication server offline. Attempting offline fallback check...', err);
    }

    // Local authentication fallback if server is offline
    setTimeout(() => {
      if (username.toLowerCase() === 'admin' && password === 'filmybowl') {
        sessionStorage.setItem('filmybowl_admin_auth', 'true');
        sessionStorage.setItem('filmybowl_admin_auth_token', 'offline_fallback_token');
        sessionStorage.setItem('filmybowl_admin_auth_time', Date.now().toString());
        navigate('/admin');
      } else {
        setError('వినియోగదారు పేరు లేదా పాస్‌వర్డ్ తప్పు. దయచేసి మళ్ళీ ప్రయత్నించండి.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-neutral-900 via-neutral-950 to-black px-4 relative overflow-hidden">
      
      {/* Visual background gradient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-neutral-900/40 backdrop-blur-md border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl p-8 relative z-10 flex flex-col gap-6">
        
        {/* Branding header */}
        <div className="text-center space-y-2">
          <div className="flex flex-col items-center gap-2 py-1 select-none">
            <img src="/cineveduka-logo.png" alt="Cineveduka Logo" className="h-10 w-auto object-contain" />
            <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">Admin</span>
          </div>
          <p className="text-xs text-neutral-400">వెబ్ పోర్టల్ అడ్మిన్ లాగిన్</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-900/40 text-red-400 text-xs rounded-xl flex items-center gap-2 animate-shake">
            <FiAlertCircle className="text-base shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-400">వినియోగదారు పేరు (Username)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500">
                <FiUser />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:border-red-650 rounded-2xl outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-400">పాస్‌వర్డ్ (Password)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500">
                <FiLock />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:border-red-650 rounded-2xl outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-neutral-850 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2 pt-3"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <span>లాగిన్ (Log In)</span>
            )}
          </button>

        </form>

        {/* Hint to test easily */}
        <div className="text-[10px] text-neutral-500 text-center border-t border-neutral-850 pt-4">
          Test Username: <span className="font-mono text-neutral-400">admin</span> / Password: <span className="font-mono text-neutral-400">filmybowl</span>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
