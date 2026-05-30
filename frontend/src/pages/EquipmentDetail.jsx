import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Star, Calendar as CalendarIcon, CheckCircle2, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { differenceInDays, addDays } from 'date-fns';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 1));
  const [totalPrice, setTotalPrice] = useState(0);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      try {
        const { data } = await api.get(`/equipment/${id}`);
        setEquipment(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load equipment details');
        setLoading(false);
      }
    };
    fetchEquipmentDetails();
  }, [id]);

  useEffect(() => {
    if (equipment && startDate && endDate) {
      const days = differenceInDays(endDate, startDate);
      // Min 1 day booking
      const validDays = Math.max(1, days);
      setTotalPrice(validDays * equipment.pricePerDay);
    }
  }, [startDate, endDate, equipment]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/equipment/${id}` } } });
      return;
    }
    // Pass booking details via state to a checkout/booking page, or open modal here.
    // We will build the checkout flow in Part 2. For now, navigate to a placeholder checkout URL
    navigate(`/checkout/${id}`, { state: { startDate, endDate, totalPrice } });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <p className="text-rose-500 mb-4">{error || 'Equipment not found'}</p>
          <Link to="/equipment" className="text-emerald-600 font-medium hover:underline">
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/equipment" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to all equipment
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="aspect-[16/9] bg-slate-100 relative">
                <img 
                  src={equipment.images && equipment.images.length > 0 ? equipment.images[0] : `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="none"><rect width="200" height="200" rx="16" fill="%230f172a"/><text x="100" y="108" text-anchor="middle" fill="%2334d399" font-size="14" font-family="sans-serif">No Image</text></svg>')}`} 
                  alt={equipment.title}
                  className="w-full h-full object-cover"
                />
                {!equipment.isAvailable && (
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                    <span className="px-4 py-2 bg-rose-500 text-white rounded-full font-bold shadow-lg">Currently Unavailable</span>
                  </div>
                )}
              </div>
              {equipment.images && equipment.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-2">
                  {equipment.images.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="aspect-video bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-md">
                      {equipment.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm font-medium text-slate-600">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      4.9 (128 reviews)
                    </div>
                  </div>
                  <h1 className="text-3xl font-extrabold text-slate-900">{equipment.title}</h1>
                  <div className="flex items-center gap-2 text-slate-500 mt-2">
                    <MapPin className="w-4 h-4" />
                    {equipment.location?.village ? `${equipment.location.village}, ${equipment.location.district}, ${equipment.location.state}` : equipment.location?.district ? `${equipment.location.district}, ${equipment.location.state}` : equipment.location}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Description</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {equipment.description}
                </p>
              </div>

              {/* Owner Info */}
              <div className="border-t border-slate-100 pt-6 mt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Owner Information</h3>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl shadow-inner">
                    {equipment.owner?.name?.charAt(0) || 'O'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                      {equipment.owner?.name || 'Verified Owner'}
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </p>
                    <p className="text-sm text-slate-500">Member since 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200 p-6 sticky top-24">
              <div className="flex items-end gap-2 mb-6">
                <span className="text-3xl font-extrabold text-slate-900">₹{equipment.pricePerDay}</span>
                <span className="text-slate-500 mb-1">/ day</span>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select Dates</label>
                  <div className="grid grid-cols-2 gap-3 relative z-20">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Pick-up</div>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Drop-off</div>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>₹{equipment.pricePerDay} × {Math.max(1, differenceInDays(endDate, startDate))} days</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 mb-3 pb-3 border-b border-slate-200">
                    <span>Platform Fee</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  disabled={!equipment.isAvailable || (user && user._id === equipment.owner?._id)}
                  className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all ${
                    !equipment.isAvailable || (user && user._id === equipment.owner?._id)
                      ? 'bg-slate-300 cursor-not-allowed shadow-none'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25'
                  }`}
                >
                  {user && user._id === equipment.owner?._id 
                    ? "This is your listing" 
                    : !equipment.isAvailable 
                      ? "Not Available" 
                      : "Book Now"}
                </button>

                <ul className="text-xs text-slate-500 space-y-2 mt-4">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Free cancellation up to 48 hours</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Equipment guarantee</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;
