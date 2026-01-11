import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Legal: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('privacy');

  // Handle hash navigation
  useEffect(() => {
    if (location.hash) {
      const section = location.hash.replace('#', '');
      setActiveSection(section);
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    navigate(`#${section}`);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-body overflow-x-hidden min-h-screen flex flex-col bg-background-light">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-purple-100 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <main className="relative z-10 flex-grow flex w-full justify-center py-10 px-4 md:px-10 pt-32">
        <div className="flex w-full max-w-[1200px] gap-12">
          {/* Sticky Sidebar (Table of Contents) */}
          <aside className="hidden lg:flex w-72 flex-col gap-6 sticky top-28 h-fit">
            <div className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="flex flex-col">
                <h1 className="text-secondary text-lg font-bold leading-normal">Table of Contents</h1>
                <p className="text-secondary/60 text-sm font-normal leading-normal">Jump to section</p>
              </div>
              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => handleNavClick('privacy')}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    activeSection === 'privacy'
                      ? 'bg-primary/10 text-primary border-l-4 border-primary'
                      : 'text-secondary/60 hover:bg-slate-50 hover:text-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">shield</span>
                  <span className="text-sm font-bold leading-normal">Privacy Policy</span>
                </button>
                <button
                  onClick={() => handleNavClick('terms')}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    activeSection === 'terms'
                      ? 'bg-primary/10 text-primary border-l-4 border-primary'
                      : 'text-secondary/60 hover:bg-slate-50 hover:text-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">description</span>
                  <span className="text-sm font-medium leading-normal">Terms & Conditions</span>
                </button>
                <button
                  onClick={() => handleNavClick('rules')}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    activeSection === 'rules'
                      ? 'bg-primary/10 text-primary border-l-4 border-primary'
                      : 'text-secondary/60 hover:bg-slate-50 hover:text-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">gavel</span>
                  <span className="text-sm font-medium leading-normal">Rules & Regulations</span>
                </button>
              </nav>
            </div>

            {/* Support Card */}
            <div className="p-6 bg-gradient-to-br from-primary/20 to-transparent rounded-xl border border-primary/20">
              <p className="font-bold text-secondary mb-2">Need legal help?</p>
              <p className="text-sm text-secondary/60 mb-4">Contact our support team for clarifications.</p>
              <button 
                onClick={() => navigate('/contact')}
                className="text-xs font-bold text-primary hover:underline"
              >
                Contact Support →
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 gap-10 min-w-0">
            {/* Page Heading */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-fit shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-slate-100 px-3 shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">update</span>
                  <p className="text-secondary/60 text-xs font-bold uppercase tracking-wide">Last Updated: December 2025</p>
                </div>
              </div>
                 <div className="absolute top-1/4 left-[-2%] rounded-2xl flex items-center justify-center opacity-80 p-3 animate-float-legal-delayed" style={{ width: '400px', height: '400px' }}>
      <img 
        src="/images/hammerlegalpg.png"
        alt="Legal hammer" 
        className="w-full h-full object-contain"
      />
    </div>
    <div className="absolute top-[2%] right-[15%] rounded-2xl flex items-center justify-center opacity-80 p-3" style={{ width: '300px', height: '300px', zIndex: -1 }}>
      <img 
        src="/images/handshklegalpg.png"
        alt="Legal heart" 
        className="w-full h-full object-contain"
      />
    </div>
    <div className="absolute bottom-[15%] left-[-3%] rounded-2xl flex items-center justify-center opacity-80 p-3 animate-float-legal" style={{ width: '400px', height: '400px', zIndex: 1 }}>
      <img 
        src="/images/warnlegalpg.png"
        alt="Legal heart" 
        className="w-full h-full object-contain"
      />
    </div>
              <h1 className="text-secondary text-4xl md:text-5xl font-heading leading-tight tracking-tight">Trust & Legal</h1>
              <p className="text-secondary/70 text-lg font-medium leading-relaxed max-w-2xl">
                Your safety, transparency, and trust are our top priority. Here is everything you need to know about how we operate to keep you winning.
              </p>
            </div>

            {/* Section 1: Privacy Policy */}
            <section className="scroll-mt-32" id="privacy">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                    <span className="material-symbols-outlined text-3xl">shield_person</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading text-secondary mb-2">Privacy Policy</h2>
                    <p className="text-secondary/70">We value your privacy and are committed to protecting your personal data.</p>
                  </div>
                </div>
                <div className="p-8 flex flex-col gap-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                      <h3 className="font-bold text-secondary flex items-center gap-2">
                        <span className="size-2 rounded-full bg-primary"></span>
                        What we collect
                      </h3>
                      <ul className="list-disc pl-6 space-y-2 text-secondary/70 text-sm leading-relaxed marker:text-primary">
                        <li><strong>Account Info:</strong> Name, email address, and profile preferences.</li>
                        <li><strong>Usage Data:</strong> Course progress, quiz scores, and interaction logs.</li>
                        <li><strong>Technical Data:</strong> IP address, browser type for security monitoring.</li>
                      </ul>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h3 className="font-bold text-secondary flex items-center gap-2">
                        <span className="size-2 rounded-full bg-primary"></span>
                        Why we collect it
                      </h3>
                      <ul className="list-disc pl-6 space-y-2 text-secondary/70 text-sm leading-relaxed marker:text-primary">
                        <li><strong>Personalization:</strong> To tailor course recommendations to your goals.</li>
                        <li><strong>Service Improvement:</strong> To fix bugs and enhance platform speed.</li>
                        <li><strong>Security:</strong> To prevent unauthorized access to your account.</li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Promise Box */}
                  <div className="bg-slate-50 rounded-lg p-5">
                    <h4 className="font-bold text-secondary mb-2 text-sm uppercase tracking-wide">Our Promise</h4>
                    <p className="text-secondary/70 text-sm leading-relaxed">
                      We <strong>never</strong> sell your data to third parties. Sensitive personal information not essential for the service is never collected. You have full control to request data deletion at any time via your Profile settings.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Terms & Conditions */}
            <section className="scroll-mt-32" id="terms">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-start gap-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl shrink-0">
                    <span className="material-symbols-outlined text-3xl">contract</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading text-secondary mb-2">Terms & Conditions</h2>
                    <p className="text-secondary/70">The rules of the road for using the SelfWinner platform.</p>
                  </div>
                </div>
                <div className="p-8 flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-gray-400 mt-1">person</span>
                      <div>
                        <h3 className="font-bold text-secondary text-lg">Single-User License</h3>
                        <p className="text-secondary/70 text-sm mt-1">Your account is for you alone. Sharing login credentials is strictly prohibited and may result in immediate suspension.</p>
                      </div>
                    </div>
                    <div className="w-full h-px bg-slate-100"></div>
                    <div className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-gray-400 mt-1">file_download_off</span>
                      <div>
                        <h3 className="font-bold text-secondary text-lg">Content Access</h3>
                        <p className="text-secondary/70 text-sm mt-1">All materials are view-only. Downloading, recording, or redistributing course content is a violation of intellectual property rights.</p>
                      </div>
                    </div>
                    <div className="w-full h-px bg-slate-100"></div>
                  </div>

                  {/* Alert Box for Payments */}
                  <div className="flex gap-4 p-4 rounded-lg bg-orange-50 border border-orange-100">
                    <span className="material-symbols-outlined text-orange-500 shrink-0">payments</span>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-bold text-orange-700 text-sm">Payments & Refunds</h4>
                      <p className="text-orange-600/80 text-xs leading-normal">
                        Please note that due to the digital nature of our content, all purchases are <strong>non-refundable</strong> once accessed. Please review course previews carefully before purchasing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Rules & Regulations */}
            <section className="scroll-mt-32" id="rules">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-start gap-4">
                  <div className="p-3 bg-teal-100 text-teal-600 rounded-xl shrink-0">
                    <span className="material-symbols-outlined text-3xl">balance</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading text-secondary mb-2">Rules & Regulations</h2>
                    <p className="text-secondary/70">Guidelines to ensure a fair and productive learning environment.</p>
                  </div>
                </div>
                <div className="p-8 flex flex-col gap-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-5 border border-slate-100 rounded-xl hover:border-teal-400 transition-colors group">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="material-symbols-outlined text-teal-500 group-hover:scale-110 transition-transform">school</span>
                        <h3 className="font-bold text-secondary">Academic Integrity</h3>
                      </div>
                      <p className="text-secondary/70 text-sm">No cheating on assessments. Collaborative learning is encouraged, but plagiarism and answer-sharing are prohibited.</p>
                    </div>
                    <div className="p-5 border border-slate-100 rounded-xl hover:border-teal-400 transition-colors group">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="material-symbols-outlined text-teal-500 group-hover:scale-110 transition-transform">diversity_3</span>
                        <h3 className="font-bold text-secondary">Community Conduct</h3>
                      </div>
                      <p className="text-secondary/70 text-sm">Respect fellow students and instructors. Hate speech, harassment, or disruptive behavior will not be tolerated.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-secondary text-sm uppercase tracking-wide">Penalty System</h3>
                    <div className="relative flex items-center justify-between w-full max-w-2xl mx-auto pt-6 pb-2">
                      {/* Line */}
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full"></div>
                      
                      {/* Step 1 */}
                      <div className="flex flex-col items-center gap-2 group cursor-default">
                        <div className="size-8 rounded-full bg-yellow-100 border-2 border-yellow-400 flex items-center justify-center text-yellow-600 shadow-sm group-hover:scale-110 transition-transform">
                          <span className="font-bold text-xs">1</span>
                        </div>
                        <span className="text-m font-bold text-secondary/60">Warning</span>
                      </div>

                      {/* Step 2 */}
                      <div className="flex flex-col items-center gap-2 group cursor-default">
                        <div className="size-8 rounded-full bg-orange-100 border-2 border-orange-400 flex items-center justify-center text-orange-600 shadow-sm group-hover:scale-110 transition-transform">
                          <span className="font-bold text-xs">2</span>
                        </div>
                        <span className="text-m font-bold text-secondary/60">Suspension</span>
                      </div>

                      {/* Step 3 */}
                      <div className="flex flex-col items-center gap-2 group cursor-default">
                        <div className="size-8 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center text-red-600 shadow-sm group-hover:scale-110 transition-transform">
                          <span className="font-bold text-xs">3</span>
                        </div>
                        <span className="text-m font-bold text-secondary/60">Permanent Ban</span>
                      </div>
                    </div>
                    <p className="text-center text-xs text-secondary/60 italic">Violations are reviewed manually by our trust & safety team.</p>
                  </div>
                </div>
              </div>
            </section>

           
          </div>
        </div>
      </main>
      <style>{`
      @keyframes float-legal {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      .animate-float-legal {
        animation: float-legal 7s ease-in-out infinite;
      }
      .animate-float-legal-delayed {
        animation: float-legal 7s ease-in-out 4s infinite;
      }
    `}</style>
    </div>
  );
};

export default Legal;