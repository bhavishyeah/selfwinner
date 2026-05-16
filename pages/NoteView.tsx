import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNote, getBundles } from '../services/notesService';
import { createOrder, verifyPayment, checkAccess } from '../services/paymentService';
import authService from '../services/authService';

declare global {
  interface Window {
    Razorpay: any;
  }
}
const headingFont = { fontFamily: 'Montserrat, sans-serif' };
const NoteView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [relatedBundle, setRelatedBundle] = useState<any>(undefined);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const user = authService.getStoredUser();
  const isAuthenticated = authService.isAuthenticated();
  const token = authService.getToken();

  useEffect(() => {
    loadNote();
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

  const loadNote = async () => {
    if (!id) return;
    
    try {
      const noteData = await getNote(id);
      setNote(noteData);

      // Check for related bundles
      const bundles = await getBundles();
     const bundle = bundles.find(
        (b: any) => b.noteIds && Array.isArray(b.noteIds) && b.noteIds.some((n: any) => n._id === id || n === id)
      );
      setRelatedBundle(bundle);

      // Check access
      if (noteData?.price === 0) {
        setHasAccess(true);
        // Set PDF URL for free notes
        setPdfUrl(`${import.meta.env.VITE_API_URL}/api/viewer/note/${id}?token=${token}`);
      } else if (isAuthenticated) {
let access = await checkAccess('note', id);

        // Fallback: if note-level access is false, allow access via purchased bundle
        if (!access && bundle?._id) {
          const bundleAccess = await checkAccess('bundle', bundle._id);
          access = bundleAccess;
        }        setHasAccess(access);
        if (access) {
          setPdfUrl(`${import.meta.env.VITE_API_URL}/api/viewer/note/${id}?token=${token}`);
        }
      }
    } catch (error) {
      console.error('Load note error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (!note) return;

    setPaymentLoading(true);

    try {
      // Create Razorpay order
      const orderData = await createOrder('note', note._id);
      
      // console.log('Order created:', orderData);

      // Check if Razorpay script is loaded
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
        description: note.title,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            await verifyPayment(
              orderData.id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              'note',
              note._id,
              orderData.amount
            );

            alert('✅ Payment successful! You now have access to this note.');
            setHasAccess(true);
            setPdfUrl(`${import.meta.env.VITE_API_URL}/api/viewer/note/${id}?token=${token}`);
            loadNote();
          } catch (error) {
            console.error('Verification error:', error);
            alert('❌ Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          email: user?.email || ''
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
          }
        }
      };

      // console.log('Opening Razorpay with options:', options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setPaymentLoading(false);
    } catch (error: any) {
      console.error('Payment error:', error);
      // console.error('Error response:', error.response?.data);
      alert('❌ ' + (error.response?.data?.message || error.message || 'Payment initiation failed'));
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="rounded-2xl border border-blue-200/20 bg-slate-900/40 px-8 py-6 text-blue-100">Loading note...</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl border border-red-300/20 bg-slate-900/40 p-8 text-center">
          <h1 style={headingFont} className="mb-3 text-2xl font-bold text-red-300">Note Not Found</h1>
          <button onClick={() => navigate('/notes')} className="text-blue-300 font-semibold hover:text-white transition-colors">
            Go back to Notes
          </button>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_20%,rgba(59,130,246,0.35),transparent_35%),radial-gradient(circle_at_90%_0%,rgba(34,211,238,0.25),transparent_30%),linear-gradient(180deg,#020617_0%,#0B1F5E_45%,#0F2E8A_100%)]" />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <button
          onClick={() => navigate('/notes')}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-blue-200/30 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 backdrop-blur hover:bg-white/20"
        >
          <i className="fas fa-arrow-left" /> Back to Notes
        </button>

        {!hasAccess ? (
          <div className="overflow-hidden rounded-3xl border border-blue-200/20 bg-slate-900/40 shadow-2xl backdrop-blur-xl lg:grid lg:grid-cols-[1fr_320px]">
            <div className="p-5 sm:p-8 lg:p-10">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-blue-200/40 bg-blue-400/20 px-3 py-1 text-xs font-bold text-blue-100">{note.course}</span>
              </div>
               <h1 style={headingFont} className="text-2xl font-bold leading-tight text-white sm:text-4xl">{note.title}</h1>
              <h2 style={headingFont} className="mt-2 text-lg font-semibold text-blue-100/90 sm:text-xl">Premium Notes Access</h2>
              <p className="mt-4 text-sm leading-relaxed text-blue-100/85 sm:text-base">{note.description}</p>

              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-blue-200/20 bg-white/5 p-3 text-sm text-blue-100"><i className="fas fa-university mr-2 text-cyan-300" />{note.college}</div>
                <div className="rounded-xl border border-blue-200/20 bg-white/5 p-3 text-sm text-blue-100"><i className="fas fa-calendar-alt mr-2 text-cyan-300" />Semester {note.semester}</div>
                <div className="rounded-xl border border-blue-200/20 bg-white/5 p-3 text-sm text-blue-100"><i className="fas fa-eye mr-2 text-cyan-300" />{note.views} views</div>
                <div className="rounded-xl border border-blue-200/20 bg-white/5 p-3 text-sm text-blue-100"><i className="fas fa-shopping-cart mr-2 text-cyan-300" />{note.purchases} purchases</div>
              </div>
            

                          {relatedBundle && (
                <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-blue-200/25 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-cyan-100">Best Value Bundle</p>
                    <p className="text-sm font-semibold text-white">Get this note in "{relatedBundle.title}"</p>
                  </div>
                  <button
                    onClick={() => navigate(`/bundles/${relatedBundle._id}`)}
                    className="rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-blue-50 hover:bg-white/25"
                  >
                    View Bundle
                  </button>
                </div>
                )}
            </div>

            <div className="border-t border-blue-200/20 bg-slate-950/40 p-6 text-center lg:border-l lg:border-t-0 lg:p-8">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-blue-100 shadow-lg shadow-blue-950/40">
                <i className="fas fa-lock text-2xl" />
              </div>
            <div className="text-xs uppercase tracking-wide text-blue-100/80">One-time purchase</div>
              <div style={headingFont} className="my-4 text-4xl font-extrabold text-white">₹{note.price}</div>

          <button
                onClick={handleBuy}
                disabled={paymentLoading}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-900/40 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {paymentLoading ? 'Processing...' : 'Buy Now'}
              </button>
              <p className="mt-3 text-xs text-blue-100/75"><i className="fas fa-shield-alt mr-1" />Secure payment via Razorpay</p>
            </div>
           
          </div>
       ) : (
          <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
                    <i className="fas fa-check" />
                  </div>
                  <div>
                    <h1 style={headingFont} className="text-xl font-bold text-white sm:text-2xl">{note.title}</h1>
                    <h2 style={headingFont} className="text-sm font-semibold uppercase tracking-wide text-emerald-200">Access Granted</h2>
                  </div>
                </div>

                <button
                  onClick={() => window.open(`/#/viewer/${note._id}`, '_blank')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/40"
                >
                  <i className="fas fa-external-link-alt" />
                  <span>Open in Secure Viewer</span>
                </button>
        
              </div>
            </div>
            <div className="rounded-2xl border border-blue-200/20 bg-slate-900/40 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                  <i className="fas fa-shield-alt" />
                </div>
                <div>
                  <h3 style={headingFont} className="mb-2 text-lg font-bold text-white">Secure Viewing Experience</h3>
                  <ul className="space-y-1 text-sm text-blue-100/85">
                    <li>✓ View-only access - Download disabled</li>
                    <li>✓ Watermarked with your email</li>
                    <li>✓ Protected from screenshots (best-effort)</li>
                    <li>✓ Session-bound - Requires internet connection</li>
                  </ul>
                </div>
              </div>
            </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default NoteView;