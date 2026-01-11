import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  // Animation Observer
  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15 });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => revealObserver.observe(el));

    return () => revealElements.forEach((el) => revealObserver.unobserve(el));
  }, []);

  return (
    <div className="font-body overflow-x-hidden min-h-screen flex flex-col bg-white">
      
      {/* Animation Styles */}
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0); }
        
        /* Pop In Effect for Images */
        .reveal-pop { opacity: 0; transform: scale(0.9); transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .reveal-pop.active { opacity: 1; transform: scale(1); }
        
        /* Slide In from Left */
        .reveal-left { opacity: 0; transform: translateX(-30px); transition: all 0.8s ease-out; }
        .reveal-left.active { opacity: 1; transform: translateX(0); }

        /* Slide In from Right */
        .reveal-right { opacity: 0; transform: translateX(30px); transition: all 0.8s ease-out; }
        .reveal-right.active { opacity: 1; transform: translateX(0); }

        /* Delays */
        .reveal.delay-100 { transition-delay: 0.1s; }
        .reveal.delay-200 { transition-delay: 0.2s; }
        .reveal.delay-300 { transition-delay: 0.3s; }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>

      {/* FIX: Removed potential overflow constraints here. 
         'relative' allows absolute children to position relative to this, 
         but we allow them to be visible outside its box if they don't exceed screen width.
      */}
      <main className="relative z-10 pt-32 pb-20">
        
        {/* Hero Section */}
        {/* Added 'overflow-visible' specifically to this section so images can pop out */}
        <section className="relative py-16 lg:py-24 px-6 overflow-visible">
          <div className="max-w-4xl mx-auto text-center relative z-20">
            <div className="reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Simple Process
            </div>
            <h1 className="reveal delay-100 text-4xl md:text-5xl lg:text-5xl font-heading tracking-tight text-secondary mb-6 leading-tight">
              Your Path to <span className="text-primary relative inline-block">
                Academic Excellence
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
                </svg>
              </span>
            </h1>
            <p className="reveal delay-200 text-lg md:text-xl text-secondary/70 max-w-2xl mx-auto leading-relaxed">
              SelfWinner connects you to the best resources in minutes. From sign-up to success, discover how our platform empowers college students across India.
            </p>
          </div>

          {/* Floating Images - Adjusted positioning */}
          <div className="absolute top-[40%] left-[4%] w-[300px] h-[300px] opacity-80 pointer-events-none z-10" style={{ animation: 'float 7s ease-in-out infinite', filter: 'blur(2px)' }}>
              <img
                  src="/images/block1hiwpg.png"
                  alt="Abstract Block"
                  className="w-full h-full object-contain"
              />
          </div>
          <div className="absolute top-[20%] left-[35%] w-[200px] h-[200px] z-0 opacity-80 pointer-events-none" style={{ animation: 'float 7s ease-in-out 2s infinite',filter: 'blur(2px)' }}>
              <img
                  src="/images/block2hiwpg.png"
                  alt="Abstract Block"
                  className="w-full h-full object-contain"
              />
          </div>
          
          <div className="absolute top-[10%] left-[60%] w-[200px] h-[200px] z-0 opacity-80 pointer-events-none"  style={{ animation: 'float 6s ease-in-out infinite',filter: 'blur(2px)' }}>
              <img
                  src="/images/block2hiwpg.png"
                  alt="Abstract Block"
                  className="w-full h-full object-contain"
              />
          </div>

          {/* Main Girl Image - Adjusted Top position to ensure head isn't cut off */}
          <div className="absolute top-[-20%] left-[60%] w-[250px] h-[250px] opacity-100 pointer-events-none z-10" style={{ animation: 'float 6s ease-in-out infinite',filter: 'blur(2px)' }}>
    <img
        src="/images/girlhiwpg.png"
        alt="Student jumping"
        // Added 'rotate-[20deg]' here
        className="w-full h-full object-contain rotate-[20deg]"
    />
</div>

          <div className="absolute top-[-25%] right-[10%] w-[100px] h-[150px] opacity-80 pointer-events-none z-0" style={{ animation: 'float 8s ease-in-out 1s infinite',filter: 'blur(2px)'}}>
              <img
                  src="/images/starhiwpg.png"
                  alt="Star element"
                  className="w-full h-full object-contain"
              />
          </div>          
        </section>

        {/* How It Works Steps */}
        <section className="relative py-12 pb-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Connecting Line (visible on desktop) */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/30 to-transparent -translate-x-1/2 z-0"></div>

            {/* Step 1 - Create Your Profile */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-24 step-card group">
              {/* Image Side */}
              <div className="reveal reveal-pop order-2 lg:order-1 flex justify-end">
                <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-soft bg-gradient-to-br from-blue-50 to-blue-100 border border-slate-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-9xl text-primary/20">person_add</span>
                  </div>
                  {/* Floating badge */}
                  <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce" style={{ animationDuration: '3s' }}>
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    <span className="text-xs font-bold text-secondary">Profile Verified</span>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="reveal reveal-right order-1 lg:order-2 lg:pl-10 text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white text-xl font-bold shadow-lg shadow-primary/40 mb-6 relative">
                  01
                  <div className="absolute -inset-1 bg-primary/30 rounded-xl blur-sm -z-10"></div>
                </div>
                <h3 className="text-2xl md:text-3xl font-heading text-secondary mb-4">Create Your Profile</h3>
                <p className="text-secondary/70 text-lg leading-relaxed mb-6">
                  Sign up in seconds using your college email. Join a vibrant community of toppers and ambitious students ready to share knowledge.
                </p>
                <ul className="space-y-3 text-left inline-block">
                  <li className="flex items-center gap-3 text-secondary/70 font-medium">
                    <span className="material-symbols-outlined text-primary">school</span>
                    Verify student status
                  </li>
                  <li className="flex items-center gap-3 text-secondary/70 font-medium">
                    <span className="material-symbols-outlined text-primary">groups</span>
                    Join university groups
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 2 - Discover Resources */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-24 step-card group">
              {/* Content Side */}
              <div className="reveal reveal-left order-1 lg:pr-10 text-center lg:text-right">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary text-white text-xl font-bold shadow-lg mb-6 relative lg:ml-auto">
                  02
                  <div className="absolute -inset-1 bg-secondary/30 rounded-xl blur-sm -z-10"></div>
                </div>
                <h3 className="text-2xl md:text-3xl font-heading text-secondary mb-4">Discover Resources</h3>
                <p className="text-secondary/70 text-lg leading-relaxed mb-6">
                  Search by university, subject, or specific PYQ bundles. Our smart filters help you find exactly the study material you need in seconds.
                </p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-secondary/70 border border-slate-200">Engineering Notes</span>
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-secondary/70 border border-slate-200">Medical PYQs</span>
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-secondary/70 border border-slate-200">Management Case Studies</span>
                </div>
              </div>

              {/* Image Side - Search Interface Mockup */}
              <div className="reveal reveal-pop order-2 flex justify-start">
                <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-soft bg-white border border-slate-100 group-hover:border-primary/50 transition-colors">
                  <div className="absolute inset-0 bg-slate-50"></div>
                  {/* Mockup of search interface */}
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="w-full bg-white rounded-xl shadow-sm p-4 border border-slate-200">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
                        <span className="material-symbols-outlined text-slate-400">search</span>
                        <div className="h-2 w-32 bg-slate-200 rounded-full"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-primary/20 flex-shrink-0"></div>
                          <div className="flex-1 space-y-1">
                            <div className="h-2 w-3/4 bg-slate-200 rounded-full"></div>
                            <div className="h-1.5 w-1/2 bg-slate-100 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-orange-100 flex-shrink-0"></div>
                          <div className="flex-1 space-y-1">
                            <div className="h-2 w-2/3 bg-slate-200 rounded-full"></div>
                            <div className="h-1.5 w-1/3 bg-slate-100 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-purple-100 flex-shrink-0"></div>
                          <div className="flex-1 space-y-1">
                            <div className="h-2 w-5/6 bg-slate-200 rounded-full"></div>
                            <div className="h-1.5 w-1/2 bg-slate-100 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 - Get Instant Access */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-24 step-card group">
              {/* Image Side */}
              <div className="reveal reveal-pop order-2 lg:order-1 flex justify-end">
                <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-soft bg-gradient-to-br from-green-50 to-green-100 border border-slate-100">
                  {/* Unlock Graphic Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center transform group-hover:scale-105 transition-transform">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
                        <span className="material-symbols-outlined text-3xl">lock_open</span>
                      </div>
                      <h4 className="font-bold text-secondary">Access Granted</h4>
                      <p className="text-xs text-slate-500 mt-1">Instant Download Ready</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="reveal reveal-right order-1 lg:order-2 lg:pl-10 text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white text-xl font-bold shadow-lg shadow-primary/40 mb-6 relative">
                  03
                  <div className="absolute -inset-1 bg-primary/30 rounded-xl blur-sm -z-10"></div>
                </div>
                <h3 className="text-2xl md:text-3xl font-heading text-secondary mb-4">Get Instant Access</h3>
                <p className="text-secondary/70 text-lg leading-relaxed mb-6">
                  Purchase premium notes at student-friendly prices or access a vast library of free resources. Enjoy secure transactions and instant downloads.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <span className="material-symbols-outlined text-green-500">verified_user</span>
                    Secure Payment
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <span className="material-symbols-outlined text-blue-500">bolt</span>
                    Instant Delivery
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 - Study & Succeed */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center step-card group">
              {/* Content Side */}
              <div className="reveal reveal-left order-1 lg:pr-10 text-center lg:text-right">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary text-white text-xl font-bold shadow-lg mb-6 relative lg:ml-auto">
                  04
                  <div className="absolute -inset-1 bg-secondary/30 rounded-xl blur-sm -z-10"></div>
                </div>
                <h3 className="text-2xl md:text-3xl font-heading text-secondary mb-4">Study & Succeed</h3>
                <p className="text-secondary/70 text-lg leading-relaxed mb-8">
                  Master your subjects with high-quality material curated by toppers. Ace your exams with confidence and watch your grades soar.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-full border border-yellow-100">
                  <span className="material-symbols-outlined text-yellow-500 text-xl">emoji_events</span>
                  <span className="text-sm font-bold text-yellow-700">Join The Toppers</span>
                </div>
              </div>

              {/* Image Side */}
              <div className="reveal reveal-pop order-2 flex justify-start">
                <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-soft bg-gradient-to-br from-yellow-100 to-yellow-500 border border-slate-100">
                  <div className="absolute top-[-20%] left-[15%] rounded-2xl flex items-center justify-center opacity-80 p-3" style={{ width: '350px', height: '350px', animation: 'float 7s ease-in-out 4s infinite' }}>
                    <img 
                      src="/images/trophyhiwpg.png"
                      alt="Trophy" 
                      className="w-full h-full object-contain"
                    />
                  </div>                  
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="flex items-center gap-1 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className="material-symbols-outlined text-yellow-400 text-sm">star</span>
                      ))}
                    </div>
                    <p className="font-bold text-lg text-black">"Saved my semester!"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main CTA Section */}
        <section className="reveal py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5"></div>
          <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
            <h2 className="reveal delay-100 text-4xl md:text-5xl font-heading text-secondary mb-6 tracking-tight">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-primary">Ace</span> Your Exams?
            </h2>
            <p className="reveal delay-200 text-xl text-secondary/70 mb-10 max-w-2xl mx-auto">
              Join thousands of students who are learning smarter, not harder. Start your journey with SelfWinner today.
            </p>
            <div className="reveal delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white text-lg font-bold rounded-xl shadow-glow transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Start Your Journey Now
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button 
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-8 py-4 bg-slate-100 hover:bg-slate-200 text-secondary text-lg font-bold rounded-xl transition-all"
              >
                Browse Free Notes
              </button>
            </div>
            <p className="reveal delay-300 mt-6 text-xl text-slate-400">
              No credit card required for sign up.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
};

export default HowItWorks;