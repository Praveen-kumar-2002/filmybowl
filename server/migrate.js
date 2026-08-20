import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Parse directory paths in ES Modules
const __filename = fileURLToPath(importURL(import.meta.url));
const __dirname = path.dirname(__filename);

// Load env configurations
dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'filmybowl';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);

function importURL(url) {
  return url;
}

async function runMigration() {
  console.log('Starting MySQL database migration...');

  // 1. Establish initial server connection (without database, to create the database if needed)
  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT
    });
    console.log(`Connected to MySQL server at ${DB_HOST}:${DB_PORT}`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`Database "${DB_NAME}" created or already exists.`);
  } catch (err) {
    console.error('Failed to establish initial server connection or create database:', err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }

  // 2. Establish connection to the specific database with multipleStatements enabled
  let db;
  try {
    db = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      multipleStatements: true
    });
    console.log(`Connected to database "${DB_NAME}" successfully.`);
  } catch (err) {
    console.error('Failed to connect to the database:', err.message);
    process.exit(1);
  }

  // 3. Create tables using schema.sql
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf-8');
    await db.query(schemaSql);
    console.log('Database tables created successfully from schema.sql.');
  } catch (err) {
    console.error('Failed to initialize database tables schema:', err.message);
    await db.end();
    process.exit(1);
  }

  // 4. Read mock data from db.json
  const dbJsonPath = path.join(__dirname, 'db.json');
  let mockData;
  try {
    const dataStr = await fs.readFile(dbJsonPath, 'utf-8');
    mockData = JSON.parse(dataStr);
    console.log('Loaded server/db.json database file.');
  } catch (err) {
    console.warn('Could not read or parse server/db.json file. Skipping data migration.', err.message);
    await db.end();
    return;
  }

  // 5. Migrate tables sequentially
  try {
    // 5a. Users Table
    const [userRows] = await db.query('SELECT COUNT(*) as count FROM users');
    if (userRows[0].count === 0 && mockData.users && mockData.users.length > 0) {
      console.log(`Migrating ${mockData.users.length} user records...`);
      for (const u of mockData.users) {
        await db.query(
          'INSERT INTO users (id, username, passwordHash) VALUES (?, ?, ?)',
          [u.id, u.username, u.passwordHash]
        );
      }
    }

    // 5b. Categories Table
    const [catRows] = await db.query('SELECT COUNT(*) as count FROM categories');
    if (catRows[0].count === 0) {
      const initialCategories = [
        { id: 'cat-1', key: 'film-news', nameTelugu: 'ఫిల్మ్ న్యూస్', nameEnglish: 'Film News' },
        { id: 'cat-2', key: 'news', nameTelugu: 'వార్తలు', nameEnglish: 'News' },
        { id: 'cat-3', key: 'reviews', nameTelugu: 'రివ్యూలు', nameEnglish: 'Reviews' },
        { id: 'cat-4', key: 'gallery', nameTelugu: 'గ్యాలరీ', nameEnglish: 'Gallery' },
        { id: 'cat-5', key: 'box-office-news', nameTelugu: 'బాక్స్ ఆఫీస్ వార్తలు', nameEnglish: 'Box Office News' },
        { id: 'cat-6', key: 'live-tracking', nameTelugu: 'లైవ్ ట్రాకింగ్', nameEnglish: 'Live Tracking' },
        { id: 'cat-7', key: 'polls', nameTelugu: 'పోల్స్', nameEnglish: 'Polls' }
      ];
      console.log(`Migrating ${initialCategories.length} new category records...`);
      for (const c of initialCategories) {
        await db.query(
          'INSERT INTO categories (id, `key`, nameTelugu, nameEnglish) VALUES (?, ?, ?, ?)',
          [c.id, c.key, c.nameTelugu, c.nameEnglish]
        );
      }
    }

    // 5c. Articles Table
    const [artRows] = await db.query('SELECT COUNT(*) as count FROM articles');
    if (artRows[0].count === 0 && mockData.articles && mockData.articles.length > 0) {
      console.log(`Migrating ${mockData.articles.length} article records...`);
      for (const a of mockData.articles) {
        let catKey = a.category;
        let catTelugu = a.categoryTelugu;
        if (['politics', 'sports', 'business', 'technology'].includes(catKey)) {
          catKey = 'news';
          catTelugu = 'వార్తలు';
        } else if (catKey === 'movies') {
          catKey = 'film-news';
          catTelugu = 'ఫిల్మ్ న్యూస్';
        }
        // Stringify content array to valid JSON string for MySQL JSON datatype
        const contentJson = Array.isArray(a.content) ? JSON.stringify(a.content) : JSON.stringify([a.content || '']);
        await db.query(
          'INSERT INTO articles (id, title, category, categoryTelugu, author, image, description, content, views, featured, trending, `date`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [a.id, a.title, catKey, catTelugu, a.author, a.image, a.description, contentJson, a.views || 0, a.featured ? 1 : 0, a.trending ? 1 : 0, a.date]
        );
      }
    }

    // 5d. Comments Table
    const [comRows] = await db.query('SELECT COUNT(*) as count FROM comments');
    if (comRows[0].count === 0 && mockData.comments && mockData.comments.length > 0) {
      console.log(`Migrating ${mockData.comments.length} comment records...`);
      for (const c of mockData.comments) {
        await db.query(
          'INSERT INTO comments (id, articleId, articleTitle, name, `text`, `date`) VALUES (?, ?, ?, ?, ?, ?)',
          [c.id, c.articleId, c.articleTitle, c.name, c.text, c.date]
        );
      }
    }

    // 5e. Popup Ads Table
    const [adRows] = await db.query('SELECT COUNT(*) as count FROM popup_ads');
    if (adRows[0].count === 0 && mockData.popupAds && mockData.popupAds.length > 0) {
      console.log(`Migrating ${mockData.popupAds.length} popup ad records...`);
      for (const ad of mockData.popupAds) {
        await db.query(
          'INSERT INTO popup_ads (id, title, image, redirectUrl, status, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [ad.id, ad.title, ad.image, ad.redirectUrl, ad.status, ad.startDate, ad.endDate]
        );
      }
    }

    // 5f. Breaking News Table
    const [newsRows] = await db.query('SELECT COUNT(*) as count FROM breaking_news');
    if (newsRows[0].count === 0 && mockData.breakingNews && mockData.breakingNews.length > 0) {
      console.log(`Migrating ${mockData.breakingNews.length} breaking news records...`);
      for (const bn of mockData.breakingNews) {
        await db.query(
          'INSERT INTO breaking_news (id, title, priority, status, publishDate) VALUES (?, ?, ?, ?, ?)',
          [bn.id, bn.title, bn.priority, bn.status, bn.publishDate]
        );
      }
    }

    // 5g. Photos Table
    const [phRows] = await db.query('SELECT COUNT(*) as count FROM photos');
    if (phRows[0].count === 0 && mockData.photos && mockData.photos.length > 0) {
      console.log(`Migrating ${mockData.photos.length} photo records...`);
      for (const ph of mockData.photos) {
        await db.query(
          'INSERT INTO photos (id, title, category, image) VALUES (?, ?, ?, ?)',
          [ph.id, ph.title, ph.category, ph.image]
        );
      }
    }

    // 5h. Videos Table
    const [vdRows] = await db.query('SELECT COUNT(*) as count FROM videos');
    if (vdRows[0].count === 0 && mockData.videos && mockData.videos.length > 0) {
      console.log(`Migrating ${mockData.videos.length} video records...`);
      for (const vd of mockData.videos) {
        await db.query(
          'INSERT INTO videos (id, title, category, thumbnail, videoUrl) VALUES (?, ?, ?, ?, ?)',
          [vd.id, vd.title, vd.category, vd.thumbnail, vd.videoUrl]
        );
      }
    }

    // 5i. Settings Table (Upsert default row 1)
    const [setRows] = await db.query('SELECT COUNT(*) as count FROM settings WHERE id = 1');
    if (setRows[0].count === 0) {
      console.log('Migrating website settings config row...');
      const s = mockData.settings || {
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
      await db.query(
        'INSERT INTO settings (id, websiteName, logoUrl, faviconUrl, contactEmail, phoneNumber, facebookUrl, instagramUrl, youtubeUrl, twitterUrl, metaTitle, metaDescription, keywords, theme, billboardAdImage, billboardAdLink) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          s.websiteName,
          s.logoUrl,
          s.faviconUrl,
          s.contactEmail,
          s.phoneNumber,
          s.facebookUrl,
          s.instagramUrl,
          s.youtubeUrl,
          s.twitterUrl,
          s.metaTitle,
          s.metaDescription,
          s.keywords,
          s.theme,
          s.billboardAdImage || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
          s.billboardAdLink || 'https://images.unsplash.com'
        ]
      );
    }

    console.log('🎉 MySQL database migration completed successfully!');
  } catch (err) {
    console.error('Error migrating datasets to MySQL:', err);
  } finally {
    if (db) await db.end();
  }
}

runMigration();
