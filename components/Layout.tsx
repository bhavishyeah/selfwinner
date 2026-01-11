import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import authService from '../services/authService';

interface LayoutProps {
  user: any;
  onAuthChange: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onAuthChange }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    onAuthChange();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;