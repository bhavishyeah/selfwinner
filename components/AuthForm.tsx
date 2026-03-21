import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService.js';
import axios from 'axios';
import CardSwap, { Card } from '../components/CardSwap/CardSwap';

interface AuthFormProps {
  onLoginSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
     const response = await authService.register({ email, password });
      if (response.success) {
        setSuccess('Account created successfully! 🎉');
        if (onLoginSuccess) onLoginSuccess();
        setTimeout(() => {
          navigate('/profile-setup');
        }, 500);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
    setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      if (response.success) {
        if (onLoginSuccess) onLoginSuccess();
        setTimeout(() => {
          if (response.user.role === 'admin') window.location.href = '/#/admin';
          else window.location.href = '/#/dashboard';
        }, 100);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response: any) => {
    try {
      const result = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google/callback`, {
        credential: response.credential
      });
      if (result.data.success) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        if (onLoginSuccess) onLoginSuccess();
        setTimeout(() => {
          if (result.data.user.role === 'admin') window.location.href = '/#/admin';
          else window.location.href = '/#/dashboard';
        }, 100);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google login failed');
    }
  };

  useEffect(() => {
    const loadGoogleScript = () => {
      if ((window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: '284630277115-hvoeq7e5ii3a3cgd7c5n33v754pir6p7.apps.googleusercontent.com',
          callback: handleGoogleLogin
        });
        const btnContainer = document.getElementById('googleSignInButton');
        if (btnContainer) {
          (window as any).google.accounts.id.renderButton(
            btnContainer,
            { theme: 'outline', size: 'large', width: '100%', text: isLogin ? 'signin_with' : 'signup_with' }
          );
        }
      }
    };
    const checkGoogleLoaded = setInterval(() => {
      if ((window as any).google) {
        loadGoogleScript();
        clearInterval(checkGoogleLoaded);
      }
    }, 100);
    return () => clearInterval(checkGoogleLoaded);
  }, [isLogin]);

  return (
    <div className="min-h-screen flex bg-white overflow-hidden font-sans">
     
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 z-10 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {isLogin ? 'Sign in to SelfWinner' : 'Join SelfWinner Today'}            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
               {isLogin ? "Welcome back! Let's get learning." : 'Start your journey to academic excellence.'}
            </p>
          </div>

           <>
            <div className="flex justify-center space-x-1 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isLogin ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  !isLogin ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Register
              </button>
            </div>

            <div className="w-full flex justify-center">
              <div id="googleSignInButton" className="w-full"></div>
            </div>

              <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
           <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>
          </>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0"><i className="fas fa-exclamation-circle text-red-500"></i></div>
                <div className="ml-3"><p className="text-sm text-red-700">{error}</p></div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0"><i className="fas fa-check-circle text-green-500"></i></div>
                <div className="ml-3"><p className="text-sm text-green-700">{success}</p></div>
              </div>
            </div>
          )}

           <form className="mt-8 space-y-6" onSubmit={isLogin ? handleLogin : handleRegister}>
            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Name" />
                </div>
                 )}
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Email address" />
              </div>
              <div>
                 <label htmlFor="password" className="sr-only">Password</label>
                <input id="password" name="password" type="password" autoComplete={isLogin ? 'current-password' : 'new-password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="6 characters password" minLength={6} />
              </div>
              <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-colors">
                {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create account')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- RIGHT SIDE: DARK MODE 3D CARDS --- */}
      <div className="hidden lg:flex w-1/2 bg-[#050510] relative items-center justify-center overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full h-full relative" style={{ minHeight: '600px' }}>
          <CardSwap
            cardDistance={60}
            verticalDistance={80}
            delay={4000}
            skewAmount={4}
            pauseOnHover
            width="100%"
            height="100%"
          >
            {/* --- CARD 1 --- */}
            <Card>
              <div className="card-header">
                <div className="window-btn bg-red-500/80"></div>
                <div className="window-btn bg-yellow-500/80"></div>
                <div className="window-btn bg-green-500/80"></div>
                <div className="text-[10px] text-white/30 ml-auto">Premium.tsx</div>
              </div>
              <div className="card-body text-center">
                {/* Blue/Indigo Gradient */}
                <h3 style={{ 
                    backgroundImage: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', 
                    fontSize: '2rem', 
                    lineHeight: '1.2' 
                }}>
                  LEARN SMARTER<br/>NOT HARDER
                </h3>
                <p className="mt-2 text-sm text-white/60">Access premium notes instantly</p>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none"></div>
              </div>
            </Card>

            {/* --- CARD 2 --- */}
            <Card>
              <div className="card-header">
                <div className="window-btn bg-slate-600"></div>
                <div className="window-btn bg-slate-600"></div>
                <div className="text-[10px] text-white/30 ml-auto">Secure.css</div>
              </div>
              <div className="card-body text-center">
                {/* Purple Gradient */}
                <h3 style={{ 
                    backgroundImage: 'linear-gradient(135deg, #fff 0%, #c084fc 100%)', 
                    fontSize: '2rem', 
                    lineHeight: '1.2' 
                }}>
                  SECURE<br/>VIEWING
                </h3>
                <p className="mt-2 text-sm text-white/60">Protected content delivery</p>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none"></div>
              </div>
            </Card>

            {/* --- CARD 3 --- */}
            <Card>
              <div className="card-header">
                <div className="window-btn bg-slate-600"></div>
                <div className="text-[10px] text-white/30 ml-auto">Connect.json</div>
              </div>
              <div className="card-body text-center">
                {/* Green Gradient */}
                <h3 style={{ 
                    backgroundImage: 'linear-gradient(135deg, #fff 0%, #4ade80 100%)', 
                    fontSize: '2rem', 
                    lineHeight: '1.2' 
                }}>
                  BUILT FOR<br/>STUDENTS
                </h3>
                <p className="mt-2 text-sm text-white/60">Curated by top performers</p>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-green-500/10 to-transparent pointer-events-none"></div>
              </div>
            </Card>

          </CardSwap>
          
          {/* Aesthetic Text Overlay */}
          <div className="absolute bottom-12 left-12 z-0 pointer-events-none">
             <h2 className="text-white text-3xl font-bold tracking-tight mb-2">
                WHEN THE NOTES ARE <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-primary"> <br />TOO GOOD </span>, <br />YOU CAN'T IGNORE THEM.
             </h2>
             <p className="text-white/40 text-sm">Just look at it go!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;