import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
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
      
      {/* Custom Styles (Animations + Glass Effects) */}
      <style>{`
        /* Scroll Reveal Animations */
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0); }
        
        .reveal-pop { opacity: 0; transform: scale(0.95); transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .reveal-pop.active { opacity: 1; transform: scale(1); }

        .reveal-left { opacity: 0; transform: translateX(-30px); transition: all 0.8s ease-out; }
        .reveal-left.active { opacity: 1; transform: translateX(0); }
        
        .reveal.delay-100 { transition-delay: 0.1s; }
        .reveal.delay-200 { transition-delay: 0.2s; }
        .reveal.delay-300 { transition-delay: 0.3s; }
        .reveal.delay-400 { transition-delay: 0.4s; }
        .reveal.delay-500 { transition-delay: 0.5s; }

        /* Original Effects */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.85);
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -15px rgba(59, 164, 255, 0.15);
          border-color: rgba(59, 164, 255, 0.3);
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-white">
        
        {/* Background Elements (Blobs) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-50/50 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4"></div>
        </div>

        {/* =====================================================================================
            1. DESKTOP IMAGES (Hidden on Mobile, Visible on LG+)
           ===================================================================================== */}
        <div className="hidden lg:block pointer-events-none">
            {/* Tick - Left Side */}
            <div className="absolute top-1/4 left-[4%] rounded-2xl flex items-center justify-center opacity-80 p-3" 
                 style={{ width: '400px', height: '400px', animation: 'float 7s ease-in-out 1s infinite' }}>
              <img 
                src="/images/tickabtus.png"
                alt="Verification badge" 
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Lock - Right Side */}
            <div className="absolute bottom-1/3 right-[3%] rounded-full flex items-center justify-center opacity-80 p-4" 
                 style={{ width: '450px', height: '450px', animation: 'float 5s ease-in-out 1s infinite' }}>
              <img 
                src="/images/lockabtus.png" 
                alt="Security lock" 
                className="w-full h-full object-contain"
              />
            </div>
        </div>

        {/* =====================================================================================
            2. MOBILE IMAGES (Visible on Mobile, Hidden on LG+)
           ===================================================================================== */}
        <div className="block lg:hidden pointer-events-none">
            {/* Tick - Top Left Corner */}
            <div className="absolute top-[1%] left-[-20%] opacity-100" style={{ width: '400px', height: '400px',animation: 'float 5s ease-in-out 1s infinite' }}>
                <img src="/images/tickabtus.png" alt="Verification badge" className="w-full h-full object-contain" />
            </div>

            {/* Lock - Bottom Right Corner */}
            <div className="absolute bottom-[5%] -right-[20%] opacity-100" style={{width: '400px', height: '400px',animation: 'float 7s ease-in-out 1s infinite' }}>
                <img src="/images/lockabtus.png" alt="Security lock" className="w-full h-full object-contain" />
            </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20">
          <div className="reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-l font-bold uppercase tracking-wider mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Our Mission
          </div>
          <h1 className="reveal delay-100 text-5xl md:text-7xl font-heading tracking-tight text-secondary mb-8 leading-[1.1]">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">SelfWinner</span>
          </h1>
          <p className="reveal delay-200 text-xl md:text-2xl text-secondary/200 font-dark max-w-2xl mx-auto leading-relaxed">
            Built on discipline. Designed for clarity.<br className="hidden md:block"/> Focused on learning.
          </p>
          <div className="reveal delay-300 mt-12 flex justify-center gap-6">
            <div className="h-16 w-px bg-gradient-to-b from-slate-200 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Why SelfWinner Exists Section */}
      <section className="py-32 bg-white relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="reveal order-2 lg:order-1 space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading text-secondary mb-6">Why SelfWinner Exists</h2>
                <div className="w-20 h-1 bg-primary rounded-full mb-8"></div>
                <p className="text-lg text-secondary/70 leading-relaxed mb-6">
                  Students today face a trust gap. Reliable, exam-focused notes are scattered, buried in forums, or locked behind misleading paywalls. The result is frustration and wasted time.
                </p>
                <p className="text-lg text-secondary/70 leading-relaxed">
                  SelfWinner was built to close that gap. We connect genuine effort with tangible value, ensuring that learning rewards both the reader and the creator. We aren't just another file host; we are a curated environment where academic integrity meets accessibility.
                </p>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">JP</div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-500">AS</div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">MK</div>
                </div>
                <span className="text-sm text-slate-500 font-medium">Trusted by serious students</span>
              </div>
            </div>

            {/* Image Card */}
            <div className="reveal reveal-pop order-1 lg:order-2 relative group delay-200">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-slate-100 rounded-[2rem] transform rotate-2 opacity-50 transition-transform group-hover:rotate-3 duration-500"></div>
              <div className="relative rounded-[1.5rem] overflow-hidden shadow-2xl ring-1 ring-black/5 bg-white">
                <div className="aspect-[4/3] w-full bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[120px] opacity-20">school</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-xl border border-white/50 shadow-lg transform translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <div>
                      <h4 className="font-bold text-secondary text-sm">Verified Quality</h4>
                      <p className="text-xs text-secondary/70 mt-1">Every document is reviewed for clarity and relevance.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SelfWinner's Promise Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/80 via-white to-white -z-10"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="glass-panel rounded-[2rem] p-8 md:p-16 shadow-glow border border-white ring-1 ring-primary/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
            
            <div className="reveal text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading text-secondary mb-4">SelfWinner's Promise</h2>
              <p className="text-lg text-secondary/70 max-w-2xl mx-auto">A moral contract with every student. No fine print, just principles.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                { icon: 'hourglass_empty', title: 'Respect for Time', desc: 'We respect your time and money. Resources are vetted to ensure real academic value, not filler.' },
                { icon: 'shield_lock', title: 'Creator Protection', desc: 'Your intellectual property is safe here. We ensure creators get the credit and protection they deserve.' },
                { icon: 'visibility', title: 'Total Transparency', desc: 'No hidden downloads or misleading access. What you see is exactly what you get.' },
                { icon: 'gavel', title: 'Clear Rules', desc: 'Clear rules, clear pricing, clear usage. We operate with clarity so you never have to guess.' },
                { icon: 'school', title: 'Education First', desc: 'Education first, shortcuts never. We facilitate learning, not cheating. Authentic growth is priority.' },
                { icon: 'verified_user', title: 'No Misleading Ads', desc: 'A clean interface focused on your goal. No bait-and-switch tactics or aggressive popups.' }
              ].map((item, index) => (
                <div key={index} className={`reveal reveal-pop group p-6 rounded-2xl bg-white/50 border border-white/60 hover:bg-white hover:shadow-lg transition-all duration-300 ${index === 0 ? 'delay-100' : index === 1 ? 'delay-200' : index === 2 ? 'delay-300' : index === 3 ? 'delay-100' : index === 4 ? 'delay-200' : 'delay-300'}`}>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-secondary mb-2">{item.title}</h3>
                  <p className="text-sm text-secondary/70 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Secure Learning Experience Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="reveal mb-16 text-center lg:text-left">
            <h2 className="text-3xl font-heading text-secondary">Secure Learning Experience</h2>
            <p className="mt-4 text-secondary/70">How we keep the platform fair and safe.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', icon: 'lock_open', title: 'Secure Viewing', desc: 'Notes are accessed securely within our custom viewer. This ensures high fidelity without exposing source files to modification.' },
              { num: '02', icon: 'do_not_disturb_on', title: 'No Downloads', desc: 'To prevent mass distribution and unauthorized sharing, we do not permit direct file downloads. Content stays on the platform.' },
              { num: '03', icon: 'water_drop', title: 'Watermark Protection', desc: 'Dynamic, user-specific watermarking protects intellectual property and discourages external sharing, ensuring fair usage.' }
            ].map((item, index) => (
              <div key={index} className={`reveal relative group ${index === 0 ? 'delay-100' : index === 1 ? 'delay-200' : 'delay-300'}`}>
                <div className={`absolute inset-0 bg-white rounded-2xl transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} transition-transform group-hover:rotate-0`}></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-lg bg-secondary text-white flex items-center justify-center">
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <span className="text-4xl font-black text-slate-100 group-hover:text-primary/10 transition-colors">{item.num}</span>
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">{item.title}</h3>
                  <p className="text-secondary/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Responsibility Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="reveal text-center mb-16">
            <h2 className="text-3xl font-heading text-secondary">Trust & Responsibility</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'privacy_tip', title: 'Data Privacy', desc: 'User data is respected and strictly protected. We never sell your information to third parties.' },
              { icon: 'thumb_down', title: 'Misuse Discouraged', desc: 'We actively monitor for and discourage content misuse to maintain a healthy academic environment.' },
              { icon: 'balance', title: 'Community Guidelines', desc: 'Standards exist to ensure quality. This isn\'t just about rules; it\'s about building a space for serious students.' }
            ].map((item, index) => (
              <div key={index} className={`reveal reveal-pop glass-card p-8 rounded-2xl text-center group ${index === 0 ? 'delay-100' : index === 1 ? 'delay-200' : 'delay-300'}`}>
                <div className="w-14 h-14 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-bold text-secondary text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-secondary/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="reveal py-32 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <span className="material-symbols-outlined text-4xl text-primary mb-8 opacity-50 inline-block">format_quote</span>
          <h2 className="text-4xl md:text-6xl font-heading text-secondary tracking-tight leading-tight mb-8">
            SelfWinner is not loud.<br/> It is deliberate.
          </h2>
          <p className="text-lg text-secondary/70 font-medium mb-12">
            SelfWinner is not about quantity. It's about self-built growth, earned knowledge, and honest learning.
          </p>
          <button 
            onClick={() => navigate('/auth')}
            className="bg-secondary hover:bg-secondary/90 text-white font-bold py-4 px-10 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Join the Platform
          </button>
        </div>
      </section>

    </div>
  );
};

export default About;