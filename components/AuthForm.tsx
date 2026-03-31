import React, { useEffect, useRef, useState } from 'react';
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
  
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const googleInitialized = useRef(false);

  const navigate = useNavigate();

  

  const handleGoogleLogin = async (response: any) => {
    try {
const result = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google/callback`, {
          credential: response.credential
      });
      if (result.data.success) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
                setSuccess('Signed in successfully with Google!');
        if (onLoginSuccess) onLoginSuccess();
        setTimeout(() => {
          if (result.data.user.role === 'admin') {
            window.location.href = '/#/admin';
          } else if (result.data.user.isNewUser) {
            navigate('/profile-setup');
          } else {
            window.location.href = '/#/dashboard';
          }
        }, 300);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google login failed');
    }
  };

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const googleObj = (window as any).google;
      if (!googleObj?.accounts?.id) {
        return;
      }

      if (!googleInitialized.current) {
        googleObj.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleLogin
        });
                googleInitialized.current = true;
      }
     const btnContainer = document.getElementById('googleSignInButton');
      if (!btnContainer) {
        return;
      }
       btnContainer.innerHTML = '';
      googleObj.accounts.id.renderButton(btnContainer, {
        theme: 'outline',
        size: 'large',
        width: 380,
        text: 'signin_with'
            });

      window.clearInterval(intervalId);
    }, 100);
     return () => window.clearInterval(intervalId);
  }, [googleClientId]);

  return (
    <div className="min-h-screen flex bg-white overflow-hidden font-sans">
     
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 z-10 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Continue with Google                   
              </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Google-only authentication is enabled for SelfWinner.
                          </p>
          </div>

           
         {googleClientId ? (
            <div className="w-full flex justify-center">
              <div id="googleSignInButton" className="w-full"></div>
            </div>
           ) : (
            <p className="text-xs text-center text-gray-500">
              Google sign-in is unavailable: missing <code>VITE_GOOGLE_CLIENT_ID</code>.
            </p>
          )}

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
                  LEARN SMARTER<br />NOT HARDER
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
                  SECURE<br />VIEWING
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
                  BUILT FOR<br />STUDENTS
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