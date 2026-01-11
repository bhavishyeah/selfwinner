import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import authService from './services/authService';

// Import pages
import Layout from './components/Layout';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Offers from './pages/Offers';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import About from './pages/About';
import AuthForm from './components/AuthForm'; // Or wherever your AuthForm is
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import NoteView from './pages/NoteView';
import BundleView from './pages/BundleView';
import ProfileSetup from './pages/ProfileSetup';
import Notes from './pages/Notes';
import Bundles from './pages/Bundles';
import SecurePDFViewer from './pages/SecurePDFViewer';

// Wrapper component to conditionally show Layout
function AppRoutes() {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if current route is the PDF viewer
  const isPDFViewerRoute = location.pathname.startsWith('/viewer/');

  useEffect(() => {
    checkAuth();
    
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const checkAuth = async () => {
    try {
      const token = authService.getToken();
      if (token) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          setIsAdmin(userData.role === 'admin');
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // If PDF viewer route, render without Layout
  if (isPDFViewerRoute) {
    return (
      <Routes>
        <Route 
          path="/viewer/:id" 
          element={
            isAuthenticated ? <SecurePDFViewer /> : <Navigate to="/auth" replace />
          } 
        />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* 1. AUTH ROUTE (Moved OUTSIDE the Layout wrapper) 
        This ensures Navbar/Footer do NOT show on this page.
      */}
      <Route 
        path="/auth" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthForm onLoginSuccess={checkAuth} />
        } 
      />

      {/* 2. MAIN ROUTES (Wrapped in Layout) 
        All these pages will have Navbar & Footer
      */}
      <Route path="/" element={<Layout user={user} onAuthChange={checkAuth} />}>
        <Route index element={<Home />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="offers" element={<Offers />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="contact" element={<Contact />} />
        <Route path="legal" element={<Legal />} />
        <Route path="about" element={<About />} />
        <Route path="notes" element={<Notes />} />
        <Route path="bundles" element={<Bundles />} />
        
        <Route 
          path="dashboard" 
          element={
            isAuthenticated && user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/auth" replace />
          } 
        />
        <Route 
          path="profile-setup" 
          element={
            isAuthenticated ? <ProfileSetup /> : <Navigate to="/auth" replace />
          } 
        />
        <Route 
          path="notes/:id" 
          element={
            isAuthenticated ? <NoteView /> : <Navigate to="/auth" replace />
          } 
        />
        <Route 
          path="bundles/:id" 
          element={
            isAuthenticated ? <BundleView /> : <Navigate to="/auth" replace />
          } 
        />
        
        <Route 
          path="admin" 
          element={
            isAuthenticated && isAdmin && user ? <Admin user={user} /> : <Navigate to="/" replace />
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;