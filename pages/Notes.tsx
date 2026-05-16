import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getNotes } from '../services/notesService';
import authService from '../services/authService';
import GoogleAd from '../components/GoogleAd';

const headingFont = { fontFamily: 'Montserrat, sans-serif' };

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

type SortOption = 'newest' | 'price-low' | 'price-high';

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
    sort: 'newest' as SortOption,
    free: undefined as boolean | undefined
  });

  const isAdmin = authService.isAdmin();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadNotes();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Light Background Gradients */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.07),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(96,165,250,0.07),transparent_35%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div
          className="absolute top-[-75%] lg:left-[-71%] pointer-events-none z-1 hidden md:block"
          style={{ width: '1400px', height: '1400px' }}
        >
          <img
            src="/images/notesnotepg.png"
            alt="Decoration"
            className="w-full h-full object-contain opacity-100"
          />
        </div>

        {/* Main Container */}
        <div className="relative z-10 rounded-3xl border border-blue-100 bg-white/90 p-5 shadow-xl shadow-blue-100/60 backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:gap-6">

            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-2 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Notes Library
                </p>
                <h1 style={headingFont} className="text-2xl font-bold leading-tight text-slate-900 sm:text-4xl">Browse Notes</h1>
                <h2 style={headingFont} className="mt-2 text-sm font-medium text-slate-500 sm:text-lg">
                  Mobile-first, premium experience to discover and purchase study material.
                </h2>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-2">
                <button
                  onClick={() => navigate('/bundles')}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-transform hover:scale-[1.02]"
                >
                  <i className="fas fa-box mr-2" /> View Bundles
                </button>
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                  >
                    <i className="fas fa-plus mr-2" /> Upload Note
                  </button>
                )}
              </div>
            </div>

            {/* Filters Section */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="xl:col-span-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="College"
                  value={filters.college}
                  onChange={(e) => setFilters({ ...filters, college: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Course"
                  value={filters.course}
                  onChange={(e) => setFilters({ ...filters, course: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <select
                  value={filters.semester}
                  onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value as SortOption })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition sm:w-auto focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                <div className="grid grid-cols-3 gap-2 sm:flex">
                  {[
                    { label: 'All', value: undefined },
                    { label: 'Free', value: true },
                    { label: 'Paid', value: false }
                  ].map((option) => (
                    <button
                      key={option.label}
                      onClick={() => setFilters({ ...filters, free: option.value as boolean | undefined })}
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        filters.free === option.value
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/30 border-transparent'
                          : 'border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setFilters({
                    college: '', course: '', semester: '', subject: '',
                    search: '', sort: 'newest', free: undefined
                  })}
                  className="text-left text-sm font-semibold text-slate-400 transition hover:text-blue-600"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* ✅ AD 1 — Banner between Filters and Notes Grid */}
            {!loading && notes.length > 0 && (
              <div className="w-full rounded-2xl overflow-hidden">
                <GoogleAd
                  adSlot="8787206607"
                  adFormat="auto"
                  style={{ minHeight: '90px' }}
                />
              </div>
            )}

            {/* Notes Grid */}
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="h-64 rounded-2xl bg-slate-200 animate-pulse border border-slate-100"
                  />
                ))}
              </div>
            ) : notes.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
                <div className="mb-3 text-4xl text-slate-300"><i className="fas fa-inbox" /></div>
                <h3 className="font-['Montserrat'] text-xl font-bold text-slate-800">No notes found</h3>
                <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {notes.map((note, index) => (
                  <React.Fragment key={note._id}>

                    {/* ✅ AD 2 — Full-width banner after every 6th card */}
                    {index > 0 && index % 6 === 0 && (
                      <div className="sm:col-span-2 lg:col-span-3">
                        <GoogleAd
                          adSlot="8787206607"
                          adFormat="horizontal"
                          style={{ minHeight: '90px', borderRadius: '16px', overflow: 'hidden' }}
                        />
                      </div>
                    )}

                    {/* ✅ Note Card — key removed from motion.div (already on Fragment) */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 hover:border-blue-300 hover:shadow-blue-500/10"
                    >
                      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 p-4">
                        <div className="flex items-center justify-between gap-3 text-white">
                          <div className="flex min-w-0 items-center gap-2">
                            <i className="fas fa-file-pdf text-xl" />
                            <span className="truncate text-sm font-semibold">{note.subject}</span>
                          </div>
                          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-blue-700 shadow-sm">
                            {note.price === 0 ? 'FREE' : `₹${note.price}`}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5">
                        <h3 style={headingFont} className="line-clamp-2 text-base font-bold text-slate-900 sm:text-lg">{note.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{note.description}</p>

                        <div className="mt-4 space-y-2 text-xs text-slate-500">
                          <div className="flex items-center gap-2"><i className="fas fa-university w-4 text-slate-400" /> {note.college}</div>
                          <div className="flex items-center gap-2"><i className="fas fa-graduation-cap w-4 text-slate-400" /> {note.course} - Semester {note.semester}</div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                          <span><i className="fas fa-eye mr-1 text-slate-400" /> {note.views} views</span>
                          <span><i className="fas fa-shopping-cart mr-1 text-slate-400" /> {note.purchases} purchases</span>
                        </div>

                        <button
                          onClick={() => handleViewNote(note._id)}
                          className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:opacity-95"
                        >
                          {note.hasAccess ? 'View Note' : note.price === 0 ? 'View Free Note' : 'View & Purchase'}
                        </button>
                      </div>
                    </motion.div>

                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Results Count */}
            {!loading && notes.length > 0 && (
              <div className="text-center text-sm text-slate-400">
                Showing {notes.length} note{notes.length !== 1 ? 's' : ''}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;