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

  const loadNote = async () => {
    if (!id) return;
    
    try {
      const noteData = await getNote(id);
      setNote(noteData);

      // Check for related bundles
      const bundles = await getBundles();
      const bundle = bundles.find((b: any) => 
        b.noteIds && Array.isArray(b.noteIds) && b.noteIds.some((n: any) => n._id === id || n === id)
      );
      setRelatedBundle(bundle);

      // Check access
      if (noteData?.price === 0) {
        setHasAccess(true);
        // Set PDF URL for free notes
        setPdfUrl(`http://localhost:5000/api/viewer/note/${id}?token=${token}`);
      } else if (isAuthenticated) {
        const access = await checkAccess('note', id);
        setHasAccess(access);
        if (access) {
          setPdfUrl(`http://localhost:5000/api/viewer/note/${id}?token=${token}`);
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
      
      console.log('Order created:', orderData);

      // Check if Razorpay script is loaded
      if (!window.Razorpay) {
        alert('❌ Razorpay script not loaded. Please refresh the page.');
        setPaymentLoading(false);
        return;
      }

      // Razorpay options
      const options = {
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_RyUAuK75ZstvGn', // Use your actual key
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
            setPdfUrl(`http://localhost:5000/api/viewer/note/${id}?token=${token}`);
            loadNote();
          } catch (error) {
            console.error('Verification error:', error);
            alert('❌ Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          email: user?.email || '',
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

      console.log('Opening Razorpay with options:', options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setPaymentLoading(false);
    } catch (error: any) {
      console.error('Payment error:', error);
      console.error('Error response:', error.response?.data);
      alert('❌ ' + (error.response?.data?.message || error.message || 'Payment initiation failed'));
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Note Not Found</h1>
          <button
            onClick={() => navigate('/notes')}
            className="text-primary hover:underline"
          >
            Go back to Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate('/notes')}
        className="text-gray-500 hover:text-primary mb-6 flex items-center font-medium transition-colors"
      >
        <i className="fas fa-arrow-left mr-2"></i> Back to Notes
      </button>

      {!hasAccess ? (
        // Preview / Buy State
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          <div className="p-8 md:p-12 flex-grow">
            <div className="flex gap-2 mb-4">
              <span className="bg-blue-50 text-primary text-xs font-bold px-2 py-1 rounded">
                {note.course}
              </span>
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                {note.subject}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{note.title}</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">{note.description}</p>

            <div className="space-y-4">
              <div className="flex items-center text-gray-600 text-sm">
                <i className="fas fa-university w-6 text-center text-primary mr-3"></i> {note.college}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <i className="fas fa-calendar-alt w-6 text-center text-primary mr-3"></i> Semester {note.semester}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <i className="fas fa-eye w-6 text-center text-primary mr-3"></i> {note.views} views
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <i className="fas fa-shopping-cart w-6 text-center text-primary mr-3"></i> {note.purchases} purchases
              </div>
            </div>

            {relatedBundle && (
              <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wide">Best Value Bundle</span>
                  <p className="font-bold text-indigo-900">Get this note in "{relatedBundle.title}"</p>
                </div>
                <button
                  onClick={() => navigate(`/bundles/${relatedBundle._id}`)}
                  className="text-primary font-bold hover:underline text-sm whitespace-nowrap ml-4"
                >
                  View Bundle
                </button>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-8 md:p-12 md:w-80 border-l border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-md text-gray-400">
              <i className="fas fa-lock text-2xl"></i>
            </div>
            <div className="text-sm text-gray-500 mb-1">One-time purchase</div>
            <div className="text-4xl font-extrabold text-gray-900 mb-8">₹{note.price}</div>

            <button
              onClick={handleBuy}
              disabled={paymentLoading}
              className="w-full bg-primary text-white px-6 py-3.5 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-lg disabled:opacity-50"
            >
              {paymentLoading ? 'Processing...' : 'Buy Now'}
            </button>
            <p className="text-xs text-gray-400 mt-4">
              <i className="fas fa-shield-alt mr-1"></i>
              Secure payment via Razorpay
            </p>
          </div>
        </div>
      ) : (
        // Access Granted State
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-green-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
                <i className="fas fa-check"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{note.title}</h1>
                <span className="text-green-600 text-xs font-bold uppercase tracking-wide">Access Granted</span>
              </div>
            </div>
            <button
              onClick={() => window.open(`/#/viewer/${note._id}`, '_blank')}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-lg flex items-center space-x-2"
            >
              <i className="fas fa-external-link-alt"></i>
              <span>Open in Secure Viewer</span>
            </button>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-shield-alt text-white"></i>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Secure Viewing Experience</h3>
                <ul className="text-sm text-gray-700 space-y-1">
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
  );
};

export default NoteView;