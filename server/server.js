import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

// Load environmental parameters
dotenv.config();

// JWT Secret token key
const JWT_SECRET = process.env.JWT_SECRET || 'filmybowl_jwt_secret_token_key_2026';

// -------------------------------------------------------------
// DATABASE CONNECTION POOL CONFIGURATION
// -------------------------------------------------------------
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'filmybowl',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const app = express();
app.use(cors());
app.use(express.json());

// Interactive Swagger OpenAPI spec definition
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Filmybowl News Portal API Documentation',
    version: '1.0.0',
    description: 'Interactive REST API documentation for Filmybowl news content and administrative actions.'
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}`,
      description: 'Local server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Admin Log In',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string', example: 'admin' },
                  password: { type: 'string', example: 'filmybowl' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Authenticated successfully' }
        }
      }
    },
    '/api/articles': {
      get: {
        tags: ['Articles'],
        summary: 'Get Articles list',
        responses: {
          200: { description: 'Success' }
        }
      }
    },
    '/api/admin/articles': {
      post: {
        tags: ['Articles (Admin)'],
        summary: 'Add Article',
        security: [{ BearerAuth: [] }],
        responses: {
          201: { description: 'Created' }
        }
      }
    },
    '/api/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Get Categories list',
        responses: {
          200: { description: 'Success' }
        }
      }
    },
    '/api/comments': {
      get: {
        tags: ['Comments'],
        summary: 'Get Comments list',
        responses: {
          200: { description: 'Success' }
        }
      },
      post: {
        tags: ['Comments'],
        summary: 'Submit Comment (Public)',
        responses: {
          201: { description: 'Success' }
        }
      }
    },
    '/api/popup-ads': {
      get: {
        tags: ['Popup Ads'],
        summary: 'Get Popup Ads list',
        responses: {
          200: { description: 'Success' }
        }
      }
    },
    '/api/breaking-news': {
      get: {
        tags: ['Breaking News'],
        summary: 'Get Breaking News list',
        responses: {
          200: { description: 'Success' }
        }
      }
    },
    '/api/photos': {
      get: {
        tags: ['Gallery'],
        summary: 'Get Photos list',
        responses: {
          200: { description: 'Success' }
        }
      }
    },
    '/api/videos': {
      get: {
        tags: ['Videos'],
        summary: 'Get Videos list',
        responses: {
          200: { description: 'Success' }
        }
      }
    },
    '/api/settings': {
      get: {
        tags: ['Settings'],
        summary: 'Get Settings list',
        responses: {
          200: { description: 'Success' }
        }
      }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

// Helper to convert mysql boolean (0/1 tinyint) to JavaScript boolean type
const mapArticle = (row) => ({
  ...row,
  featured: row.featured === 1,
  trending: row.trending === 1
});

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
    const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(username) = ?', [username.toLowerCase()]);
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '15m'
    });

    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server database authentication error.' });
  }
});

// GET Articles List
app.get('/api/articles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM articles ORDER BY date DESC, created_at DESC');
    res.json(rows.map(mapArticle));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch articles from MySQL.' });
  }
});

// POST Add Article (Admin)
app.post('/api/admin/articles', verifyToken, async (req, res) => {
  const { title, category, categoryTelugu, author, image, description, content, featured, trending } = req.body;
  const id = `art-${Date.now()}`;
  const date = new Date().toISOString().split('T')[0];
  const contentJson = Array.isArray(content) ? JSON.stringify(content) : JSON.stringify([content || '']);

  try {
    await pool.query(
      'INSERT INTO articles (id, title, category, categoryTelugu, author, image, description, content, views, featured, trending, `date`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, category, categoryTelugu, author, image, description, contentJson, 0, featured ? 1 : 0, trending ? 1 : 0, date]
    );

    const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    res.status(201).json(mapArticle(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create article in MySQL.' });
  }
});

// PUT Edit Article (Admin)
app.put('/api/admin/articles/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const fieldsToUpdate = [];
  const values = [];

  Object.keys(req.body).forEach(key => {
    if (['title', 'category', 'categoryTelugu', 'author', 'image', 'description', 'views', 'date'].includes(key)) {
      fieldsToUpdate.push(`\`${key}\` = ?`);
      values.push(req.body[key]);
    } else if (key === 'content') {
      fieldsToUpdate.push('`content` = ?');
      values.push(JSON.stringify(req.body.content));
    } else if (key === 'featured' || key === 'trending') {
      fieldsToUpdate.push(`\`${key}\` = ?`);
      values.push(req.body[key] ? 1 : 0);
    }
  });

  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({ error: 'No fields provided to update.' });
  }

  values.push(id);

  try {
    const [result] = await pool.query(`UPDATE articles SET ${fieldsToUpdate.join(', ')} WHERE id = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Article not found.' });
    }
    const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    res.json(mapArticle(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not edit article in MySQL.' });
  }
});

// DELETE Article (Admin)
app.delete('/api/admin/articles/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM articles WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Article not found.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete article from MySQL.' });
  }
});

// GET Categories List
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch categories from MySQL.' });
  }
});

// POST Add Category (Admin)
app.post('/api/admin/categories', verifyToken, async (req, res) => {
  const { nameTelugu, nameEnglish } = req.body;
  const id = `cat-${Date.now()}`;
  const key = nameEnglish.toLowerCase().replace(/\s+/g, '-');

  try {
    await pool.query(
      'INSERT INTO categories (id, `key`, nameTelugu, nameEnglish) VALUES (?, ?, ?, ?)',
      [id, key, nameTelugu, nameEnglish]
    );
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create category in MySQL.' });
  }
});

// PUT Edit Category (Admin)
app.put('/api/admin/categories/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { nameTelugu, nameEnglish } = req.body;
  const key = nameEnglish ? nameEnglish.toLowerCase().replace(/\s+/g, '-') : undefined;

  try {
    const [result] = await pool.query(
      'UPDATE categories SET nameTelugu = COALESCE(?, nameTelugu), nameEnglish = COALESCE(?, nameEnglish), `key` = COALESCE(?, `key`) WHERE id = ?',
      [nameTelugu, nameEnglish, key, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not edit category in MySQL.' });
  }
});

// DELETE Category (Admin)
app.delete('/api/admin/categories/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete category from MySQL.' });
  }
});

// GET Comments List
app.get('/api/comments', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM comments ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch comments from MySQL.' });
  }
});

// POST Submit Comment (Public)
app.post('/api/comments', async (req, res) => {
  const { articleId, articleTitle, name, text } = req.body;
  const id = `com-${Date.now()}`;
  const date = new Date().toISOString().split('T')[0];

  try {
    await pool.query(
      'INSERT INTO comments (id, articleId, articleTitle, name, `text`, `date`) VALUES (?, ?, ?, ?, ?, ?)',
      [id, articleId, articleTitle, name, text, date]
    );
    const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not submit comment to MySQL.' });
  }
});

// DELETE Comment (Admin)
app.delete('/api/admin/comments/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM comments WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Comment not found.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete comment from MySQL.' });
  }
});

// GET Popup Ads
app.get('/api/popup-ads', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM popup_ads');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch popup ads from MySQL.' });
  }
});

// POST Add Popup Ad (Admin)
app.post('/api/admin/popup-ads', verifyToken, async (req, res) => {
  const { title, image, redirectUrl, status, startDate, endDate } = req.body;
  const id = `ad-${Date.now()}`;

  try {
    await pool.query(
      'INSERT INTO popup_ads (id, title, image, redirectUrl, status, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, title, image, redirectUrl, status, startDate, endDate]
    );
    const [rows] = await pool.query('SELECT * FROM popup_ads WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not add popup ad to MySQL.' });
  }
});

// PUT Edit Popup Ad (Admin)
app.put('/api/admin/popup-ads/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, image, redirectUrl, status, startDate, endDate } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE popup_ads SET title = COALESCE(?, title), image = COALESCE(?, image), redirectUrl = COALESCE(?, redirectUrl), status = COALESCE(?, status), startDate = COALESCE(?, startDate), endDate = COALESCE(?, endDate) WHERE id = ?',
      [title, image, redirectUrl, status, startDate, endDate, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ad not found.' });
    }
    const [rows] = await pool.query('SELECT * FROM popup_ads WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not edit ad in MySQL.' });
  }
});

// DELETE Popup Ad (Admin)
app.delete('/api/admin/popup-ads/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM popup_ads WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ad not found.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete ad from MySQL.' });
  }
});

// GET Breaking News
app.get('/api/breaking-news', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM breaking_news');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch tickers from MySQL.' });
  }
});

// POST Add Breaking News (Admin)
app.post('/api/admin/breaking-news', verifyToken, async (req, res) => {
  const { title, priority, status, publishDate } = req.body;
  const id = `bn-${Date.now()}`;

  try {
    await pool.query(
      'INSERT INTO breaking_news (id, title, priority, status, publishDate) VALUES (?, ?, ?, ?, ?)',
      [id, title, priority, status, publishDate]
    );
    const [rows] = await pool.query('SELECT * FROM breaking_news WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not add breaking news to MySQL.' });
  }
});

// PUT Edit Breaking News (Admin)
app.put('/api/admin/breaking-news/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, priority, status, publishDate } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE breaking_news SET title = COALESCE(?, title), priority = COALESCE(?, priority), status = COALESCE(?, status), publishDate = COALESCE(?, publishDate) WHERE id = ?',
      [title, priority, status, publishDate, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'News not found.' });
    }
    const [rows] = await pool.query('SELECT * FROM breaking_news WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not edit breaking news in MySQL.' });
  }
});

// DELETE Breaking News (Admin)
app.delete('/api/admin/breaking-news/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM breaking_news WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'News not found.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete breaking news from MySQL.' });
  }
});

// GET Photos
app.get('/api/photos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM photos');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch photos from MySQL.' });
  }
});

// POST Add Photo (Admin)
app.post('/api/admin/photos', verifyToken, async (req, res) => {
  const { title, category, image } = req.body;
  const id = `ph-${Date.now()}`;

  try {
    await pool.query(
      'INSERT INTO photos (id, title, category, image) VALUES (?, ?, ?, ?)',
      [id, title, category, image]
    );
    const [rows] = await pool.query('SELECT * FROM photos WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not upload photo to MySQL.' });
  }
});

// DELETE Photo (Admin)
app.delete('/api/admin/photos/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM photos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Photo not found.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete photo from MySQL.' });
  }
});

// GET Videos
app.get('/api/videos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM videos');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch videos from MySQL.' });
  }
});

// POST Add Video (Admin)
app.post('/api/admin/videos', verifyToken, async (req, res) => {
  const { title, category, thumbnail, videoUrl } = req.body;
  const id = `vd-${Date.now()}`;

  try {
    await pool.query(
      'INSERT INTO videos (id, title, category, thumbnail, videoUrl) VALUES (?, ?, ?, ?, ?)',
      [id, title, category, thumbnail, videoUrl]
    );
    const [rows] = await pool.query('SELECT * FROM videos WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not upload video to MySQL.' });
  }
});

// DELETE Video (Admin)
app.delete('/api/admin/videos/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM videos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Video not found.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete video from MySQL.' });
  }
});

// GET Settings
app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM settings WHERE id = 1');
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Settings not initialized.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch settings from MySQL.' });
  }
});

// PUT Edit Settings (Admin)
app.put('/api/admin/settings', verifyToken, async (req, res) => {
  const fieldsToUpdate = [];
  const values = [];

  Object.keys(req.body).forEach(key => {
    if (['websiteName', 'logoUrl', 'faviconUrl', 'contactEmail', 'phoneNumber', 'facebookUrl', 'instagramUrl', 'youtubeUrl', 'twitterUrl', 'metaTitle', 'metaDescription', 'keywords', 'theme', 'billboardAdImage', 'billboardAdLink'].includes(key)) {
      fieldsToUpdate.push(`\`${key}\` = ?`);
      values.push(req.body[key]);
    }
  });

  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({ error: 'No settings provided to update.' });
  }

  try {
    const [result] = await pool.query(`UPDATE settings SET ${fieldsToUpdate.join(', ')} WHERE id = 1`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Settings not found.' });
    }
    const [rows] = await pool.query('SELECT * FROM settings WHERE id = 1');
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not edit settings in MySQL.' });
  }
});

// Reset Settings (Admin)
app.post('/api/admin/settings/reset', verifyToken, async (req, res) => {
  const defaultSettings = {
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
    theme: 'Dark',
    billboardAdImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
    billboardAdLink: 'https://images.unsplash.com'
  };

  try {
    await pool.query(
      'UPDATE settings SET websiteName = ?, logoUrl = ?, faviconUrl = ?, contactEmail = ?, phoneNumber = ?, facebookUrl = ?, instagramUrl = ?, youtubeUrl = ?, twitterUrl = ?, metaTitle = ?, metaDescription = ?, keywords = ?, theme = ?, billboardAdImage = ?, billboardAdLink = ? WHERE id = 1',
      [
        defaultSettings.websiteName,
        defaultSettings.logoUrl,
        defaultSettings.faviconUrl,
        defaultSettings.contactEmail,
        defaultSettings.phoneNumber,
        defaultSettings.facebookUrl,
        defaultSettings.instagramUrl,
        defaultSettings.youtubeUrl,
        defaultSettings.twitterUrl,
        defaultSettings.metaTitle,
        defaultSettings.metaDescription,
        defaultSettings.keywords,
        defaultSettings.theme,
        defaultSettings.billboardAdImage,
        defaultSettings.billboardAdLink
      ]
    );
    const [rows] = await pool.query('SELECT * FROM settings WHERE id = 1');
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not reset settings in MySQL.' });
  }
});

// START EXPRESS SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Filmybowl Backend Server running on port ${PORT} with MySQL integration.`);
});
