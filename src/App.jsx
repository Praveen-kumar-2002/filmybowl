import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import Header from './components/Header';
import Navbar from './components/Navbar';
import BreakingNews from './components/BreakingNews';
import Footer from './components/Footer';
import { newsArticles } from './data/newsData';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
          
          {/* Top Header */}
          <Header />
          
          {/* Desktop Navbar */}
          <Navbar />
          
          {/* Breaking News Marquee */}
          <BreakingNews articles={newsArticles} />

          {/* Main Content Area */}
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 py-6 animate-fade-in">
            <AppRoutes />
          </main>

          {/* Footer */}
          <Footer />

        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
