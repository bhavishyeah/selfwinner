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
    sort: 'newest' as 'newest' | 'price-low' | 'price-high',
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
  }, [loading, bundles]);

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
    <div className="min-h-screen bg-gray-50 py-12 overflow-x-hidden">
      
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0); }
        .reveal-pop { opacity: 0; transform: scale(0.9); transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .reveal-pop.active { opacity: 1; transform: scale(1); }
        .reveal.delay-100 { transition-delay: 0.1s; }
        .reveal.delay-200 { transition-delay: 0.2s; }
        
        /* Fixed: Rotated -10deg for the right side */
        @keyframes float {
          0% { transform: translateY(0px) rotate(-10deg); }
          50% { transform: translateY(-20px) rotate(-10deg); }
          100% { transform: translateY(0px) rotate(-10deg); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 relative">
        
        {/* --- RIGHT SIDE: IMAGE BACKGROUND (Flipped) --- */}
        <div 
            className="absolute top-[-50%] lg:right-[-41%] pointer-events-none z-0 hidden md:block" 
            style={{ 
                width: '1000px', 
                height: '1000px', 
                // REMOVED 4s delay, added willChange for smoothness
                animation: 'float 7s ease-in-out infinite',
                willChange: 'transform'
            }}
        >
          <img 
            src="/images/bundlebndlpg.png"
            alt="Decoration" 
            // Removed manual rotation class to let animation handle it entirely
            className="w-full h-full object-contain opacity-100"
          />
        </div>

        {/* --- LEFT SIDE: CONTENT WRAPPER --- */}
        {/* lg:mr-auto pushes content to the Left. lg:w-[85%] sets the width. */}
        <div className="w-full lg:w-[85%] lg:mr-auto relative z-10">

            {/* Header */}
            <div className="reveal flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-bold text-gray-900">Note Bundles</h1>
                <p className="text-gray-600 mt-2">Save money by getting complete semester packages</p>
            </div>
            <div className="flex gap-3">
                <button
                onClick={() => navigate('/notes')}
                className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm flex items-center"
                >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Notes
                </button>
                {isAdmin && (
                <button
                    onClick={() => navigate('/admin/bundles')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg"
                >
                    <i className="fas fa-plus mr-2"></i>
                    Create Bundle
                </button>
                )}
            </div>
            </div>

            {/* Filters */}
            <div className="reveal delay-100 bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search bundles..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={filters.sort}
                        onChange={(e) => setFilters({ ...filters, sort: e.target.value as any })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Bundles Grid */}
            {loading ? (
            <div className="text-center py-12">
                <div className="text-xl text-gray-600">Loading bundles...</div>
            </div>
            ) : bundles.length === 0 ? (
            <div className="reveal text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="text-gray-400 text-5xl mb-4">
                <i className="fas fa-box-open"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bundles found</h3>
                <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bundles.map((bundle, index) => (
                <div
                    key={bundle._id}
                    style={{ transitionDelay: `${(index % 6) * 100}ms` }}
                    className="reveal reveal-pop bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-500 transition-all duration-300 overflow-hidden group"
                >
                    {/* Bundle Header - Purple Theme */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-2">
                        <i className="fas fa-layer-group text-2xl"></i>
                        <span className="font-semibold text-sm">{bundle.itemsCount} Items</span>
                        </div>
                        <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-xs font-bold">
                            ₹{bundle.price}
                        </span>
                    </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {bundle.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{bundle.description}</p>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center text-xs text-gray-500">
                            <i className="fas fa-graduation-cap w-4"></i>
                            <span>{bundle.course}</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center space-x-1">
                        <i className="fas fa-shopping-cart"></i>
                        <span>{bundle.purchases} purchases</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(`/bundles/${bundle._id}`)}
                        className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-sm"
                    >
                        {bundle.hasAccess ? 'View Bundle' : 'View & Purchase'}
                    </button>
                    </div>
                </div>
                ))}
            </div>
            )}

            {!loading && bundles.length > 0 && (
            <div className="reveal delay-200 text-center mt-8 text-gray-600">
                Showing {bundles.length} bundle{bundles.length !== 1 ? 's' : ''}
            </div>
            )}
            
        </div>
        {/* End of Content Wrapper */}

      </div>
    </div>
  );
};

export default Bundles;