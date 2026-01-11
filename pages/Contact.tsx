import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    email: '',
    phone: '',
    message: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="font-body overflow-x-hidden min-h-screen flex flex-col bg-background-light">
      
      {/* Animation Styles */}
      <style>{`
        /* Scroll Reveal Animations */
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0); }
        
        /* Pop In */
        .reveal-pop { opacity: 0; transform: scale(0.8); transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .reveal-pop.active { opacity: 1; transform: scale(1); }

        /* Slide Right (for form) */
        .reveal-right { opacity: 0; transform: translateX(30px); transition: all 0.8s ease-out; }
        .reveal-right.active { opacity: 1; transform: translateX(0); }

        /* Slide Left (for contact cards) */
        .reveal-left { opacity: 0; transform: translateX(-30px); transition: all 0.8s ease-out; }
        .reveal-left.active { opacity: 1; transform: translateX(0); }

        /* Delays */
        .reveal.delay-100 { transition-delay: 0.1s; }
        .reveal.delay-200 { transition-delay: 0.2s; }
        .reveal.delay-300 { transition-delay: 0.3s; }

        /* Floating Animation */
        @keyframes float-box {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float-box {
          animation: float-box 7s ease-in-out infinite;
        }
      `}</style>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-100 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="w-full max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="reveal inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              Support & Inquiries
            </span>
            <h1 className="reveal delay-100 text-4xl md:text-5xl font-heading text-secondary tracking-tight leading-tight mb-4">
              Questions, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-primary">out of the box?</span> <br className="hidden md:block"/> We're here to help.
            </h1>
            <p className="reveal delay-200 text-lg text-secondary/70">
              Whether you need guidance on premium notes or have technical queries, our team is ready to assist you.
            </p>
            
            {/* Floating Box Image */}
            <div className="reveal reveal-pop absolute top-[14%] right-[20%] rounded-2xl flex items-center justify-center opacity-80 p-3 delay-300" style={{ width: '200px', height: '200px', zIndex: -1 }}>
              {/* Note: Moved animate-float-box to img to avoid conflict with reveal transform */}
              <img 
                src="/images/boxcontactpg.png"
                alt="Box Graphic" 
                className="w-full h-full object-contain animate-float-box"
              />
            </div>
          </div>

          {/* Contact Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            {/* Left Column: Contact Info Cards */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Email Card */}
              <a 
                href="mailto:support@selfwinner.com"
                className="reveal reveal-left group flex items-start gap-5 p-6 rounded-2xl bg-white border border-slate-100 shadow-soft hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                <div className="size-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors">Email Support</h3>
                  <p className="text-secondary/70 text-sm mb-1">For general inquiries & notes</p>
                  <span className="text-secondary font-semibold">support@selfwinner.com</span>
                </div>
                <div className="ml-auto text-slate-300 group-hover:text-primary transition-colors self-center">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </a>

              {/* WhatsApp Card */}
              <a 
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="reveal reveal-left delay-100 group flex items-start gap-5 p-6 rounded-2xl bg-white border border-slate-100 shadow-soft hover:shadow-lg hover:border-green-500/30 transition-all duration-300"
              >
                <div className="size-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">chat</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-secondary group-hover:text-green-500 transition-colors">WhatsApp Support</h3>
                  <p className="text-secondary/70 text-sm mb-1">Fastest response for students</p>
                  <span className="text-secondary font-semibold">COMING SOON</span>
                </div>
                <div className="ml-auto text-slate-300 group-hover:text-green-500 transition-colors self-center">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </a>

              {/* Operating Hours Card */}
              <div className="reveal reveal-left delay-200 flex items-start gap-5 p-6 rounded-2xl bg-white border border-slate-100 shadow-soft">
                <div className="size-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-secondary">Operating Hours</h3>
                  <p className="text-secondary/70 text-sm mb-2">Available for live support</p>
                  <div className="inline-flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">Everyday</span>
                    <span className="text-secondary text-sm font-semibold">24 x 7</span>
                  </div>
                </div>
              </div>

              {/* Trust/Social Proof */}
              <div className="reveal delay-300 mt-4 px-2 flex items-center gap-3 text-slate-400 text-sm">
                <div className="flex -space-x-2">
                  <div className="size-8 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  <div className="size-8 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-purple-600"></div>
                  <div className="size-8 rounded-full border-2 border-white bg-gradient-to-br from-pink-400 to-pink-600"></div>
                </div>
                <p>Trusted by <span className="font-bold text-secondary">10,000+</span> students</p>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="reveal reveal-right bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-slate-100 relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <h3 className="text-2xl font-heading text-secondary mb-6 relative z-10">Send us a message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <label className="block space-y-2">
                      <span className="text-sm font-semibold text-slate-700">Full Name</span>
                      <input 
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-secondary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                        placeholder="Enter your full name"
                      />
                    </label>

                    {/* College */}
                    <label className="block space-y-2">
                      <span className="text-sm font-semibold text-slate-700">College / University</span>
                      <input 
                        name="college"
                        type="text"
                        required
                        value={formData.college}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-secondary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                        placeholder="e.g. Delhi University"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <label className="block space-y-2">
                      <span className="text-sm font-semibold text-slate-700">Email Address</span>
                      <input 
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-secondary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                        placeholder="you@example.com"
                      />
                    </label>

                    {/* Phone */}
                    <label className="block space-y-2">
                      <span className="text-sm font-semibold text-slate-700">
                        Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                      </span>
                      <input 
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-secondary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                        placeholder="+91 90000 00000"
                      />
                    </label>
                  </div>

                  {/* Message */}
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">How can we help you?</span>
                    <textarea 
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-secondary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none transition-all" 
                      placeholder="Tell us about the notes you're looking for..." 
                      rows={4}
                    />
                  </label>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="hidden md:block text-xs text-slate-400">Usually replies within 2 hours.</span>
                    <button 
                      type="submit"
                      className="w-full md:w-auto px-8 h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg hover:shadow-glow transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <span>Send Message</span>
                      <span className="material-symbols-outlined text-lg">send</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;