import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Note, Bundle, FilterState, User } from '../types';
import { getNotes, getBundles } from '../services/notesService';
import { useNavigate } from 'react-router-dom';
import NoteCard from '../components/NoteCard';

interface HomeProps {
    user: User | null;
}

const Home: React.FC<HomeProps> = ({ user }) => {
    const navigate = useNavigate();

    // Data State
    const [notes, setNotes] = useState<Note[]>([]);
    const [bundles, setBundles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Filter State
    const [filter, setFilter] = useState<FilterState>({
        college: '',
        course: '',
        semester: '',
        subject: '',
        search: '',
        sort: 'newest'
    });

    // Infinite Scroll Observer
    const observer = useRef<IntersectionObserver | null>(null);
    const lastNoteElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Animation Observer
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, { threshold: 0.1 });

            const revealElements = document.querySelectorAll('.reveal, .reveal-pop');
            revealElements.forEach((el) => revealObserver.observe(el));

            return () => revealElements.forEach((el) => revealObserver.unobserve(el));
        }, 100);
        return () => clearTimeout(timeoutId);
    }, [bundles, notes]);

    // Initial Data
    useEffect(() => {
        const loadBundles = async () => {
            const b = await getBundles();
            setBundles(b);
        };
        loadBundles();
    }, []);

    // Fetch Notes on Filter Change
    useEffect(() => {
        setNotes([]);
        setPage(1);
        setHasMore(true);
        fetchNotes(1, filter, true);
    }, [filter]);

    // Fetch Notes on Page Change
    useEffect(() => {
        if (page > 1) {
            fetchNotes(page, filter, false);
        }
    }, [page]);

    const fetchNotes = async (pageNum: number, currentFilter: FilterState, reset: boolean) => {
        setLoading(true);
        try {
            const limit = 8;
            const newNotes = await getNotes(currentFilter, pageNum, limit);
            setNotes(prev => reset ? newNotes : [...prev, ...newNotes]);
            setHasMore(newNotes.length === limit);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const updateFilter = (key: keyof FilterState, value: string) => {
        setFilter(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="font-body overflow-x-hidden min-h-screen flex flex-col selection:bg-primary selection:text-white bg-white">
            
            {/* Custom Styles for Scroll Animations */}
            <style>{`
                /* Standard Fade Up Reveal */
                .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
                .reveal.active { opacity: 1; transform: translateY(0); }
                
                /* Bouncy Pop In Effect */
                .reveal-pop { 
                    opacity: 0; 
                    transform: scale(0.5); 
                    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy spring effect */
                }
                .reveal-pop.active { 
                    opacity: 1; 
                    transform: scale(1); 
                }
                
                /* Delays */
                .delay-100 { transition-delay: 0.1s; }
                .delay-200 { transition-delay: 0.2s; }
                .delay-300 { transition-delay: 0.3s; }
                .delay-500 { transition-delay: 0.5s; }
            `}</style>

            <main className="relative z-10 flex-grow pt-20 pb-20">

                {/* =====================================================================================
                    1. DESKTOP HERO SECTION 
                    (Only visible on lg+ screens)
                   ===================================================================================== */}
                <div className="hidden lg:block relative px-6 flex flex-col items-center text-center max-w-[1000px] mx-auto mb-20">
                    
                    {/* Background Blobs */}
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

                    {/* --- DESKTOP POPUP IMAGES --- */}
                    
                    {/* 1. Books (Left) */}
                    <div className="reveal-pop absolute top-1/4 left-[-34%] w-[700px] h-[700px] opacity-80 pointer-events-none" 
                         style={{ animation: 'float 7s ease-in-out 4s infinite' }}>
                        <img src="/images/booklandpg.png" alt="Books" className="w-full h-full object-contain" />
                    </div>

                    {/* 2. Pen (Right Bottom) - Delayed */}
                    <div className="reveal-pop delay-200 absolute top-[-42%] right-[-14%] w-[500px] h-[550px] z-10 opacity-80 pointer-events-none" 
                         style={{ animation: 'float 5s ease-in-out 3s infinite' }}>
                        <img src="/images/penlandpg.png" alt="Pen" className="w-full h-full object-contain" />
                    </div>

                    {/* 3. Rupee (Far Right Bottom) - More Delayed */}
                    <div className="reveal-pop delay-300 absolute bottom-[-140%] -left-[1%] w-[350px] h-[350px] opacity-80 z-10 pointer-events-none" 
                         style={{ animation: 'float 5s ease-in-out 3s infinite' }}>
                        <img src="/images/rupeelandpg.png" alt="Rupee" className="w-full h-full object-contain" />
                    </div>

                    {/* Desktop Content */}
                    <div className="reveal opacity-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-primary/20 text-xs font-bold text-secondary/70 mb-8 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Now supporting 50+ Top Universities
                    </div>
                    
                    <h1 className="reveal delay-100 opacity-0 text-7xl font-heading leading-tight mb-6 text-secondary drop-shadow-sm">
                        Master your studies with<br/>
                        <span className="text-primary relative inline-block">
                            premium
                            <svg className="absolute w-full h-3 bottom-1 left-0 text-primary/30 -z-10" preserveAspectRatio="none" viewBox="0 0 100 10">
                                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
                            </svg>
                        </span> notes.
                    </h1>
                    
                    <p className="reveal delay-200 opacity-0 text-xl text-secondary/70 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        The ultimate resource for college students. Access curated handwritten notes, previous year questions, and smart bundles designed to boost your GPA.
                    </p>
                    
                    <div className="reveal delay-300 opacity-0 flex gap-4 justify-center w-full">
                        <button onClick={() => document.getElementById('notes-section')?.scrollIntoView({ behavior: 'smooth'})} className="flex min-w-[180px] h-14 items-center justify-center rounded-xl bg-primary text-white text-lg font-bold shadow-xl shadow-primary/30 hover:shadow-2xl hover:bg-primary-hover hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300">
                            Find Notes
                        </button>
                        <button onClick={() => navigate('/auth')} className="flex min-w-[180px] h-14 items-center justify-center rounded-xl bg-white border-2 border-primary text-primary text-lg font-bold shadow-md hover:shadow-lg hover:bg-slate-50 hover:-translate-y-1 transition-all duration-300">
                            Join Free
                        </button>
                    </div>
                </div>


                {/* =====================================================================================
                    2. MOBILE & TABLET HERO SECTION 
                    (Only visible on small screens. Fixed visibility & added Popups)
                   ===================================================================================== */}
                <div className="block lg:hidden relative px-4 flex flex-col items-center text-center mx-auto mb-16 pt-10">
                    
                    {/* Mobile Background Blobs */}
                    <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[60px] pointer-events-none"></div>

                    {/* --- MOBILE POPUP IMAGES --- */}
                    
                    {/* 1. Books: Left side, slightly behind text */}
                    <div className="reveal-pop absolute top-[70%] left-[-20px]  h-[440px] opacity-70 pointer-events-none">
                        <img src="/images/booklandpg.png" alt="Books" className="w-full h-full object-contain" />
                    </div>

                    {/* 2. Pen: Top Right corner */}
                    <div className="reveal-pop delay-200 absolute top-[-10%] right-[-15px] w-[120px] opacity-90 pointer-events-none">
                        <img src="/images/penlandpg.png" alt="Pen" className="w-full h-full object-contain" />
                    </div>

                    {/* 3. Rupee: Bottom Right corner - FIXED VISIBILITY */}
                    {/* Changed bottom-[-170%] to -bottom-10 so it is actually visible */}
                    <div className="reveal-pop delay-300 absolute bottom-[-170%] right-[-10px] h-[200px] opacity-90 pointer-events-none z-10">
                        <img src="/images/rupeelandpg.png" alt="Rupee" className="w-full h-full object-contain" />
                    </div>







                    {/* Mobile Content */}
                    <div className="z-10 relative">
                        <div className="reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-primary/20 text-[10px] font-bold text-secondary/70 mb-6 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            50+ Universities Supported
                        </div>

                        <h1 className="reveal text-4xl font-heading leading-tight mb-4 text-secondary">
                            Master your studies with <span className="text-primary">premium</span> notes.
                        </h1>

                        <p className="reveal delay-100 text-base text-secondary/70 mb-8 leading-relaxed px-2">
                            Access curated handwritten notes, PYQs, and smart bundles designed to boost your GPA.
                        </p>

                        <div className="reveal delay-200 flex flex-col w-full gap-3 px-2">
                            <button onClick={() => document.getElementById('notes-section')?.scrollIntoView({ behavior: 'smooth'})} className="flex w-full h-12 items-center justify-center rounded-xl bg-primary text-white text-base font-bold shadow-lg">
                                Find Notes
                            </button>
                            <button onClick={() => navigate('/auth')} className="flex w-full h-12 items-center justify-center rounded-xl bg-white border border-primary text-primary text-base font-bold shadow-sm">
                                Join Free
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <section className="reveal px-6 mb-28 w-full">
                    <div className="max-w-4xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-blue-400/40 to-primary/40 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                        <div className="relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-3 shadow-2xl flex flex-col md:flex-row gap-3">
                            <div className="flex-1 flex items-center bg-slate-50 rounded-xl border border-slate-200 h-14 md:h-16 px-4 group-focus-within:border-primary transition-colors focus-within:ring-2 focus-within:ring-primary/20">
                                <span className="material-symbols-outlined text-primary mr-3 text-2xl">search</span>
                                <input
                                    className="w-full bg-transparent border-none outline-none text-secondary placeholder-slate-400 font-medium text-base md:text-lg h-full focus:ring-0 p-0"
                                    placeholder="Search for Physics, CS-101, or IIT Delhi..."
                                    type="text"
                                    value={filter.search}
                                    onChange={(e) => updateFilter('search', e.target.value)}
                                />
                            </div>

                            <div className="hidden md:flex gap-2 items-center pr-2">
                                <button className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-secondary text-sm font-bold hover:border-primary hover:text-primary transition-all flex items-center gap-2 shadow-sm">
                                    College <span className="material-symbols-outlined text-[18px]">expand_more</span>
                                </button>
                                <button className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-secondary text-sm font-bold hover:border-primary hover:text-primary transition-all flex items-center gap-2 shadow-sm">
                                    Course <span className="material-symbols-outlined text-[18px]">expand_more</span>
                                </button>
                            </div>
                        </div>

                        {/* Mobile Filters */}
                        <div className="flex md:hidden gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                            <select
                                className="flex-shrink-0 h-10 px-4 rounded-lg bg-white border border-slate-200 text-secondary text-sm font-bold shadow-sm whitespace-nowrap"
                                value={filter.college}
                                onChange={(e) => updateFilter('college', e.target.value)}
                            >
                                <option value="">All Colleges</option>
                            </select>
                            <select
                                className="flex-shrink-0 h-10 px-4 rounded-lg bg-white border border-slate-200 text-secondary text-sm font-bold shadow-sm whitespace-nowrap"
                                value={filter.course}
                                onChange={(e) => updateFilter('course', e.target.value)}
                            >
                                <option value="">All Courses</option>
                                <option value="B.Tech">B.Tech</option>
                                <option value="B.Sc">B.Sc</option>
                                <option value="MBA">MBA</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Why SelfWinner Section */}
                <section className="max-w-7xl mx-auto px-6 mb-20">
                    <div className="flex flex-col md:flex-row gap-16 items-start">
                        <div className="reveal md:w-1/3 sticky top-32 self-start">
                            <h2 className="text-3xl md:text-4xl font-heading mb-6 tracking-tight text-secondary">
                                Why <span className="text-primary">SelfWinner</span>?
                            </h2>
                            <p className="text-secondary/70 text-lg leading-relaxed mb-8 font-medium">
                                Everything you need to ace your exams in one ecosystem. We've digitized the topper experience with a premium touch.
                            </p>
                            <div className="hidden md:block w-20 h-2 bg-primary rounded-full"></div>
                        </div>

                        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: 'edit_note', title: 'Handwritten Notes', desc: 'Curated notes from university toppers, digitized and enhanced for perfect clarity on any device.' },
                                { icon: 'quiz', title: 'Exam-Ready PYQs', desc: 'Comprehensive previous year questions organized by unit and difficulty to test your skills.' },
                                { icon: 'inventory_2', title: 'Smart Bundles', desc: "Don't know where to start? Grab an all-in-one pack designed to cover entire syllabus units in one go." },
                                { icon: 'encrypted', title: 'Secure Viewing', desc: 'Proprietary DRM protected viewing ensures exclusive content access and quality integrity for creators.' }
                            ].map((item, idx) => (
                                <div key={idx} className={`reveal reveal-pop group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden ${idx % 2 === 0 ? 'delay-100' : 'delay-200'}`}>
                                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                                    <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner">
                                        <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-secondary">{item.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bundles Section */}
                {bundles.length > 0 && (
                    <section className="reveal max-w-7xl mx-auto px-6 mb-24">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-secondary">Value Bundles</h2>
                                <p className="text-secondary/70 mt-2 text-sm md:text-base">Get everything you need for the semester.</p>
                            </div>
                            <button className="text-primary font-bold hover:underline">View All</button>
                        </div>

                        <div className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar">
                            {bundles.map((bundle, index) => (
                                <div key={bundle._id || index} className={`reveal reveal-pop min-w-[300px] md:min-w-[350px] bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden snap-center flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${index === 0 ? 'delay-100' : index === 1 ? 'delay-200' : 'delay-300'}`}>
                                    <div className="h-32 bg-gradient-to-r from-primary to-blue-700 relative p-6 flex flex-col justify-between">
                                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full w-fit">
                                            {bundle.noteIds?.length || 0} Notes
                                        </span>
                                        <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4">
                                            <span className="material-symbols-outlined text-8xl text-white">inventory_2</span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col">
                                        <h3 className="font-bold text-xl text-secondary mb-2">{bundle.title}</h3>
                                        <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-2">{bundle.description}</p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-2xl font-bold text-secondary">₹{bundle.price}</span>
                                            <button
                                                onClick={() => navigate(`/bundle/${bundle._id}`)}
                                                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors shadow-md"
                                            >
                                                View Pack
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Mission Statement Section */}
                <section className="reveal w-full px-4 md:px-8 py-12 md:py-20 flex justify-center bg-white border-t border-slate-200">
                    <div className="max-w-4xl text-center flex flex-col items-center gap-6">
                        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wide uppercase">
                            Our Mission
                        </div>
                        <h2 className="text-3xl md:text-5xl font-heading leading-tight tracking-tight text-secondary">
                            More than a marketplace.<br />
                            <span className="text-primary">A student revolution.</span>
                        </h2>
                        <p className="text-slate-500 text-lg md:text-xl max-w-2xl font-medium">
                            SelfWinner connects top-tier note-takers with students hungry for success. We are building India's largest peer-to-peer academic library.
                        </p>
                    </div>
                </section>

                {/* Core Value Props Section */}
                <section className="w-full px-4 md:px-8 py-10 md:py-16 bg-slate-50">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
                            {/* Left: Description */}
                            <div className="reveal flex-1 flex flex-col gap-6 lg:sticky lg:top-24">
                                <h3 className="text-2xl md:text-4xl font-heading leading-tight text-secondary">
                                    Democratizing<br />Academic Success
                                </h3>
                                <p className="text-slate-600 text-base leading-relaxed">
                                    Every semester, thousands of hours of hard work go unnoticed. We're changing that. By bridging the gap between those who create high-quality study materials and those who need them, we create value for everyone.
                                </p>
                                <div className="flex gap-4 mt-4">
                                    <div className="flex -space-x-3">
                                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-600"></div>
                                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-purple-600"></div>
                                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-pink-400 to-pink-600"></div>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="text-sm font-bold text-secondary">2,000+ Students</span>
                                        <span className="text-xs text-slate-500">Joined last month</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Cards Grid */}
                            <div className="flex-[1.5] w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {/* Card 1 */}
                                <div className="reveal reveal-pop card-hover col-span-1 md:col-span-2 p-6 rounded-2xl bg-white border border-slate-100 shadow-soft">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                        <span className="material-symbols-outlined text-3xl">emoji_events</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-secondary mb-2">Quality First</h4>
                                    <p className="text-slate-500">
                                        Curated notes from university toppers. We verify every upload to ensure you get the best material to ace your exams.
                                    </p>
                                </div>
                                {/* Card 2 */}
                                <div className="reveal reveal-pop delay-100 card-hover p-6 rounded-2xl bg-white border border-slate-100 shadow-soft">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                        <span className="material-symbols-outlined text-3xl">bolt</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-secondary mb-2">Instant Access</h4>
                                    <p className="text-slate-500">
                                        Download PYQs and bundles in seconds. No waiting, just learning.
                                    </p>
                                </div>
                                {/* Card 3 */}
                                <div className="reveal reveal-pop delay-200 card-hover p-6 rounded-2xl bg-white border border-slate-100 shadow-soft">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                        <span className="material-symbols-outlined text-3xl">currency_rupee</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-secondary mb-2">Passive Income</h4>
                                    <p className="text-slate-500">
                                        Turn your hard work into monthly earnings. Monetize your notes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Ecosystem Section */}
                <section className="w-full px-4 md:px-8 py-16 md:py-24 bg-white overflow-hidden">
                    <div className="max-w-[1000px] mx-auto">
                        <div className="reveal text-center mb-16">
                            <h3 className="text-3xl md:text-5xl font-heading text-secondary mb-4">The Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-primary">Ecosystem</span></h3>
                            <p className="text-slate-500 max-w-xl mx-auto">
                                See how knowledge flows from creators to learners in a seamless cycle of growth and reward.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                            {/* Connector Icon (Desktop) */}
                            <div className="reveal reveal-pop hidden md:block absolute top-1/2 left-[48%] -translate-x-1/2 -translate-y-1/2 z-10">
                                <div className="w-12 h-12 bg-white rounded-full border-4 border-primary flex items-center justify-center shadow-glow">
                                    <span className="material-symbols-outlined text-primary font-bold">sync_alt</span>
                                </div>
                            </div>

                            {/* Left Side: Creator */}
                            <div className="reveal group relative flex flex-col gap-4">
                                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] shadow-lg bg-gradient-to-br from-blue-100 to-blue-200">
                                    {/* Responsive Floating Image */}
                                    <div className="absolute top-[-30%] left-[-20%] w-[150%] h-[150%] opacity-80" style={{ animation: 'float 7s ease-in-out 4s infinite' }}>
                                        <img
                                            src="/images/creatorlandpg.png"
                                            alt="Creator"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="w-full h-full flex items-center justify-center relative z-0">
                                    </div>
                                    <div className="absolute bottom-6 left-6 z-20">
                                        <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">Upload & Earn</span>
                                        <h4 className="text-white text-2xl font-bold">Note Creator</h4>
                                    </div>
                                </div>
                                <p className="text-slate-600 text-sm md:text-base pl-2 border-l-4 border-primary/30">
                                    Uploads high-quality study materials, sets the price, and earns revenue every time a student downloads their work.
                                </p>
                            </div>

                            {/* Right Side: Learner */}
                            <div className="reveal delay-100 group relative flex flex-col gap-4">
                                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] shadow-lg bg-gradient-to-br from-purple-100 to-purple-200">
                                    {/* Responsive Floating Image */}
                                    <div className="absolute top-[-30%] left-[-20%] w-[150%] h-[150%] opacity-80" style={{ animation: 'float 7s ease-in-out 4s infinite' }}>
                                        <img
                                            src="/images/learnerlandpg.png"
                                            alt="Learner"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="w-full h-full flex items-center justify-center relative z-0">
                                    </div>
                                    <div className="absolute bottom-6 left-6 z-20">
                                        <span className="bg-white text-secondary text-xs font-bold px-2 py-1 rounded mb-2 inline-block">Download & Learn</span>
                                        <h4 className="text-white text-2xl font-bold">Note Learner</h4>
                                    </div>
                                </div>
                                <p className="text-slate-600 text-sm md:text-base pl-2 border-l-4 border-gray-200">
                                    Discovers premium resources, downloads instantly, and aces exams with better preparation material.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="reveal w-full px-4 py-20 bg-white flex flex-col items-center">
                    <div className="max-w-2xl text-center flex flex-col gap-6">
                        <h2 className="text-3xl font-heading text-secondary">Ready to join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-primary">revolution?</span></h2>
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate('/about')}
                                className="group flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-lg font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-glow transform hover:-translate-y-1"
                            >
                                <span>Read Our Story</span>
                                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;