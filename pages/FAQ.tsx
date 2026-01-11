import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type FAQCategory = 'all' | 'account' | 'content' | 'payments' | 'search' | 'security' | 'support' | 'rules';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: FAQCategory[];
}

const FAQ: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('all');
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    // Account & Access
    {
      id: 1,
      question: "Do I need to create an account to use SelfWinner?",
      answer: "Yes. You must sign up and log in to access notes, view PDFs, purchase content, or manage your profile.",
      category: ['all', 'account']
    },
    {
      id: 2,
      question: "Can I use the same account on multiple devices?",
      answer: "Currently, yes. In future, device-lock security may be introduced for better content protection.",
      category: ['all', 'account']
    },
    {
      id: 3,
      question: "I forgot my password. What should I do?",
      answer: "Use the 'Forgot Password' option on the login page to reset your password via email.",
      category: ['all', 'account']
    },
    {
      id: 4,
      question: "Is my personal data safe?",
      answer: "Yes. We do not sell data, do not ask for phone numbers, and securely store your information using encryption.",
      category: ['all', 'account']
    },

    // Notes, PYQs & Content
    {
      id: 5,
      question: "Are the notes downloadable?",
      answer: "❌ No. Notes are view-only and can be accessed securely through our online PDF viewer.",
      category: ['all', 'content']
    },
    {
      id: 6,
      question: "Why can't I download the PDF?",
      answer: "To protect creators' hard work, prevent piracy and unfair sharing, and keep prices low for everyone. This ensures a fair academic ecosystem.",
      category: ['all', 'content']
    },
    {
      id: 7,
      question: "Can I view notes offline?",
      answer: "No. An active internet connection is required to access notes securely.",
      category: ['all', 'content']
    },
    {
      id: 8,
      question: "What happens if my internet disconnects while reading?",
      answer: "You may continue viewing already-loaded pages briefly, but full access requires reconnection.",
      category: ['all', 'content']
    },
    {
      id: 9,
      question: "Are notes specific to my college and syllabus?",
      answer: "Yes. Notes and PYQs are categorized by College, Course, Semester, and Subject. So you study exactly what matters.",
      category: ['all', 'content']
    },
    {
      id: 10,
      question: "Who uploads the notes?",
      answer: "Currently: Admin (SelfWinner). Later: Verified student creators and teachers. Every note goes through quality checks.",
      category: ['all', 'content']
    },

    // Payments & Purchases
    {
      id: 11,
      question: "Are free notes really free?",
      answer: "Yes. Free notes can be accessed without payment after login.",
      category: ['all', 'payments']
    },
    {
      id: 12,
      question: "How do paid notes work?",
      answer: "Click 'Buy for ₹X', complete payment via Razorpay, and access the note instantly after payment.",
      category: ['all', 'payments']
    },
    {
      id: 13,
      question: "Is payment safe?",
      answer: "Yes. All payments are handled via Razorpay, a trusted and secure payment gateway.",
      category: ['all', 'payments']
    },
    {
      id: 14,
      question: "Can I get a refund after purchasing a note?",
      answer: "No. Since notes are digital and instantly accessible, refunds are not supported.",
      category: ['all', 'payments']
    },
    {
      id: 15,
      question: "What are bundles?",
      answer: "Bundles are multiple related notes combined at a discounted price (e.g., BCA Semester 1 Full Pack).",
      category: ['all', 'payments']
    },
    {
      id: 16,
      question: "If I buy a bundle, do I get access to all notes inside it?",
      answer: "Yes. Once purchased, all notes in the bundle become accessible.",
      category: ['all', 'payments']
    },

    // Search & Discovery
    {
      id: 17,
      question: "How can I find notes quickly?",
      answer: "Use the search bar and filters: College, Course, Semester, Subject.",
      category: ['all', 'search']
    },
    {
      id: 18,
      question: "What are PYQs?",
      answer: "PYQs = Previous Year Question Papers, useful for exam pattern understanding and revision.",
      category: ['all', 'search']
    },

    // PDF Viewer & Security
    {
      id: 19,
      question: "Why do I see my name/email on the PDF?",
      answer: "That's a watermark, added for security, personal identification, and preventing misuse.",
      category: ['all', 'security']
    },
    {
      id: 20,
      question: "Can I take screenshots?",
      answer: "Basic protection is enabled, but screenshots may still be technically possible. Misuse is tracked and penalized. Please respect academic ethics.",
      category: ['all', 'security']
    },
    {
      id: 21,
      question: "Can I highlight or write on PDFs?",
      answer: "Not yet. Annotation tools may be added in future versions.",
      category: ['all', 'security']
    },

    // Admin & Support
    {
      id: 22,
      question: "Who manages the platform?",
      answer: "SelfWinner is independently built and managed by few student developers.",
      category: ['all', 'support']
    },
    {
      id: 23,
      question: "How can I contact support?",
      answer: "Use: Help & Support section, Feedback / Suggestion form, or Bug report option.",
      category: ['all', 'support']
    },
    {
      id: 24,
      question: "I found an error in a note. What should I do?",
      answer: "Use 'Something missing in the notes?' option to report it. Genuine reports help improve quality.",
      category: ['all', 'support']
    },
    {
      id: 25,
      question: "Will my feedback actually be read?",
      answer: "Yes. All feedback is manually reviewed and taken seriously.",
      category: ['all', 'support']
    },

    // Rules & Usage
    {
      id: 26,
      question: "Can I share notes with friends?",
      answer: "No. Sharing, recording, or reselling content is strictly prohibited.",
      category: ['all', 'rules']
    },
    {
      id: 27,
      question: "What happens if someone misuses the platform?",
      answer: "A 3-strike system is followed: 1. Warning, 2. Temporary restriction, 3. Permanent ban.",
      category: ['all', 'rules']
    },
    {
      id: 28,
      question: "Is this platform like Unacademy or Byju's?",
      answer: "No. SelfWinner focuses on: College-specific notes, Student-to-student learning, and Practical exam preparation.",
      category: ['all', 'rules']
    },
    {
      id: 29,
      question: "Will more features be added later?",
      answer: "Yes. Future upgrades will be done. Stay tuned!",
      category: ['all', 'support']
    },
    {
      id: 30,
      question: "Why is SelfWinner different?",
      answer: "Because it is: Built by students, Designed for real college problems, Honest, transparent, and fair.",
      category: ['all', 'support']
    }
  ];

  const categories = [
    { id: 'all', label: 'All', icon: 'grid_view' },
    { id: 'account', label: 'Account & Access', icon: 'account_circle' },
    { id: 'content', label: 'Notes & Content', icon: 'description' },
    { id: 'payments', label: 'Payments', icon: 'payments' },
    { id: 'search', label: 'Search', icon: 'search' },
    { id: 'security', label: 'Security', icon: 'shield' },
    { id: 'support', label: 'Support', icon: 'support_agent' },
    { id: 'rules', label: 'Rules', icon: 'gavel' }
  ];

  const filteredFaqs = faqs.filter(faq => 
    activeCategory === 'all' || faq.category.includes(activeCategory)
  );

  const toggleAccordion = (id: number) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="font-body overflow-x-hidden min-h-screen flex flex-col bg-background-light">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-100 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <main className="relative z-10 flex-grow pt-32 pb-20">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-secondary text-xs font-bold uppercase tracking-wider mb-4">
              Support Center
            </span>
            <h1 className="text-4xl md:text-5xl font-heading text-secondary mb-6 leading-tight">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Questions</span>
            </h1>
            <p className="text-lg text-secondary/70 max-w-2xl mx-auto leading-relaxed">
              Have questions about refunds, access, or how to become a creator on SelfWinner? We've got you covered.
            </p>
             <div className="absolute top-[-1%] right-[10%] rounded-2xl flex items-center justify-center opacity-80 p-3" style={{ width: '300px', height: '300px', animation: 'float 8s ease-in-out 4s infinite', zIndex: -1 }}>
  <img 
    src="/images/qmarkfaqpg.png"
    alt="Verification badge" 
    className="w-full h-full object-contain"
  />
</div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex justify-center mb-12 overflow-x-auto no-scrollbar">
            <div className="inline-flex flex-wrap justify-center gap-3 p-2 bg-white rounded-2xl shadow-soft border border-slate-100">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as FAQCategory)}
                  className={`px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    activeCategory === cat.id
                      ? 'bg-primary text-white shadow-sm scale-105'
                      : 'bg-transparent hover:bg-slate-50 text-slate-600 hover:text-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                  <span className="hidden sm:inline">{cat.label}</span>
                  <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Counter */}
          <div className="text-center mb-6">
            <p className="text-sm text-secondary/60">
              Showing <span className="font-bold text-primary">{filteredFaqs.length}</span> questions
            </p>
          </div>

          {/* Accordion List */}
          <div className="flex flex-col gap-5">
            {filteredFaqs.map(faq => (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 ${
                  openAccordion === faq.id ? 'shadow-soft' : ''
                }`}
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="flex cursor-pointer items-center justify-between gap-4 p-6 w-full text-left"
                >
                 <h3 className="text-xl text-secondary text-base font-light leading-snug hover:text-primary-hover transition-colors">
  {faq.question}
</h3>
                  <div className={`flex items-center justify-center shrink-0 size-10 rounded-full bg-slate-50 hover:bg-primary/20 transition-all ${
                    openAccordion === faq.id ? 'bg-primary/20' : ''
                  }`}>
                    <span className="material-symbols-outlined text-secondary transition-transform">
                      {openAccordion === faq.id ? 'remove' : 'add'}
                    </span>
                  </div>
                </button>
                
                {openAccordion === faq.id && (
                  <div className="px-6 pb-6 pt-0 animate-fade-up">
                    <p className="text-secondary/70 text-xl leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-20">
            <div className="relative overflow-hidden rounded-3xl bg-secondary p-10 md:p-14 text-center">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-primary/20 to-transparent"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[80px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="size-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">support_agent</span>
                </div>
                <h2 className="text-3xl font-heading text-white mb-4">Still have questions?</h2>
                <p className="text-slate-300 max-w-lg mb-8 text-lg">
                  Can't find the answer you're looking for? Chat with our student success team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <button 
                    onClick={() => navigate('/contact')}
                    className="flex items-center justify-center gap-2 rounded-xl h-12 px-8 bg-primary hover:bg-primary-hover text-white font-bold transition-all shadow-glow"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                    Chat with Support
                  </button>
                  <button 
                    onClick={() => window.location.href = 'mailto:support@selfwinner.com'}
                    className="flex items-center justify-center gap-2 rounded-xl h-12 px-8 bg-white/10 hover:bg-white/20 text-white font-bold transition-all backdrop-blur-sm border border-white/10"
                  >
                    Email Us
                  </button>
                </div>
              </div>
            </div>
          </div>

         
        </div>
      </main>

      {/* Custom Styles */}
      <style>       
        {`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default FAQ;