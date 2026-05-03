import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBundle, getNotes } from '../services/notesService';
import { createOrder, verifyPayment, checkAccess } from '../services/paymentService';
import authService from '../services/authService';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const BundleView: React.FC = () => {
  const knownCouponDiscounts: Record<string, number> = {
    SW10A1B2C3D4E5F6: 10, SW10G7H8J9K1L2M3: 10, SW10N4P5Q6R7S8T9: 10, SW10U1V2W3X4Y5Z6: 10, SW107A8B9C1D2E3F: 10,
    SW10G4H5J6K7L8M9: 10, SW10N1P2Q3R4S5T6: 10, SW10U7V8W9X1Y2Z3: 10, SW104A5B6C7D8E9F: 10, SW10G1H2J3K4L5M6: 10,
    SW20A1B2C3D4E5F6: 20, SW20G7H8J9K1L2M3: 20, SW20N4P5Q6R7S8T9: 20, SW20U1V2W3X4Y5Z6: 20, SW207A8B9C1D2E3F: 20,
    SW20G4H5J6K7L8M9: 20, SW20N1P2Q3R4S5T6: 20, SW20U7V8W9X1Y2Z3: 20, SW204A5B6C7D8E9F: 20, SW20G1H2J3K4L5M6: 20,
    SW30A1B2C3D4E5F6: 30, SW30G7H8J9K1L2M3: 30, SW30N4P5Q6R7S8T9: 30, SW30U1V2W3X4Y5Z6: 30, SW307A8B9C1D2E3F: 30,
    SW30G4H5J6K7L8M9: 30, SW30N1P2Q3R4S5T6: 30, SW30U7V8W9X1Y2Z3: 30, SW304A5B6C7D8E9F: 30, SW30G1H2J3K4L5M6: 30,
    SW40A1B2C3D4E5F6: 40, SW40G7H8J9K1L2M3: 40, SW40N4P5Q6R7S8T9: 40, SW40U1V2W3X4Y5Z6: 40, SW407A8B9C1D2E3F: 40,
    SW40G4H5J6K7L8M9: 40, SW40N1P2Q3R4S5T6: 40, SW40U7V8W9X1Y2Z3: 40, SW404A5B6C7D8E9F: 40, SW40G1H2J3K4L5M6: 40,
    SW50A1B2C3D4E5F6: 50, SW50G7H8J9K1L2M3: 50, SW50N4P5Q6R7S8T9: 50, SW50U1V2W3X4Y5Z6: 50, SW507A8B9C1D2E3F: 50,
    SW50G4H5J6K7L8M9: 50, SW50N1P2Q3R4S5T6: 50, SW50U7V8W9X1Y2Z3: 50, SW504A5B6C7D8E9F: 50, SW50G1H2J3K4L5M6: 50
  };
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState<any>(null);
  const [bundleNotes, setBundleNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [owned, setOwned] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [appliedOrderAmount, setAppliedOrderAmount] = useState<number | null>(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const user = authService.getStoredUser();
  const isAuthenticated = authService.isAuthenticated();

  // Animation Observer
  useEffect(() => {
    // Timeout ensures DOM is fully rendered before observing
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
  }, [loading, bundleNotes]); // Re-run when data loads

  useEffect(() => {
    loadBundle();
  }, [id]);

 useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const loadBundle = async () => {
    if (!id) return;

    try {
      const bundleData = await getBundle(id);
      if (!bundleData) {
        setLoading(false);
        return;
      }
      setBundle(bundleData);

      // Get all notes to match with bundle noteIds
      const allNotes = await getNotes();
      
      // Filter notes that are in this bundle
      const notesInBundle = allNotes.filter((note: any) => {
        if (Array.isArray(bundleData.noteIds)) {
          return bundleData.noteIds.some((noteId: any) => {
            // Handle both object {_id: 'xxx'} and string 'xxx' formats
            const id = typeof noteId === 'object' ? noteId._id : noteId;
            return id === note._id;
          });
        }
        return false;
      });

      setBundleNotes(notesInBundle);

      // Check if user owns this bundle
      if (isAuthenticated) {
        const access = await checkAccess('bundle', id);
        setOwned(access);
      }
    } catch (error) {
      console.error('Load bundle error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (!bundle) return;

    setPaymentLoading(true);

    try {
      // Create Razorpay order
const orderData = await createOrder('bundle', bundle._id, appliedCoupon?.code);
      const expectedAmountInPaise = appliedOrderAmount ?? null;
 if (appliedCoupon && expectedAmountInPaise !== null && orderData.amount !== expectedAmountInPaise) {
          setPaymentLoading(false);
        alert('⚠️ Coupon could not be applied on server checkout. Please try again after backend deployment sync.');
        return;
      }
if (!window.Razorpay) {
        alert('❌ Razorpay script not loaded. Please refresh the page.');
        setPaymentLoading(false);
        return;
      }

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SelfWinner',
        description: bundle.title,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            await verifyPayment(
              orderData.id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              'bundle',
              bundle._id,
              orderData.amount
            );

            alert('✅ Payment successful! You now have access to all notes in this bundle.');
            setOwned(true);
            loadBundle();
          } catch (error) {
            alert('❌ Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          email: user?.email || '',
        },
        theme: {
          color: '#7C3AED' 
          },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
          }// Purple color for bundles
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
            setPaymentLoading(false);
    } catch (error: any) {
      alert('❌ ' + (error.response?.data?.message || 'Payment initiation failed'));
    } finally {
      setPaymentLoading(false);
    }
  };

const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage('Please enter a coupon code.');
      return;
    }
    setCouponLoading(true);
    try {
     if (!isAuthenticated) {
        navigate('/auth');
        return;
      }
      if (!bundle?._id) return;

      const normalized = couponCode.trim().toUpperCase();
      const orderPreview = await createOrder('bundle', bundle._id, normalized);
      const expectedDiscount = knownCouponDiscounts[normalized] || 0;
      const expectedAmountInPaise = Math.round(basePrice * (1 - expectedDiscount / 100) * 100);

      if (!expectedDiscount) {
        setAppliedCoupon(null);
                  setAppliedOrderAmount(null);
         setCouponMessage('Invalid coupon code');
        return;
      }

      if (orderPreview.amount !== expectedAmountInPaise) {
        setAppliedCoupon(null);
setAppliedOrderAmount(null);
        setCouponMessage('Coupon is valid, but backend amount does not match exact discount logic. Please redeploy/update backend.');       
         return;
      }

setAppliedCoupon({ code: normalized, discountPercent: expectedDiscount });
            setAppliedOrderAmount(orderPreview.amount);
setCouponMessage(`🎉 Coupon applied! You unlocked ${expectedDiscount}% off.`);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1600);
    } catch (error: any) {
      setAppliedCoupon(null);
            setAppliedOrderAmount(null);
  setCouponMessage(error.response?.data?.message || 'Invalid coupon code');
       } finally {
      setCouponLoading(false);
    }
  };

  const basePrice = bundle?.price || 0;
  const discountPercent = appliedCoupon?.discountPercent || 0;
const finalPrice = appliedOrderAmount !== null
    ? appliedOrderAmount / 100
    : Math.max(0, basePrice * (1 - discountPercent / 100));
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl animate-pulse">Loading bundle...</div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Bundle Not Found</h1>
          <button
            onClick={() => navigate('/bundles')}
            className="text-primary hover:underline"
          >
            Go back to Bundles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      
      {/* Animation Styles */}
      <style>{`
        /* Base Reveal */
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0); }
        
        /* Pop In Effect */
        .reveal-pop { opacity: 0; transform: scale(0.9); transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .reveal-pop.active { opacity: 1; transform: scale(1); }

        /* Slide Right */
        .reveal-right { opacity: 0; transform: translateX(30px); transition: all 0.8s ease-out; }
        .reveal-right.active { opacity: 1; transform: translateX(0); }

        /* Slide Left */
        .reveal-left { opacity: 0; transform: translateX(-30px); transition: all 0.8s ease-out; }
        .reveal-left.active { opacity: 1; transform: translateX(0); }

        /* Delays */
        .reveal.delay-100 { transition-delay: 0.1s; }
        .reveal.delay-200 { transition-delay: 0.2s; }
        .reveal.delay-300 { transition-delay: 0.3s; }
        .reveal.delay-500 { transition-delay: 0.5s; }
      `}</style>

      <button
        onClick={() => navigate('/bundles')}
        className="reveal reveal-left text-gray-500 hover:text-primary mb-6 flex items-center font-medium transition-colors"
      >
        <i className="fas fa-arrow-left mr-2"></i> Back to Bundles
      </button>

      <div className="reveal bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-900 text-white p-10 md:p-16 text-center md:text-left relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0 max-w-2xl">
              <span className="reveal reveal-right delay-100 bg-white text-purple-900 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-extrabold mb-4 inline-block">
                Value Bundle
              </span>
              <h1 className="reveal reveal-right delay-200 text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{bundle.title}</h1>
              <p className="reveal reveal-right delay-300 text-purple-100 text-lg">{bundle.description}</p>
              <div className="reveal reveal-right delay-500 mt-6 flex items-center space-x-6 text-sm font-medium text-purple-200">
                <span className="flex items-center">
                  <i className="fas fa-layer-group mr-2"></i> {bundleNotes.length} Notes Included
                </span>
                <span className="flex items-center">
                  <i className="fas fa-university mr-2"></i> {bundle.college}
                </span>
              </div>
            </div>
            
            {/* Purchase Card */}
            <div className="reveal reveal-pop delay-500 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center min-w-[240px] shadow-2xl">
              {owned ? (
                <div>
                  <div className="text-green-400 text-4xl mb-3 animate-bounce">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="font-bold text-xl text-white">Purchased</div>
                  <div className="text-xs text-purple-200 mt-1 uppercase tracking-widest">
                    Access Granted
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-purple-200 text-xs uppercase font-bold tracking-widest mb-1">
                    Bundle Price
                  </div>
 <div className="text-5xl font-extrabold text-white mb-1">₹{finalPrice}</div>
                  {discountPercent > 0 && (
                    <div className="text-sm text-purple-100 line-through mb-1">₹{basePrice}</div>
                  )}
                                    <div className="text-xs text-purple-200 mb-6">
                    Save {bundleNotes.length > 0 ? Math.round(((bundleNotes.reduce((sum: number, note: any) => sum + note.price, 0) - bundle.price) / bundleNotes.reduce((sum: number, note: any) => sum + note.price, 0)) * 100) : 0}%
                  </div>
                  <button
                    onClick={handleBuy}
                    disabled={paymentLoading}
                    className="w-full bg-white text-purple-600 font-bold py-3 px-6 rounded-xl hover:bg-purple-50 transition shadow-lg disabled:opacity-50 transform hover:-translate-y-1 active:scale-95 duration-200"
                  >
                    {paymentLoading ? 'Processing...' : 'Buy Bundle Now'}
                  </button>
                  <div className="mt-4 p-3 rounded-xl bg-white/10 border border-white/20 relative overflow-hidden">
                    <label className="block text-[11px] uppercase tracking-wider text-purple-100 mb-2 font-bold">Enter coupon code</label>
                    <div className="flex gap-2">
                      <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="16-char coupon"
                        maxLength={16}
                        className="flex-1 rounded-lg bg-white/90 text-purple-900 px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="px-3 py-2 rounded-lg bg-purple-900 text-white text-xs font-bold hover:bg-purple-950 transition disabled:opacity-60"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponMessage && (
                      <p className={`mt-2 text-xs font-semibold ${appliedCoupon ? 'text-green-300' : 'text-red-300'}`}>{couponMessage}</p>
                    )}
                    {showConfetti && (
                      <div className="pointer-events-none absolute inset-0">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <span
                            key={i}
                            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full animate-ping"
                            style={{
                              background: ['#FDE047', '#A78BFA', '#22D3EE', '#FB7185'][i % 4],
                              transform: `translate(${Math.cos(i) * 70}px, ${Math.sin(i) * 50}px)`,
                              animationDuration: `${0.6 + (i % 5) * 0.2}s`
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content - Notes List */}
        <div className="p-8 md:p-12">
          <h2 className="reveal text-2xl font-bold text-gray-900 mb-8 border-b pb-4">
            Included in this bundle ({bundleNotes.length} notes)
          </h2>

          {bundleNotes.length === 0 ? (
            <div className="reveal text-center py-8 text-gray-500">
              <p>No notes found in this bundle.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {bundleNotes.map((note, index) => (
                <div
                  key={note._id}
                  // Staggered Animation Logic
                  style={{ transitionDelay: `${index * 100}ms` }}
                  className="reveal reveal-pop flex flex-col md:flex-row items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
                    <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center mr-5 text-red-500 text-xl shadow-sm flex-shrink-0">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{note.title}</h3>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex flex-wrap gap-2">
                        <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-600">
                          {note.subject}
                        </span>
                        <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-600">
                          Semester {note.semester}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                    {!owned && note.price > 0 && (
                      <div className="text-gray-400 font-medium line-through text-sm">
                        ₹{note.price}
                      </div>
                    )}
                    <button
                      onClick={() => navigate(`/notes/${note._id}`)}
                      className={`px-5 py-2.5 rounded-lg font-medium text-sm transition flex-shrink-0 ${
                        owned || note.price === 0
                          ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-purple-600 hover:text-purple-600'
                      }`}
                    >
                      {owned || note.price === 0 ? 'View Note' : 'View Details'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total Value */}
          {bundleNotes.length > 0 && !owned && (
            <div className="reveal delay-300 mt-8 bg-purple-50 border border-purple-200 rounded-xl p-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Individual Price:</div>
                  <div className="text-2xl font-bold text-gray-400 line-through">
                    ₹{bundleNotes.reduce((sum, note) => sum + note.price, 0)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-purple-600 font-semibold mb-1">Bundle Price:</div>
                  <div className="text-3xl font-bold text-purple-600">₹{bundle.price}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600 font-semibold mb-1">You Save:</div>
                  <div className="text-3xl font-bold text-green-600">
                    ₹{bundleNotes.reduce((sum, note) => sum + note.price, 0) - bundle.price}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  );
};

export default BundleView;