import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

interface HeaderProps {
  user: any;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false); 
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'admin' || authService.isAdmin();

  // --- Desktop Dropdown Data ---
  const dropdownMenus = {
    browse: {
      label: 'Browse',
      color: 'blue',
      items: [
        { label: 'Notes', icon: 'fa-book', path: '/notes' },
        { label: 'Bundles', icon: 'fa-box', path: '/bundles' },
        { label: 'Offers', icon: 'fa-tag', path: '/offers' }
      ]
    },
    learn: {
      label: 'Learn',
      color: 'purple',
      items: [
        { label: 'How It Works', icon: 'fa-question-circle', path: '/how-it-works' },
        { label: 'FAQs', icon: 'fa-comments', path: '/faq' },
        { label: 'Legal & Trust', icon: 'fa-shield-alt', path: '/legal' }
      ]
    },
    connect: {
      label: 'Connect',
      color: 'pink',
      items: [
        { label: 'About Us', icon: 'fa-info-circle', path: '/about' },
        { label: 'Contact', icon: 'fa-envelope', path: '/contact' }
      ]
    }
  };

  // --- Mobile Menu Items ---
  const mobileNavItems = [
    { label: 'HOME', path: '/' },
    { label: 'NOTES', path: '/notes' },
    { label: 'BUNDLES', path: '/bundles' },
    { label: 'OFFERS', path: '/offers' },
    { label: 'HOW IT WORKS', path: '/how-it-works' },
    { label: 'FAQs', path: '/faq' },
    { label: 'LEGAL & TRUST', path: '/legal' },
    { label: 'ABOUT US', path: '/about' },
    { label: 'CONTACT', path: '/contact' },
    ...(user 
      ? [
          { label: 'DASHBOARD', path: '/dashboard' },
          { label: 'LOGOUT', path: 'logout-action', isAction: true }
        ] 
      : [{ label: 'LOGIN', path: '/auth' }]
    ),
  ];

  const gradientTextClass = "text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-primary";
  const logoutGradientClass = "text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-500";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleDropdownToggle = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const closeMobileMenu = () => {
    setIsAnimatingOut(true);
    // Adjusted timing to ensure exit stagger finishes before unmount
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsAnimatingOut(false);
    }, 500); 
  };

  const handleNav = (path: string) => {
    navigate(path);
    setActiveDropdown(null);
    closeMobileMenu();
  };

  const handleMobileAction = (item: any) => {
    if (item.isAction && item.label === 'LOGOUT') {
        onLogout();
        closeMobileMenu();
        navigate('/auth');
    } else {
        handleNav(item.path);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const getDropdownColorClasses = (color: string, isOpen: boolean) => {
    const colors: any = {
      blue: { text: isOpen ? 'text-blue-600' : 'text-gray-700', bg: isOpen ? 'bg-blue-50' : 'hover:bg-gray-100' },
      purple: { text: isOpen ? 'text-purple-600' : 'text-gray-700', bg: isOpen ? 'bg-purple-50' : 'hover:bg-gray-100' },
      pink: { text: isOpen ? 'text-pink-600' : 'text-gray-700', bg: isOpen ? 'bg-pink-50' : 'hover:bg-gray-100' }
    };
    return colors[color];
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Montserrat:wght@400;500;600;700;800&display=swap');
        .font-dela { font-family: 'Dela Gothic One', cursive; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        
        /* === CARD ANIMATIONS === */
        @keyframes menuIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-menu-in {
          animation: menuIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes menuOut {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to { opacity: 0; transform: scale(0.95) translateY(10px); }
        }
        .animate-menu-out {
          /* Delay container close slightly to let items exit first */
          animation: menuOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
        }

        /* === BUTTON STAGGER ANIMATIONS === */
        /* Entry: Slide UP and Pop */
        @keyframes slideUpPop {
          0% { opacity: 0; transform: translateY(40px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .reveal-stagger {
          opacity: 0; 
          animation: slideUpPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Exit: Slide DOWN and Fade (Reverse of Entry) */
        @keyframes slideDownPop {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(40px) scale(0.9); }
        }
        .exit-stagger {
          /* No opacity: 0 here; letting keyframe handle it */
          animation: slideDownPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .mobile-scroll::-webkit-scrollbar { width: 0px; }
      `}</style>

      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-16 gap-8">
            
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => handleNav('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">S</div>
              <span className="text-xl font-bold text-gray-900 font-montserrat">SelfWinner</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 flex-1" ref={dropdownRef}>
              <button 
                onClick={() => handleNav('/')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <i className="fas fa-home mr-2"></i> Home
              </button>
              {Object.entries(dropdownMenus).map(([key, menu]) => (
                <div key={key} className="relative">
                  <button
                    onClick={() => handleDropdownToggle(key)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-1 whitespace-nowrap ${getDropdownColorClasses(menu.color, activeDropdown === key).text} ${getDropdownColorClasses(menu.color, activeDropdown === key).bg}`}
                  >
                    {menu.label}
                    <i className={`fas fa-chevron-down text-xs transition-transform ${activeDropdown === key ? 'rotate-180' : ''}`}></i>
                  </button>
                  {activeDropdown === key && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-dropdown z-50">
                      {menu.items.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => handleNav(item.path)}
                          className={`w-full text-left px-4 py-2.5 transition-colors flex items-center gap-3 ${isActive(item.path) ? `text-${menu.color}-600 bg-${menu.color}-50` : `text-gray-700 hover:bg-${menu.color}-50`}`}
                        >
                          <i className={`fas ${item.icon} w-4`}></i>
                          <span className="font-medium text-sm">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              {user ? (
                <>
                  {isAdmin && (
                    <button onClick={() => handleNav('/admin')} className="px-3 py-1.5 rounded-lg font-semibold text-sm text-purple-600 hover:bg-purple-50 border border-purple-200">
                      <i className="fas fa-crown mr-1.5"></i> Admin
                    </button>
                  )}
                  <button onClick={() => handleNav('/dashboard')} className="px-3 py-1.5 rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-100 border border-gray-200">
                    <i className="fas fa-user mr-1.5"></i> Dashboard
                  </button>
                  <button onClick={onLogout} className="px-3 py-1.5 rounded-lg font-semibold text-sm text-red-600 hover:bg-red-50 border border-red-200">
                    <i className="fas fa-sign-out-alt mr-1.5"></i> Logout
                  </button>
                </>
              ) : (
                <button onClick={() => handleNav('/auth')} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all shadow-md text-sm whitespace-nowrap">
                  Get Started
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </header>

      {/* ============================================== */}
      {/* AESTHETIC FULL SCREEN MOBILE MENU (Updated)    */}
      {/* ============================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] h-screen w-screen bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-hidden font-montserrat">
          
          <div 
            className={`w-full h-full rounded-[40px] flex flex-col relative overflow-hidden border border-white/10 shadow-2xl bg-[radial-gradient(circle_at_top_right,_#140D2E_0%,_#0E0922_40%,_#0A0719_70%,_#060511_100%)] ${isAnimatingOut ? 'animate-menu-out' : 'animate-menu-in'}`}
          >
            
            {/* Top Bar */}
            <div className="flex items-center justify-between p-8 relative z-20 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tight text-white">SelfWinner<sup className="text-[10px] ml-1">®</sup></span>
                </div>
                
                <button 
                    onClick={closeMobileMenu} 
                    className="absolute top-5 right-5 flex items-center gap-3 px-5 py-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-all border border-white/5 group z-50"
                >
                    <span className="text-sm font-bold text-white tracking-wide">CLOSE</span>
                    <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                        <i className="fas fa-times text-xs"></i>
                    </div>
                </button>
            </div>

            {/* Main Navigation Content */}
            <div className="flex-1 overflow-y-auto mobile-scroll px-8 sm:px-12 relative z-10 flex flex-col justify-center">
                <div className="flex flex-col gap-3 sm:gap-4 py-4">
                    {mobileNavItems.map((item, idx) => {
                        const isItemActive = isActive(item.path);
                        const isLogout = item.label === 'LOGOUT';
                        const totalItems = mobileNavItems.length;
                        
                        let textClass = "text-white group-hover:text-gray-300";
                        if (isItemActive) textClass = gradientTextClass;
                        if (isLogout) textClass = logoutGradientClass;

                        let numberClass = "text-white/30 group-hover:text-white/50";
                        if (isItemActive) numberClass = gradientTextClass;
                        if (isLogout) numberClass = "text-red-500/50";

                        // Animation: 
                        // Entry = reveal-stagger (slides UP)
                        // Exit = exit-stagger (slides DOWN)
                        const animationClass = isAnimatingOut ? 'exit-stagger' : 'reveal-stagger';
                        
                        // Delays:
                        // Entry = Normal index (top to bottom)
                        // Exit = Reverse index (bottom to top)
                        const delayIndex = isAnimatingOut ? (totalItems - 1 - idx) : idx;
                        const delayDuration = isAnimatingOut ? 0.03 : 0.07; // Exit faster
                        const animationStyle = { animationDelay: `${delayIndex * delayDuration}s` };

                        return (
                            <button 
                                key={item.label} 
                                onClick={() => handleMobileAction(item)} 
                                className={`group flex items-center gap-6 text-left transition-all w-full ${animationClass}`}
                                style={animationStyle}
                            >
                                <span className={`w-12 flex-shrink-0 text-xs sm:text-sm font-dela transition-colors ${numberClass}`}>
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                                
                                <span className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight transition-all uppercase ${textClass}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="p-8 sm:p-12 border-t border-white/10 bg-black/20 relative z-10 flex-shrink-0">
                <div className="flex flex-col gap-4">
                    <p className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed max-w-md">
                        WHEN THE NOTES ARE <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-primary">TOO GOOD</span>,<br/> YOU CAN'T IGNORE THEM.
                    </p>
                    
                    <div className="flex justify-between items-end">
                        <div className="text-gray-400 text-xs sm:text-sm font-medium">
                            hello@selfwinner.com
                        </div>
                        
                        <div className="flex gap-6 text-xl text-gray-400">
                            <i className="fab fa-instagram hover:text-white transition-colors cursor-pointer"></i>
                            <i className="fab fa-twitter hover:text-white transition-colors cursor-pointer"></i>
                            <i className="fab fa-linkedin hover:text-white transition-colors cursor-pointer"></i>
                        </div>
                    </div>
                </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Header;