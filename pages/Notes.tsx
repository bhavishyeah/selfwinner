import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes } from '../services/notesService';
import authService from '../services/authService';

interface Note {
  _id: string;
  title: string;
  description: string;
  college: string;
  course: string;
  semester: string;
  subject: string;
  price: number;
  hasAccess?: boolean;
  views: number;
  purchases: number;
}

const Notes: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    college: '',
    course: '',
    semester: '',
    subject: '',
    search: '',
    sort: 'newest' as 'newest' | 'price-low' | 'price-high',
    free: undefined as boolean | undefined
  });

  const isAdmin = authService.isAdmin();

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

      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach((el) => revealObserver.observe(el));
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [loading, notes]);

  useEffect(() => {
    loadNotes();
  }, [filters]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await getNotes(filters);
      setNotes(data);
    } catch (error) {
      console.error('Load notes error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewNote = (noteId: string) => {
    navigate(`/notes/${noteId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 overflow-x-hidden">
      
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0); }
        .reveal-pop { opacity: 0; transform: scale(0.9); transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .reveal-pop.active { opacity: 1; transform: scale(1); }
        .reveal.delay-100 { transition-delay: 0.1s; }
        .reveal.delay-200 { transition-delay: 0.2s; }
        
        /* Floating animation keyframes - Fixed Rotation at 10deg */
        @keyframes float {
          0% { transform: translateY(0px) rotate(10deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
          100% { transform: translateY(0px) rotate(10deg); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 relative">
        
        {/* --- LEFT SIDE: IMAGE BACKGROUND --- */}
        <div 
            className="absolute top-[-75%] lg:left-[-71%] pointer-events-none z-0 hidden md:block" 
            style={{ 
              width: '1400px', 
              height: '1400px', 
              // REMOVED the '4s' delay. Now it's just Duration | Easing | Infinite
              animation: 'float 7s ease-in-out infinite',
              // Added will-change for smoother rendering performance
              willChange: 'transform'
            }}
        >
          <img 
            src="/images/notesnotepg.png"
            alt="Decoration" 
            className="w-full h-full object-contain opacity-100"
          />
        </div>

        {/* --- RIGHT SIDE: CONTENT WRAPPER --- */}
        <div className="w-full lg:w-[85%] lg:ml-auto relative z-10">

            {/* Header */}
            <div className="reveal flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-bold text-gray-900">Browse Notes</h1>
                <p className="text-gray-600 mt-2">Find the perfect study materials for your courses</p>
            </div>
            <div className="flex gap-3">
                <button
                onClick={() => navigate('/bundles')}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg flex items-center"
                >
                <i className="fas fa-box mr-2"></i>
                View Bundles
                </button>
                {isAdmin && (
                <button
                    onClick={() => navigate('/admin')}
                    className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-lg"
                >
                    <i className="fas fa-plus mr-2"></i>
                    Upload Note
                </button>
                )}
            </div>
            </div>

            {/* Filters */}
            <div className="reveal delay-100 bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                </div>

                {/* College */}
                <div>
                <input
                    type="text"
                    placeholder="College"
                    value={filters.college}
                    onChange={(e) => setFilters({ ...filters, college: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                </div>

                {/* Course */}
                <div>
                <input
                    type="text"
                    placeholder="Course"
                    value={filters.course}
                    onChange={(e) => setFilters({ ...filters, course: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                </div>

                {/* Semester */}
                <div>
                <select
                    value={filters.semester}
                    onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                    <option value="">All Semesters</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                        Semester {sem}
                    </option>
                    ))}
                </select>
                </div>
            </div>

            {/* Additional Filters */}
            <div className="flex flex-wrap gap-4 mt-4">
                {/* Sort */}
                <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value as any })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                </select>

                {/* Free/Paid Filter */}
                <div className="flex gap-2">
                <button
                    onClick={() => setFilters({ ...filters, free: undefined })}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filters.free === undefined
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilters({ ...filters, free: true })}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filters.free === true
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Free Only
                </button>
                <button
                    onClick={() => setFilters({ ...filters, free: false })}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filters.free === false
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Paid Only
                </button>
                </div>

                {/* Clear Filters */}
                <button
                onClick={() =>
                    setFilters({
                    college: '',
                    course: '',
                    semester: '',
                    subject: '',
                    search: '',
                    sort: 'newest',
                    free: undefined
                    })
                }
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                Clear All
                </button>
            </div>
            </div>

            {/* Notes Grid */}
            {loading ? (
            <div className="text-center py-12">
                <div className="text-xl text-gray-600">Loading notes...</div>
            </div>
            ) : notes.length === 0 ? (
            <div className="reveal text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="text-gray-400 text-5xl mb-4">
                <i className="fas fa-inbox"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note, index) => (
                <div
                    key={note._id}
                    style={{ transitionDelay: `${(index % 6) * 100}ms` }}
                    className="reveal reveal-pop bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary transition-all duration-300 overflow-hidden group"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-blue-600 p-4">
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-2">
                        <i className="fas fa-file-pdf text-2xl"></i>
                        <span className="font-semibold text-sm">{note.subject}</span>
                        </div>
                        {note.price === 0 ? (
                        <span className="bg-white text-primary px-3 py-1 rounded-full text-xs font-bold">
                            FREE
                        </span>
                        ) : (
                        <span className="bg-white text-primary px-3 py-1 rounded-full text-xs font-bold">
                            ₹{note.price}
                        </span>
                        )}
                    </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {note.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{note.description}</p>

                    {/* Info */}
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center text-xs text-gray-500">
                        <i className="fas fa-university w-4"></i>
                        <span>{note.college}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                        <i className="fas fa-graduation-cap w-4"></i>
                        <span>
                            {note.course} - Semester {note.semester}
                        </span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center space-x-1">
                        <i className="fas fa-eye"></i>
                        <span>{note.views} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                        <i className="fas fa-shopping-cart"></i>
                        <span>{note.purchases} purchases</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => handleViewNote(note._id)}
                        className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                    >
                        {note.hasAccess ? 'View Note' : note.price === 0 ? 'View Free Note' : 'View & Purchase'}
                    </button>
                    </div>
                </div>
                ))}
            </div>
            )}

            {/* Results Count */}
            {!loading && notes.length > 0 && (
            <div className="reveal delay-200 text-center mt-8 text-gray-600">
                Showing {notes.length} note{notes.length !== 1 ? 's' : ''}
            </div>
            )}
            
        </div>
        {/* End of Content Wrapper */}

      </div>
    </div>
  );
};

export default Notes;