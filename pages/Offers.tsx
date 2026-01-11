import React from 'react';
import { useNavigate } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';

const Offers: React.FC = () => {
  const navigate = useNavigate();
  
  // Target date: January 7, 2026
  const targetDate = new Date('2026-01-07T23:59:59');

  return (
    <div className="font-body overflow-x-hidden min-h-screen flex flex-col bg-background-light">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>

    <main className="relative z-10 flex-grow pt-32 pb-20">
  {/* Header Section */}
  <div className="text-center max-w-2xl mx-auto px-6 mb-12">
    {/* Increased boldness here: font-extrabold */}
    <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-secondary leading-tight mb-4">
      Student Rewards & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 font-black">Exclusive Offers</span>
    </h1>
    
    {/* Increased boldness here: font-bold */}
    <p className="text-lg text-secondary/80 font-bold">
      Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-primary font-extrabold">premium</span> study materials for less or earn credits by inviting your study group.
    </p>
  </div>

        {/* Decorative Floating Elements */}
        <div 
          className="reveal-pop absolute top-[-15%] left-[1%] w-[1000px] h-[1000px] z-[-1] opacity-100 pointer-events-none"
          style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        >
          <img src="/images/confettiofferpg.png" alt="Decoration" className="w-full h-full object-contain" />
        </div>

        <div 
          className="reveal-pop absolute top-[-15%] left-[20%] w-[1000px] h-[1000px] z-[-1] opacity-100 pointer-events-none"
          style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
        >
          <img src="/images/confettiofferpg.png" alt="Decoration" className="w-full h-full object-contain" />
        </div>

        <div 
          className="reveal-pop absolute top-[11%] left-[35%] w-[300px] h-[300px] z-[-1] opacity-70 pointer-events-none"
          style={{ 
              clipPath: 'polygon(0 0, 100% 0, 0 100%)',
              transform: 'rotate(45deg)',
              filter: 'blur(5px)' 
          }}
        >
          <img src="/images/blurconfettiofferpg.png" alt="Decoration" className="w-full h-full object-contain" />
        </div>

        {/* Flash Sale Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
          <div className="w-full relative overflow-hidden rounded-2xl bg-white shadow-soft border border-slate-100 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
           <div className="flex flex-col lg:flex-row relative z-10">
  {/* Content Side */}
  <div className="flex-1 p-4 sm:p-8 lg:p-12 flex flex-col gap-6 sm:gap-8 w-full font-montserrat">
    <div className="flex flex-col gap-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-black uppercase tracking-wider w-fit font-montserrat">
        <span className="material-symbols-outlined text-[16px] font-bold">alarm</span>
        Limited Time Offer
      </div>
      
      {/* Increased boldness here: font-extrabold */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-secondary leading-tight font-montserrat">
        Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-primary font-black">Premium</span> Semester<br className="hidden md:block"/> Bundles for Less
      </h2>
      
      {/* Increased boldness here: font-semibold */}
      <p className="text-secondary/80 text-sm sm:text-base max-w-md font-montserrat font-semibold">
        Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-primary font-black">20%</span> off on all Previous Year Question (PYQ) bundles and premium notes. Don't let the semester catch you off guard.
      </p>
    </div>
                {/* Persistent Countdown Timer */}
                <div className="w-full overflow-x-auto pb-2 hide-scrollbar sm:overflow-visible">
                    <CountdownTimer targetDate={targetDate} />
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center mt-2">
                  <button 
                    onClick={() => navigate('/')}
                    className="w-full sm:w-auto flex items-center justify-center h-12 px-8 bg-secondary text-white text-sm sm:text-base font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 whitespace-nowrap font-montserrat"
                  >
                    Shop Bundles Now
                  </button>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-montserrat">
                    <span className="material-symbols-outlined text-green-500 text-[18px] sm:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <span>Verified by Razorpay</span>
                  </div>
                </div>
              </div>

              {/* --- SEPARATE MOBILE IMAGE DIV --- */}
              {/* Increased height to h-80 (was h-56) for larger display area */}
              <div className="block lg:hidden w-full h-80 bg-gradient-to-br from-blue-50 to-slate-50 relative overflow-hidden">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/40 to-transparent opacity-50"></div>
                 <div className="relative z-10 h-full w-full flex items-center justify-center p-4 animate-float">
                    {/* Increased container size to w-80 h-80 (was w-60 h-60) */}
                    <div className="relative w-80 h-80">
                       <div className="absolute inset-0 flex items-center justify-center opacity-90 p-2 transform rotate-6">
                         <img 
                           src="/images/20%offerpg.png"
                           alt="20% Off Badge" 
                           className="w-full h-full object-contain"
                         />
                       </div>
                    </div>
                 </div>
              </div>

              {/* --- DESKTOP IMAGE DIV --- */}
              <div className="hidden lg:flex w-full lg:w-1/2 h-auto lg:min-h-[450px] bg-gradient-to-br from-blue-50 to-slate-50 items-center justify-center relative overflow-hidden rounded-r-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/40 to-transparent opacity-50"></div>
                
                <div className="relative z-10 p-8 flex flex-col items-center justify-center gap-4 animate-float h-full w-full">
                   <div className="relative w-[400px] h-[400px] xl:w-[500px] xl:h-[500px]"> 
                      <div className="absolute inset-0 flex items-center justify-center opacity-90 p-3 transform rotate-6 hover:rotate-0 transition-all duration-500">
                        <img 
                          src="/images/20%offerpg.png"
                          alt="20% Off Badge" 
                          className="w-full h-full object-contain drop-shadow-2xl"
                        />
                      </div>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6 mb-12 font-montserrat">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]">percent</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-secondary">Student ID (COMING SOON)</h3>
                <p className="text-secondary/70 text-sm mt-1">Verify your student ID and get an extra 10% off automatically.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                <span className="material-symbols-outlined text-[28px]">description</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-secondary">PYQ included in Bundle</h3>
                <p className="text-secondary/70 text-sm mt-1">Get respective PYQs for each subject.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                <span className="material-symbols-outlined text-[28px]">support_agent</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-secondary">Exam Support</h3>
                <p className="text-secondary/70 text-sm mt-1">24/7 priority support for all users.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Benefits */}
        <section className="max-w-7xl mx-auto px-6 mb-12 font-montserrat">
          <div className="bg-gradient-to-br from-primary/10 to-blue-50 rounded-2xl p-8 md:p-12 border border-primary/20">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-heading text-secondary mb-4">
                Why Choose SelfWinner?
              </h2>
              <p className="text-lg text-secondary/70 mb-8">
                Join thousands of students who are already acing their exams with our premium resources.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl font-black text-primary mb-2 font-dela">SOON...</div>
                  <div className="text-sm font-medium text-secondary/70">Active Students</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-primary mb-2 font-dela">SOON...</div>
                  <div className="text-sm font-medium text-secondary/70">Premium Notes</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-primary mb-2 font-dela">SOON...</div>
                  <div className="text-sm font-medium text-secondary/70">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 font-montserrat">
          <div className="bg-secondary text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-heading mb-4">
              Ready to Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-primary">Saving?</span> 
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Don't miss out on these exclusive offers. Start your academic journey with SelfWinner today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/auth')}
                className="px-8 py-4 bg-white text-secondary font-bold rounded-xl hover:bg-slate-100 transition-all"
              >
                Create Account
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Montserrat:wght@400;500;600;700;800&display=swap');
        .font-dela { font-family: 'Dela Gothic One', cursive; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }

        @keyframes float {
          0% { transform: translateY(0px) rotate(6deg); }
          50% { transform: translateY(-10px) rotate(6deg); }
          100% { transform: translateY(0px) rotate(6deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Offers;