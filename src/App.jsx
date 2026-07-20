import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AdminDataProvider } from './context/AdminDataContext';
import AppRoutes from './routes/AppRoutes';
import Header from './components/Header';
import Navbar from './components/Navbar';
import BreakingNews from './components/BreakingNews';
import Footer from './components/Footer';
import { useAdminData } from './context/AdminDataContext';
import './App.css';

// Child component to get react-router-dom location context
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { articles } = useAdminData();

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-neutral-55 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans antialiased">
        <AppRoutes />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Top Header */}
      <Header />
      
      {/* Desktop Navbar */}
      <Navbar />
      
      {/* Breaking News Marquee */}
      <BreakingNews articles={articles} />

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 py-6 animate-fade-in">
        <AppRoutes />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AdminDataProvider>
        <Router>
          <AppContent />
        </Router>
      </AdminDataProvider>
    </ThemeProvider>
  );
}

export default App;
