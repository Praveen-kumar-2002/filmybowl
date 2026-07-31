import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Parse directory paths in ES Modules
const __filename = fileURLToPath(importURL(import.meta.url));
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

// JWT Secret token key
const JWT_SECRET = 'filmybowl_jwt_secret_token_key_2026';

const app = express();
app.use(cors());
app.use(express.json());

// Helper function to safely read import URL
function importURL(url) {
  return url;
}

// -------------------------------------------------------------
// DATABASE INITIALIZATION LOADER
// -------------------------------------------------------------
async function initializeDatabase() {
  try {
    // Check if db.json already exists
    await fs.access(DB_PATH);
  } catch (err) {
    // If not, import initial mock articles from client and create db.json
    console.log('Database file not found. Initializing db.json from mock data...');
    
    // Default categories
    const initialCategories = [
      { id: 'cat-1', key: 'politics', nameTelugu: 'రాజకీయాలు', nameEnglish: 'Politics' },
      { id: 'cat-2', key: 'movies', nameTelugu: 'సినిమాలు', nameEnglish: 'Movies' },
      { id: 'cat-3', key: 'sports', nameTelugu: 'క్రీడలు', nameEnglish: 'Sports' },
      { id: 'cat-4', key: 'business', nameTelugu: 'వ్యాపారం', nameEnglish: 'Business' },
      { id: 'cat-5', key: 'technology', nameTelugu: 'సాంకేతిక సమాచారం', nameEnglish: 'Technology' }
    ];

    // Default comments
    const initialComments = [
      { id: 'com-1', articleId: 'pol-1', articleTitle: 'ఏపీ అసెంబ్లీ బడ్జెట్ సమావేశాలు...', name: 'రమేష్ కుమార్', text: 'చాలా మంచి వార్త. బడ్జెట్ ప్రజారంజకంగా ఉండాలని కోరుకుంటున్నాం.', date: '2026-07-08' },
      { id: 'com-2', articleId: 'mov-1', articleTitle: 'సరిపోదా శనివారం రివ్యూ', name: 'శ్రీను రాజు', text: 'సినిమా చాలా బాగుంది. నాని నటన అద్భుతం.', date: '2026-07-08' },
      { id: 'com-3', articleId: 'spo-1', articleTitle: 'ధోనీ రిటైర్మెంట్ నిర్ణయం', name: 'ధోని ఫ్యాన్', text: 'మా లెజెండ్ ఎప్పటికీ మా గుండెల్లోనే ఉంటారు.', date: '2026-07-07' },
      { id: 'com-4', articleId: 'mov-2', articleTitle: 'దేవర సినిమా అప్‌డేట్స్', name: 'తారక్ ఆర్మీ', text: 'దేవర అప్డేట్ కోసం వెయిటింగ్.. సినిమా బ్లాక్ బస్టర్ అవుతుంది!', date: '2026-07-06' },
      { id: 'com-5', articleId: 'tech-1', articleTitle: '5G విప్లవం భారతదేశంలో', name: 'టెక్ గీక్', text: 'స్పీడ్ చాలా బాగుంది కానీ ప్లాన్స్ ధరలు పెరగకూడదు.', date: '2026-07-05' }
    ];

    // Default popup ads
    const initialPopupAds = [
      { id: 'ad-1', title: 'Gaming Championship 2026', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80', redirectUrl: 'https://images.unsplash.com', status: 'Active', startDate: '2026-07-01', endDate: '2026-08-01' },
      { id: 'ad-2', title: 'New Movie Release Promo', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80', redirectUrl: 'https://images.unsplash.com', status: 'Inactive', startDate: '2026-07-15', endDate: '2026-07-30' }
    ];

    // Default breaking news
    const initialBreakingNews = [
      { id: 'bn-1', title: 'బ్రేకింగ్: ఏపీ అసెంబ్లీ బడ్జెట్ సమావేశాలు ముగింపు!', priority: 'High', status: 'Active', publishDate: '2026-07-08' },
      { id: 'bn-2', title: 'ధోనీ ఐపీఎల్ 2026 ఆడే విషయంపై సంచలన ప్రకటన!', priority: 'Medium', status: 'Active', publishDate: '2026-07-08' },
      { id: 'bn-3', title: 'విడుదలకు సిద్ధమైన పాన్ ఇండియా మూవీ ట్రైలర్ రిలీజ్ డేట్ ఖరారు!', priority: 'High', status: 'Inactive', publishDate: '2026-07-07' }
    ];

    // Default photos
    const initialPhotos = [
      { id: 'ph-1', title: 'NTR దేవర షూటింగ్ సెట్ స్పెషల్ పిక్స్', category: 'Movies', image: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&w=150&q=80' },
      { id: 'ph-2', title: 'రామ్ చరణ్ గేమ్ ఛేంజర్ ప్రెస్ మీట్ క్యూట్ గ్యాలరీ', category: 'Movies', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
      { id: 'ph-3', title: 'ధోనీ సరికొత్త హెయిర్ స్టైల్ ఫొటోలు వైరుల్', category: 'Sports', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }
    ];

    // Default videos
    const initialVideos = [
      { id: 'vd-1', title: 'దేవర అఫీషియల్ ట్రైలర్ లాంచ్ ప్రెస్ మీట్ వీడియో', category: 'Movies', thumbnail: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { id: 'vd-2', title: '5G నెట్‌వర్క్ స్పీడ్ టెస్టింగ్ & లైవ్ డెమో రిపోర్ట్', category: 'Technology', thumbnail: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
    ];

    // Default settings
    const initialSettings = {
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

    // Load static client mock articles
    const clientDataPath = path.join(__dirname, '..', 'src', 'data', 'newsData.js');
    let clientArticles = [];
    try {
      const dataStr = await fs.readFile(clientDataPath, 'utf-8');
      // Simple regex extraction since newsArticles is a JS array literal
      const arrayMatch = dataStr.match(/export const newsArticles = (\[[\s\S]*?\]);/);
      if (arrayMatch) {
        // Evaluate the literal array string safely into Javascript object
        clientArticles = new Function(`return ${arrayMatch[1]}`)();
      }
    } catch (e) {
      console.log('Could not load client mock articles, using empty array.', e);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('filmybowl', salt);

    const initialDb = {
      users: [
        { id: 'usr-1', username: 'admin', passwordHash }
      ],
      articles: clientArticles,
      categories: initialCategories,
      comments: initialComments,
      popupAds: initialPopupAds,
      breakingNews: initialBreakingNews,
      photos: initialPhotos,
      videos: initialVideos,
      settings: initialSettings
    };

    await fs.writeFile(DB_PATH, JSON.stringify(initialDb, null, 2));
  }
}

// Read database
async function getDb() {
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

// Write database
async function writeDb(db) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

// -------------------------------------------------------------
// SECURE VERIFY TOKEN MIDDLEWARE
// -------------------------------------------------------------
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Access denied. Token missing.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. Token missing.' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

// -------------------------------------------------------------
// ENDPOINTS ROUTES
// -------------------------------------------------------------

// Admin Authentication Log In
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Please enter username and password.' });
  }

  try {
    const db = await getDb();
    const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '15m'
    });

    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Server authentication error.' });
  }
});

// GET Articles List
app.get('/api/articles', async (req, res) => {
  try {
    const db = await getDb();
    res.json(db.articles);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch articles.' });
  }
});

// POST Add Article (Admin)
app.post('/api/admin/articles', verifyToken, async (req, res) => {
  try {
    const db = await getDb();
    const newArt = {
      ...req.body,
      id: `art-${Date.now()}`,
      views: 0,
      date: new Date().toISOString().split('T')[0]
    };
    db.articles.unshift(newArt);
    await writeDb(db);
    res.status(201).json(newArt);
  } catch (err) {
    res.status(500).json({ error: 'Could not add article.' });
  }
});

// PUT Edit Article (Admin)
app.put('/api/admin/articles/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    const idx = db.articles.findIndex(a => a.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Article not found.' });

    db.articles[idx] = { ...db.articles[idx], ...req.body };
    await writeDb(db);
    res.json(db.articles[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Could not edit article.' });
  }
});

// DELETE Article (Admin)
app.delete('/api/admin/articles/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    db.articles = db.articles.filter(a => a.id !== id);
    await writeDb(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete article.' });
  }
});

// GET Categories List
app.get('/api/categories', async (req, res) => {
  try {
    const db = await getDb();
    res.json(db.categories);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch categories.' });
  }
});

// POST Add Category (Admin)
app.post('/api/admin/categories', verifyToken, async (req, res) => {
  try {
    const db = await getDb();
    const newCat = {
      ...req.body,
      id: `cat-${Date.now()}`,
      key: req.body.nameEnglish.toLowerCase().replace(/\s+/g, '-')
    };
    db.categories.push(newCat);
    await writeDb(db);
    res.status(201).json(newCat);
  } catch (err) {
    res.status(500).json({ error: 'Could not add category.' });
  }
});

// PUT Edit Category (Admin)
app.put('/api/admin/categories/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    const idx = db.categories.findIndex(c => c.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Category not found.' });

    db.categories[idx] = { 
      ...db.categories[idx], 
      ...req.body,
      key: (req.body.nameEnglish || db.categories[idx].nameEnglish).toLowerCase().replace(/\s+/g, '-')
    };
    await writeDb(db);
    res.json(db.categories[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Could not edit category.' });
  }
});

// DELETE Category (Admin)
app.delete('/api/admin/categories/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    db.categories = db.categories.filter(c => c.id !== id);
    await writeDb(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete category.' });
  }
});

// GET Comments List
app.get('/api/comments', async (req, res) => {
  try {
    const db = await getDb();
    res.json(db.comments);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch comments.' });
  }
});

// POST Submit Comment (Public)
app.post('/api/comments', async (req, res) => {
  try {
    const db = await getDb();
    const newCom = {
      ...req.body,
      id: `com-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    db.comments.unshift(newCom);
    await writeDb(db);
    res.status(201).json(newCom);
  } catch (err) {
    res.status(500).json({ error: 'Could not post comment.' });
  }
});

// DELETE Comment (Admin)
app.delete('/api/admin/comments/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    db.comments = db.comments.filter(c => c.id !== id);
    await writeDb(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete comment.' });
  }
});

// GET Popup Ads
app.get('/api/popup-ads', async (req, res) => {
  try {
    const db = await getDb();
    res.json(db.popupAds);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch popup ads.' });
  }
});

// POST Add Popup Ad (Admin)
app.post('/api/admin/popup-ads', verifyToken, async (req, res) => {
  try {
    const db = await getDb();
    const newAd = { ...req.body, id: `ad-${Date.now()}` };
    db.popupAds.unshift(newAd);
    await writeDb(db);
    res.status(201).json(newAd);
  } catch (err) {
    res.status(500).json({ error: 'Could not add ad.' });
  }
});

// PUT Edit Popup Ad (Admin)
app.put('/api/admin/popup-ads/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    const idx = db.popupAds.findIndex(ad => ad.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Ad not found.' });

    db.popupAds[idx] = { ...db.popupAds[idx], ...req.body };
    await writeDb(db);
    res.json(db.popupAds[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Could not edit ad.' });
  }
});

// DELETE Popup Ad (Admin)
app.delete('/api/admin/popup-ads/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    db.popupAds = db.popupAds.filter(ad => ad.id !== id);
    await writeDb(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete ad.' });
  }
});

// GET Breaking News
app.get('/api/breaking-news', async (req, res) => {
  try {
    const db = await getDb();
    res.json(db.breakingNews);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch breaking news.' });
  }
});

// POST Add Breaking News (Admin)
app.post('/api/admin/breaking-news', verifyToken, async (req, res) => {
  try {
    const db = await getDb();
    const newNews = { ...req.body, id: `bn-${Date.now()}` };
    db.breakingNews.unshift(newNews);
    await writeDb(db);
    res.status(201).json(newNews);
  } catch (err) {
    res.status(500).json({ error: 'Could not add news.' });
  }
});

// PUT Edit Breaking News (Admin)
app.put('/api/admin/breaking-news/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    const idx = db.breakingNews.findIndex(n => n.id === id);
    if (idx === -1) return res.status(404).json({ error: 'News not found.' });

    db.breakingNews[idx] = { ...db.breakingNews[idx], ...req.body };
    await writeDb(db);
    res.json(db.breakingNews[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Could not edit news.' });
  }
});

// DELETE Breaking News (Admin)
app.delete('/api/admin/breaking-news/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    db.breakingNews = db.breakingNews.filter(n => n.id !== id);
    await writeDb(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete news.' });
  }
});

// GET Photos
app.get('/api/photos', async (req, res) => {
  try {
    const db = await getDb();
    res.json(db.photos);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch photos.' });
  }
});

// POST Add Photo (Admin)
app.post('/api/admin/photos', verifyToken, async (req, res) => {
  try {
    const db = await getDb();
    const newPh = { ...req.body, id: `ph-${Date.now()}` };
    db.photos.unshift(newPh);
    await writeDb(db);
    res.status(201).json(newPh);
  } catch (err) {
    res.status(500).json({ error: 'Could not upload photo.' });
  }
});

// DELETE Photo (Admin)
app.delete('/api/admin/photos/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    db.photos = db.photos.filter(p => p.id !== id);
    await writeDb(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete photo.' });
  }
});

// GET Videos
app.get('/api/videos', async (req, res) => {
  try {
    const db = await getDb();
    res.json(db.videos);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch videos.' });
  }
});

// POST Add Video (Admin)
app.post('/api/admin/videos', verifyToken, async (req, res) => {
  try {
    const db = await getDb();
    const newVd = { ...req.body, id: `vd-${Date.now()}` };
    db.videos.unshift(newVd);
    await writeDb(db);
    res.status(201).json(newVd);
  } catch (err) {
    res.status(500).json({ error: 'Could not upload video.' });
  }
});

// DELETE Video (Admin)
app.delete('/api/admin/videos/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    db.videos = db.videos.filter(v => v.id !== id);
    await writeDb(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete video.' });
  }
});

// GET Settings
app.get('/api/settings', async (req, res) => {
  try {
    const db = await getDb();
    res.json(db.settings);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch settings.' });
  }
});

// PUT Edit Settings (Admin)
app.put('/api/admin/settings', verifyToken, async (req, res) => {
  try {
    const db = await getDb();
    db.settings = { ...db.settings, ...req.body };
    await writeDb(db);
    res.json(db.settings);
  } catch (err) {
    res.status(500).json({ error: 'Could not edit settings.' });
  }
});

// Reset Settings (Admin)
app.post('/api/admin/settings/reset', verifyToken, async (req, res) => {
  try {
    const db = await getDb();
    db.settings = {
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
    await writeDb(db);
    res.json(db.settings);
  } catch (err) {
    res.status(500).json({ error: 'Could not reset settings.' });
  }
});

// START EXPRESS SERVER
const PORT = 5000;
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Filmybowl Backend Server running on http://localhost:${PORT}`);
  });
});
