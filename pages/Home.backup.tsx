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
  const [bundles, setBundles] = useState<Bundle[]>([]);
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

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      document.getElementById('notes-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
      setFilter(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="font-body overflow-x-hidden min-h-screen flex flex-col selection:bg-primary selection:text-white bg-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 flex-grow pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative px-6 flex flex-col items-center text-center max-w-[1000px] mx-auto mb-20">
          <div className="opacity-0 animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-primary/20 text-xs font-bold text-secondary/70 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Now supporting 50+ Top Universities
          </div>
          
          <h1 className="opacity-0 animate-fade-up text-5xl md:text-7xl font-heading leading-tight mb-6 text-secondary drop-shadow-sm">
            Master your studies with<br/>
            <span className="text-primary relative inline-block">
              premium
              <svg className="absolute w-full h-3 bottom-1 left-0 text-primary/30 -z-10" preserveAspectRatio="none" viewBox="0 0 100 10">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
              </svg>
            </span> notes.
          </h1>
          
          <p className="opacity-0 animate-fade-up-delay text-lg md:text-xl text-secondary/70 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            The ultimate resource for college students. Access curated handwritten notes, previous year questions, and smart bundles designed to boost your GPA.
          </p>
          
          <div className="opacity-0 animate-fade-up-delay flex flex-wrap gap-4 justify-center w-full">
            <button 
              onClick={() => document.getElementById('notes-section')?.scrollIntoView({ behavior: 'smooth'})}
              className="flex min-w-[180px] h-14 items-center justify-center rounded-xl bg-primary text-white text-lg font-bold shadow-xl shadow-primary/30 hover:shadow-2xl hover:bg-primary-hover hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
            >
              Find Notes
            </button>
            <button 
              onClick={() => navigate('/auth')}
              className="flex min-w-[180px] h-14 items-center justify-center rounded-xl bg-white border-2 border-primary text-primary text-lg font-bold shadow-md hover:shadow-lg hover:bg-slate-50 hover:-translate-y-1 transition-all duration-300"
            >
              Join Free
            </button>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-[-10%] w-24 h-24 bg-primary/20 rounded-3xl rotate-12 blur-sm animate-pulse hidden xl:block"></div>
          <div className="absolute top-1/3 right-[-5%] w-16 h-16 bg-blue-400/20 rounded-full blur-sm hidden xl:block"></div>
        </section>

        {/* Search Bar */}
        <section className="px-6 mb-28 w-full">
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
            <div className="md:w-1/3 sticky top-32 self-start">
              <h2 className="text-3xl md:text-4xl font-heading mb-6 tracking-tight text-secondary">
                Why <span className="text-primary">SelfWinner</span>?
              </h2>
              <p className="text-secondary/70 text-lg leading-relaxed mb-8 font-medium">
                Everything you need to ace your exams in one ecosystem. We've digitized the topper experience with a premium touch.
              </p>
              <div className="hidden md:block w-20 h-2 bg-primary rounded-full"></div>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">edit_note</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-secondary">Handwritten Notes</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  Curated notes from university toppers, digitized and enhanced for perfect clarity on any device.
                </p>
              </div>
              
              <div className="group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">quiz</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-secondary">Exam-Ready PYQs</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  Comprehensive previous year questions organized by unit and difficulty to test your skills before the big day.
                </p>
              </div>
              
              <div className="group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">inventory_2</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-secondary">Smart Bundles</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  Don't know where to start? Grab an all-in-one pack designed to cover entire syllabus units in one go.
                </p>
              </div>
              
              <div className="group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">encrypted</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-secondary">Secure Viewing</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  Proprietary DRM protected viewing ensures exclusive content access and quality integrity for creators.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bundles Section */}
        {bundles.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 mb-24">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-secondary">Value Bundles</h2>
                <p className="text-secondary/70 mt-2">Get everything you need for the semester.</p>
              </div>
              <button className="text-primary font-bold hover:underline">View All</button>
            </div>
            
            <div className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar">
              {bundles.map(bundle => (
                <div key={bundle.id} className="min-w-[300px] md:min-w-[350px] bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden snap-center flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="h-32 bg-gradient-to-r from-primary to-blue-700 relative p-6 flex flex-col justify-between">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full w-fit">
                      {bundle.noteIds.length} Notes
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
                        onClick={() => navigate(`/bundle/${bundle.id}`)}
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

        {/* Notes Grid Section */}
        <section id="notes-section" className="max-w-7xl mx-auto px-6 mb-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-secondary">Latest Uploads</h2>
              <p className="text-secondary/70">Fresh notes added this week.</p>
            </div>
            <select 
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-primary"
              value={filter.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
            </select>
          </div>

          {loading && page === 1 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 h-80 animate-pulse">
                  <div className="bg-slate-200 h-40 w-full rounded-lg mb-4"></div>
                  <div className="bg-slate-200 h-4 w-3/4 rounded mb-2"></div>
                  <div className="bg-slate-200 h-4 w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">search_off</span>
              <h3 className="text-xl font-bold text-secondary">No notes found</h3>
              <p className="text-secondary/70">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {notes.map((note, index) => {
                if (notes.length === index + 1) {
                  return (
                    <div ref={lastNoteElementRef} key={note.id}>
                      <NoteCard note={note} onView={(n) => navigate(`/note/${n.id}`)} onBuy={(n) => navigate(`/note/${n.id}`)} />
                    </div>
                  );
                }
                return <NoteCard key={note.id} note={note} onView={(n) => navigate(`/note/${n.id}`)} onBuy={(n) => navigate(`/note/${n.id}`)} />;
              })}
            </div>
          )}

          {loading && page > 1 && (
            <div className="text-center mt-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </section>

        {/* Trust Section */}
        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-secondary/60">
              <span className="material-symbols-outlined text-[20px] text-primary">verified_user</span>
              <span className="text-sm font-semibold">Trusted by students from 120+ colleges</span>
            </div>
            <div className="flex gap-8">
              <a className="text-secondary/60 hover:text-primary transition-colors text-sm font-semibold" href="#">Privacy</a>
              <a className="text-secondary/60 hover:text-primary transition-colors text-sm font-semibold" href="#">Terms</a>
              <a className="text-secondary/60 hover:text-primary transition-colors text-sm font-semibold" href="#">Contact</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;