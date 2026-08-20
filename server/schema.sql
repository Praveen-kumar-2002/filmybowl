-- Create Database if not exists (Optional, typically provided by Railway/host env)
-- CREATE DATABASE IF NOT EXISTS filmybowl;
-- USE filmybowl;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  nameTelugu VARCHAR(100) NOT NULL,
  nameEnglish VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  categoryTelugu VARCHAR(100) NOT NULL,
  author VARCHAR(100) NOT NULL,
  image VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  content JSON NOT NULL,
  views INT DEFAULT 0,
  featured TINYINT(1) DEFAULT 0,
  trending TINYINT(1) DEFAULT 1,
  `date` VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_date (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id VARCHAR(50) PRIMARY KEY,
  articleId VARCHAR(50) NOT NULL,
  articleTitle VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  `text` TEXT NOT NULL,
  `date` VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_articleId (articleId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Popup Ads Table
CREATE TABLE IF NOT EXISTS popup_ads (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image VARCHAR(500) NOT NULL,
  redirectUrl VARCHAR(500) NOT NULL,
  status VARCHAR(20) NOT NULL,
  startDate VARCHAR(20) NOT NULL,
  endDate VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Breaking News Table
CREATE TABLE IF NOT EXISTS breaking_news (
  id VARCHAR(50) PRIMARY KEY,
  title TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  publishDate VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Photos Table
CREATE TABLE IF NOT EXISTS photos (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image VARCHAR(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Videos Table
CREATE TABLE IF NOT EXISTS videos (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  thumbnail VARCHAR(500) NOT NULL,
  videoUrl VARCHAR(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY DEFAULT 1,
  websiteName VARCHAR(255) NOT NULL,
  logoUrl VARCHAR(500) NOT NULL,
  faviconUrl VARCHAR(500) NOT NULL,
  contactEmail VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(50) NOT NULL,
  facebookUrl VARCHAR(500) NOT NULL,
  instagramUrl VARCHAR(500) NOT NULL,
  youtubeUrl VARCHAR(500) NOT NULL,
  twitterUrl VARCHAR(500) NOT NULL,
  metaTitle VARCHAR(500) NOT NULL,
  metaDescription TEXT NOT NULL,
  keywords VARCHAR(500) NOT NULL,
  theme VARCHAR(20) NOT NULL,
  billboardAdImage VARCHAR(500) DEFAULT 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
  billboardAdLink VARCHAR(500) DEFAULT 'https://images.unsplash.com',
  CONSTRAINT check_settings_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
