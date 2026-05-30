import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { CheckCircle2, Loader2, ShieldCheck, CreditCard, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const stateData = location.state || {};
  const { startDate, endDate, totalPrice } = stateData;

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // 1. Load Razorpay script dynamically
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };
    loadRazorpay();
  }, []);

  // 2. Fetch equipment details for summary
  useEffect(() => {
    if (!startDate || !endDate || !totalPrice) {
      // If someone navigates here directly without state, redirect back
      navigate(`/equipment/${id}`);
      return;
    }

    const fetchEquipment = async () => {
      try {
        const { data } = await api.get(`/equipment/${id}`);
        setEquipment(data);
      } catch (err) {
        setError('Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, [id, startDate, endDate, totalPrice, navigate]);

  // 3. Handle Payment Flow
  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      // Step A: Create a Booking in the database (status: pending)
      const bookingResponse = await api.post('/bookings', {
        equipmentId: equipment._id,
        startDate,
        endDate,
        totalPrice
      });
      const bookingId = bookingResponse.data._id;

      // Step B: Create a Razorpay Order
      const orderResponse = await api.post('/payments/create-order', {
        amount: totalPrice,
        bookingId
      });
      const order = orderResponse.data;

      // Step C: Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SulFzUuOOfYfCg', // fallback to test key
        amount: order.amount,
        currency: order.currency,
        name: 'AgriRent',
        description: `Booking for ${equipment.title}`,
        image: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png', // Tractor icon
        order_id: order.id,
        handler: async function (response) {
          try {
            // Step D: Verify payment on our backend
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId
            });
            
            // Payment successful, redirect to a success page or bookings page
            navigate('/bookings', { state: { successMessage: 'Booking confirmed successfully!' } });
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
            setProcessing(false);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone || ''
        },
        theme: {
          color: '#10b981' // emerald-500
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        setError(response.error.description || 'Payment failed');
        setProcessing(false);
      });

      rzp.open();

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error && !equipment) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-rose-500 mb-4">{error}</p>
          <Link to={`/equipment/${id}`} className="text-emerald-600 hover:underline">Go back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={`/equipment/${id}`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Equipment
        </Link>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">Booking Summary</h2>
            </div>
            
            <div className="p-6">
              <div className="flex gap-4 mb-6">
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <img 
                    src={equipment?.images?.[0] || '/images/tractor.png'} 
                    alt={equipment?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">{equipment?.category}</p>
                  <h3 className="font-bold text-slate-900 line-clamp-2">{equipment?.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {equipment?.location?.village 
                      ? `${equipment.location.village}, ${equipment.location.district}, ${equipment.location.state}` 
                      : equipment?.location?.district 
                        ? `${equipment.location.district}, ${equipment.location.state}` 
                        : equipment?.location}
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Dates</span>
                  <span className="font-medium text-slate-900">
                    {startDate && format(new Date(startDate), 'MMM d, yyyy')} - {endDate && format(new Date(endDate), 'MMM d, yyyy')}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Owner</span>
                  <span className="font-medium text-slate-900 flex items-center gap-1">
                    {equipment?.owner?.name} <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Rental Price</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Platform Fee</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Amount</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Payment & Checkout */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-500" />
                Payment Details
              </h2>
              
              <p className="text-sm text-slate-500 mb-6">
                You will be securely redirected to Razorpay to complete your payment. 
                We support UPI, Cards, NetBanking, and Wallets.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 text-rose-600 text-sm border border-rose-100">
                  {error}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay ₹{totalPrice} Securely
                  </>
                )}
              </button>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <p>Your payment is 100% secure. We do not store your card details.</p>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <p>Free cancellation up to 48 hours before pick-up.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
