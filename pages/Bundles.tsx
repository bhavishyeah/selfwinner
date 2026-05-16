import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBundles } from '../services/notesService';
import authService from '../services/authService';

// Assuming Bundle interface matches your data structure
interface Bundle {
  _id: string;
  title: string;
  description: string;
  price: number;
  course: string;
  semester: string;
  subject: string;
  itemsCount: number; // Assuming bundles have a count of notes
  purchases: number;
  hasAccess?: boolean;
}

const Bundles: React.FC = () => {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Simplified filters for bundles (customize as needed)
  const [filters, setFilters] = useState({
    search: '',
    sort: 'newest' as 'newest' | 'price-low' | 'price-high'
  });

  const isAdmin = authService.isAdmin();

  // // Animation Observer
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     const revealObserver = new IntersectionObserver((entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           entry.target.classList.add('active');
  //         }
  //       });
  //     }, { threshold: 0.1 });

  //     const revealElements = document.querySelectorAll('.reveal');
  //     revealElements.forEach((el) => revealObserver.observe(el));
  //   }, 100);

  //   return () => clearTimeout(timeoutId);
  // }, [loading, bundles]);

  useEffect(() => {
    loadBundles();
  }, [filters]);

  const loadBundles = async () => {
    setLoading(true);
    try {
      // customized fetch for bundles
      const data = await getBundles(filters); 
      setBundles(data);
    } catch (error) {
      console.error('Load bundles error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-b from-white via-violet-50/40 to-purple-50/70 py-8 sm:py-12">
     <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div
          className="absolute top-[-50%] lg:right-[-41%] pointer-events-none z-0 hidden md:block"
          style={{ width: '1000px', height: '1000px' }}
        >
          <img src="/images/bundlebndlpg.png" alt="Decoration" className="w-full h-full object-contain opacity-100" />
        </div>

        <div className="relative z-10 rounded-3xl border border-violet-100 bg-white/90 p-5 shadow-xl shadow-violet-100/70 backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Note Bundles</h1>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">Save money with complete semester packages in a premium purple style.</p>
            </div>
          <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-2">
              <button
                onClick={() => navigate('/notes')}
                className="rounded-xl border border-violet-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-violet-50"
              >
                <i className="fas fa-arrow-left mr-2" /> Back to Notes
              </button>
              {isAdmin && (
                <button
                      onClick={() => navigate('/admin/bundles')}
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 hover:opacity-95"
                >
                                      <i className="fas fa-plus mr-2" /> Create Bundle
                </button>
                )}
            </div>
            

             </div>

          <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/50 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Search bundles..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400"
              />
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value as any })}
                className="rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            </div>

            {/* Bundles Grid */}
                      <div className="mt-8">
            {loading ? (
                          <div className="text-center py-12 text-slate-600">Loading bundles...</div>
            ) : bundles.length === 0 ? (
           <div className="rounded-2xl border border-violet-100 bg-white p-10 text-center">
                <div className="mb-3 text-4xl text-violet-300"><i className="fas fa-box-open" /></div>
                <h3 className="text-xl font-semibold text-slate-900">No bundles found</h3>
                <p className="mt-1 text-sm text-slate-600">Try adjusting your search terms.</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {bundles.map((bundle) => (
                  <div
                    key={bundle._id}
                     className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="bg-gradient-to-r from-purple-600 to-violet-500 p-4">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-layer-group text-xl" />
                          <span className="text-sm font-semibold">{bundle.itemsCount} Items</span>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-purple-700">₹{bundle.price}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                     <h3 className="line-clamp-2 text-lg font-bold text-slate-900">{bundle.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{bundle.description}</p>

                   <div className="mt-4 text-xs text-slate-500">
                        <div className="flex items-center gap-2"><i className="fas fa-graduation-cap w-4" />{bundle.course}</div>
                      </div>

                    {/* Stats */}
                   <div className="mt-4 border-t border-violet-100 pt-4 text-xs text-slate-500">
                        <i className="fas fa-shopping-cart mr-1" /> {bundle.purchases} purchases
                      </div>

                    <button
                        onClick={() => navigate(`/bundles/${bundle._id}`)}
                        className="mt-4 w-full rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                      >
                        {bundle.hasAccess ? 'View Bundle' : 'View & Purchase'}
                    </button>
                    </div>
                </div>
                ))}
            </div>
            )}
</div>
           {!loading && bundles.length > 0 && (
            <div className="mt-8 text-center text-sm text-slate-600">Showing {bundles.length} bundle{bundles.length !== 1 ? 's' : ''}</div>
          )}
            
        </div>
        {/* End of Content Wrapper */}

      </div>
    </div>
  );
};

export default Bundles;