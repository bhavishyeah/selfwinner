import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  user: any | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel h-20 transition-all duration-300 border-b border-white/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="size-10 text-white flex items-center justify-center bg-primary rounded-lg shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[24px]">school</span>
          </div>
          <h2 className="text-secondary text-2xl font-heading tracking-tight mt-1">SelfWinner</h2>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => navigate('/')}
            className={`text-sm font-semibold transition-colors ${
              isActive('/') 
                ? 'text-primary' 
                : 'text-secondary/70 hover:text-primary'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigate('/notes')}
            className={`text-sm font-semibold transition-colors ${
              isActive('/notes') 
                ? 'text-primary' 
                : 'text-secondary/70 hover:text-primary'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => navigate('/bundles')}
            className={`text-sm font-semibold transition-colors ${
              isActive('/bundles') 
                ? 'text-primary' 
                : 'text-secondary/70 hover:text-primary'
            }`}
          >
            Bundles
          </button>
          <button
            onClick={() => navigate('/how-it-works')}
            className={`text-sm font-semibold transition-colors ${
              isActive('/how-it-works') 
                ? 'text-primary' 
                : 'text-secondary/70 hover:text-primary'
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => navigate('/about')}
            className={`text-sm font-semibold transition-colors ${
              isActive('/about') 
                ? 'text-primary' 
                : 'text-secondary/70 hover:text-primary'
            }`}
          >
            About
          </button>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-secondary/70">
                {user.email}
              </span>
              <button className="flex h-10 items-center justify-center px-6 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:bg-primary-hover hover:-translate-y-0.5 transition-all">
                Dashboard
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => navigate('/auth')}
                className="hidden sm:flex h-10 items-center justify-center px-6 rounded-lg text-secondary text-sm font-bold hover:bg-slate-50 transition-all"
              >
                Log in
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="flex h-10 items-center justify-center px-6 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:bg-primary-hover hover:-translate-y-0.5 transition-all"
              >
                Sign up
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden flex items-center justify-center w-10 h-10 text-secondary">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;