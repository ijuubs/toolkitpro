import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalErrorOverlay from './components/GlobalErrorOverlay';
import { PageSkeleton } from './components/SkeletonLoader';
import { ThemeProvider } from './context/ThemeProvider';
import { initAnalytics, trackPageView } from './utils/analytics';

// Lazy load components
const HomePage = lazy(() => import('./pages/HomePage'));
const ToolTemplate = lazy(() => import('./pages/ToolTemplate'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      trackPageView(location.pathname + location.search, document.title);
    }, 150);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <GlobalErrorOverlay />
      <BrowserRouter>
        <ScrollToTop />
        <AnalyticsTracker />
        <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={
              <ErrorBoundary>
              <Suspense fallback={<PageSkeleton />}>
                <HomePage />
              </Suspense>
              </ErrorBoundary>
            } />
            <Route path="analytics" element={
              <ErrorBoundary>
              <Suspense fallback={<PageSkeleton />}>
                <AnalyticsPage />
              </Suspense>
              </ErrorBoundary>
            } />
            <Route path="tools/:slug" element={
              <ErrorBoundary>
              <Suspense fallback={<PageSkeleton />}>
                <ToolTemplate />
              </Suspense>
              </ErrorBoundary>
            } />
            <Route path="calculators" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><CategoryPage /></Suspense></ErrorBoundary>} />
            <Route path="image-tools" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><CategoryPage /></Suspense></ErrorBoundary>} />
            <Route path="text-tools" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><CategoryPage /></Suspense></ErrorBoundary>} />
            <Route path="developer-tools" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><CategoryPage /></Suspense></ErrorBoundary>} />
            <Route path="converters" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><CategoryPage /></Suspense></ErrorBoundary>} />
            <Route path="fiji-tools" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><CategoryPage /></Suspense></ErrorBoundary>} />
            <Route path="color-tools" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><CategoryPage /></Suspense></ErrorBoundary>} />
            <Route path="about" element={
              <ErrorBoundary>
              <Suspense fallback={<PageSkeleton />}>
                <AboutPage />
              </Suspense>
              </ErrorBoundary>
            } />
            <Route path="contact" element={
              <ErrorBoundary>
              <Suspense fallback={<PageSkeleton />}>
                <ContactPage />
              </Suspense>
              </ErrorBoundary>
            } />
            <Route path="privacy" element={
              <ErrorBoundary>
              <Suspense fallback={<PageSkeleton />}>
                <PrivacyPage />
              </Suspense>
              </ErrorBoundary>
            } />
            <Route path="terms" element={
              <ErrorBoundary>
              <Suspense fallback={<PageSkeleton />}>
                <TermsPage />
              </Suspense>
              </ErrorBoundary>
            } />
            <Route path="disclaimer" element={
              <ErrorBoundary>
              <Suspense fallback={<PageSkeleton />}>
                <DisclaimerPage />
              </Suspense>
              </ErrorBoundary>
            } />
            <Route path="faq" element={
              <ErrorBoundary>
              <Suspense fallback={<PageSkeleton />}>
                <FAQPage />
              </Suspense>
              </ErrorBoundary>
            } />
            <Route path="sitemap" element={
              <ErrorBoundary>
              <Suspense fallback={<PageSkeleton />}>
                <SitemapPage />
              </Suspense>
              </ErrorBoundary>
            } />
            <Route path="blog" element={
              <ErrorBoundary>
              <Suspense fallback={<PageSkeleton />}>
                <BlogPage />
              </Suspense>
              </ErrorBoundary>
            } />
            <Route path="blog/:slug" element={
              <ErrorBoundary>
              <Suspense fallback={<PageSkeleton />}>
                <BlogPost />
              </Suspense>
              </ErrorBoundary>
            } />
            <Route path="*" element={
              <ErrorBoundary>
              <Suspense fallback={<PageSkeleton />}>
                <NotFound />
              </Suspense>
              </ErrorBoundary>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
