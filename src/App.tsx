import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import UniversalAnalytics from './pages/UniversalAnalytics';
import SalesAnalytics from './pages/SalesAnalytics';
import ProfitAnalytics from './pages/ProfitAnalytics';
import CustomerInsights from './pages/CustomerInsights';
import ProductPerformance from './pages/ProductPerformance';
import RegionalAnalysis from './pages/RegionalAnalysis';
import Reports from './pages/Reports';
import InsightsAndReports from './pages/InsightsAndReports';
import UploadDataset from './pages/UploadDataset';
import SettingsPage from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Starter from './pages/Starter';
import { useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import './styles/index.css';

interface PageComponent {
  component: React.ComponentType<any>;
  props?: any;
}

function App() {
  const [currentPage, setCurrentPage] = useState('starter');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Get auth state
  const { user, loading: authLoading } = useAuth();

  // Apply dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Keep unauthenticated users on the starter page until they choose login/register
  useEffect(() => {
    if (!authLoading && !user && currentPage !== 'login' && currentPage !== 'register' && currentPage !== 'starter') {
      setCurrentPage('starter');
    }
  }, [user, authLoading, currentPage]);

  // If a logged-in user is on auth pages, continue to the right authenticated flow
  useEffect(() => {
    if (!authLoading && user && (currentPage === 'login' || currentPage === 'register')) {
      setCurrentPage('upload');
    }
  }, [user, authLoading, currentPage]);

  // Listen for programmatic navigation events from pages/components
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<string>;
      if (ev?.detail) setCurrentPage(ev.detail);
    };
    window.addEventListener('navigateTo', handler as EventListener);
    return () => window.removeEventListener('navigateTo', handler as EventListener);
  }, []);

  // Page mapping
  const pages: Record<string, PageComponent> = {
    starter: { component: Starter },
    dashboard: { component: UniversalAnalytics },
    upload: { component: UploadDataset },
    sales: { component: SalesAnalytics },
    profit: { component: ProfitAnalytics },
    customers: { component: CustomerInsights },
    products: { component: ProductPerformance },
    regions: { component: RegionalAnalysis },
    reports: { component: Reports },
    insights: { component: InsightsAndReports },
    settings: { component: SettingsPage, props: { isDark, setIsDark } },
    register: { component: Register, props: { setCurrentPage } },
    login: { component: Login, props: { setCurrentPage } },
    settings: { component: SettingsPage, props: { isDark, setIsDark } },
  };

  const currentPageConfig = pages[currentPage];
  const PageComponent = currentPageConfig.component;
  const pageProps = currentPageConfig.props || {};

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth and starter pages without sidebar when the user is not authenticated
    if (!user && (currentPage === 'login' || currentPage === 'register' || currentPage === 'starter')) {
    return (
      <div className={isDark ? 'dark' : ''}>
        <PageComponent {...pageProps} />
      </div>
    );
  }

  // Show dashboard layout with sidebar for authenticated users
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isAuthenticated={Boolean(user)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar isDark={isDark} setIsDark={setIsDark} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <DataProvider>
              <PageComponent {...pageProps} />
            </DataProvider>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App
