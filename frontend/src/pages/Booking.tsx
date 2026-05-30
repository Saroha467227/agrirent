import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, CheckCircle2, Calendar, Truck,
  UserCheck, Shield, CreditCard, ChevronRight
} from 'lucide-react';
import { useEquipmentDetail } from '@/hooks/useEquipment';
import api from '@/lib/api';

type BookingStep = 'dates' | 'details' | 'payment' | 'success';

export default function Booking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState<BookingStep>('dates');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('pickup');
  const [intendedUse, setIntendedUse] = useState('');
  const [experience, setExperience] = useState('');
  const [addInsurance, setAddInsurance] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { equipment, loading } = useEquipmentDetail(id);

  if (loading) {
    return (
      <main className="min-h-screen bg-cream pt-24 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
      </main>
    );
  }

  if (!equipment) {
    return (
      <main className="min-h-screen bg-cream pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-text-primary">Equipment not found</h2>
          <Link to="/catalog" className="text-terracotta hover:underline mt-4 inline-block">
            Back to Catalog
          </Link>
        </div>
      </main>
    );
  }

  const days = startDate && endDate
    ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const basePrice = equipment.pricePerDay * days;
  const deliveryFee = deliveryOption === 'delivery' ? 50 : 0;
  const insuranceFee = addInsurance ? 25 * days : 0;
  const serviceFee = Math.round(basePrice * 0.05);
  const total = basePrice + deliveryFee + insuranceFee + serviceFee;

  const handleNext = () => {
    if (step === 'dates') setStep('details');
    else if (step === 'details') setStep('payment');
  };

  const handleBack = () => {
    if (step === 'details') setStep('dates');
    else if (step === 'payment') setStep('details');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.post('/bookings', {
        equipmentId: id,
        startDate,
        endDate,
        totalPrice: total,
      });
      setStep('success');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels: { key: BookingStep; label: string; icon: React.ReactNode }[] = [
    { key: 'dates', label: 'Dates', icon: <Calendar className="w-4 h-4" /> },
    { key: 'details', label: 'Details', icon: <UserCheck className="w-4 h-4" /> },
    { key: 'payment', label: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <main className="min-h-screen bg-cream pt-16">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <button
          onClick={() => step === 'dates' ? navigate(`/equipment/${id}`) : handleBack()}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-terracotta transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {step === 'dates' ? 'Back to Equipment' : 'Back'}
        </button>

        {/* Title */}
        <h1 className="font-serif font-h1 text-text-primary mt-4">Book {equipment.name}</h1>

        {/* Step Indicator */}
        {step !== 'success' && (
          <div className="flex items-center gap-2 mt-6">
            {stepLabels.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    step === s.key
                      ? 'bg-terracotta text-white'
                      : stepLabels.findIndex(sl => sl.key === step) > i
                      ? 'bg-sage text-white'
                      : 'bg-stone text-text-secondary'
                  }`}
                >
                  {s.icon}
                  {s.label}
                </div>
                {i < stepLabels.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Dates */}
            {step === 'dates' && (
              <div className="bg-white rounded-xl border border-stone-dark p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Select Rental Dates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-stone-dark rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terracotta"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="w-full border border-stone-dark rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terracotta"
                    />
                  </div>
                </div>
                {days > 0 && (
                  <p className="mt-4 text-sm text-text-secondary">
                    Selected: {days} day{days !== 1 ? 's' : ''} rental period
                  </p>
                )}
                <button
                  onClick={handleNext}
                  disabled={!startDate || !endDate}
                  className="btn-primary mt-6 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 'details' && (
              <div className="space-y-6">
                {/* Delivery Option */}
                <div className="bg-white rounded-xl border border-stone-dark p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-terracotta" />
                    Delivery Option
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border border-stone-dark rounded-lg cursor-pointer hover:bg-stone/30 transition-colors">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryOption === 'pickup'}
                        onChange={() => setDeliveryOption('pickup')}
                        className="accent-terracotta"
                      />
                      <div>
                        <p className="text-sm font-medium text-text-primary">I&apos;ll pick it up</p>
                        <p className="text-xs text-text-muted">Free</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-stone-dark rounded-lg cursor-pointer hover:bg-stone/30 transition-colors">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryOption === 'delivery'}
                        onChange={() => setDeliveryOption('delivery')}
                        className="accent-terracotta"
                      />
                      <div>
                        <p className="text-sm font-medium text-text-primary">Delivery needed</p>
                        <p className="text-xs text-text-muted">+$50</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Intended Use */}
                <div className="bg-white rounded-xl border border-stone-dark p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Rental Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-text-primary mb-2 block">Intended Use</label>
                      <textarea
                        value={intendedUse}
                        onChange={(e) => setIntendedUse(e.target.value)}
                        placeholder="Describe how you'll use this equipment..."
                        rows={3}
                        className="w-full border border-stone-dark rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terracotta resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-primary mb-2 block">Operator Experience</label>
                      <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full border border-stone-dark rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terracotta bg-white"
                      >
                        <option value="">Select experience level</option>
                        <option value="experienced">Experienced operator</option>
                        <option value="training">Need training</option>
                        <option value="hiring">Hiring operator</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Insurance */}
                <div className="bg-white rounded-xl border border-stone-dark p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addInsurance}
                      onChange={(e) => setAddInsurance(e.target.checked)}
                      className="accent-terracotta mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium text-text-primary flex items-center gap-2">
                        <Shield className="w-4 h-4 text-sage" />
                        Add damage protection (+$25/day)
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        Covers accidental damage up to $10,000. Recommended for peace of mind.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleBack} className="btn-secondary">Back</button>
                  <button onClick={handleNext} className="btn-primary">Continue to Payment</button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 'payment' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-stone-dark p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-terracotta" />
                    Payment Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-text-primary mb-2 block">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full border border-stone-dark rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terracotta"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-text-primary mb-2 block">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full border border-stone-dark rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terracotta"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-text-primary mb-2 block">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full border border-stone-dark rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terracotta"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-primary mb-2 block">Name on Card</label>
                      <input
                        type="text"
                        placeholder="Full name"
                        className="w-full border border-stone-dark rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terracotta"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-white rounded-xl border border-stone-dark p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="accent-terracotta mt-0.5"
                    />
                    <p className="text-sm text-text-secondary">
                      I agree to the rental terms, including responsible use, return condition requirements, and liability policies.
                    </p>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleBack} className="btn-secondary">Back</button>
                  <button
                    onClick={handleSubmit}
                    disabled={!termsAccepted || isSubmitting}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      `Confirm Booking - $${total}`
                    )}
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
                )}
              </div>
            )}

            {/* Success */}
            {step === 'success' && (
              <div className="bg-white rounded-xl border border-sage/30 p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-sage/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-sage" />
                </div>
                <h2 className="font-serif text-2xl text-text-primary mt-4">Booking Requested!</h2>
                <p className="text-text-secondary mt-2 max-w-sm mx-auto">
                  Your rental request for <strong>{equipment.name}</strong> has been submitted. The owner will confirm within 24 hours.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/dashboard" className="btn-primary">View My Rentals</Link>
                  <Link to="/catalog" className="btn-secondary">Browse More Equipment</Link>
                </div>
              </div>
            )}
          </div>

          {/* Price Summary Sidebar */}
          {step !== 'success' && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-stone-dark p-6 sticky top-24">
                <h4 className="text-sm font-semibold text-text-primary mb-4">Rental Summary</h4>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-stone">
                  <img
                    src={equipment.image}
                    alt={equipment.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{equipment.name}</p>
                    <p className="text-xs text-text-muted">{equipment.location}</p>
                  </div>
                </div>

                {days > 0 && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">${equipment.pricePerDay} x {days} days</span>
                      <span className="text-text-primary">${basePrice}</span>
                    </div>
                    {deliveryFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Delivery</span>
                        <span className="text-text-primary">${deliveryFee}</span>
                      </div>
                    )}
                    {insuranceFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Insurance</span>
                        <span className="text-text-primary">${insuranceFee}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Service fee</span>
                      <span className="text-text-primary">${serviceFee}</span>
                    </div>
                  </div>
                )}

                {days === 0 && (
                  <p className="text-sm text-text-muted">Select dates to see pricing</p>
                )}

                <div className="mt-4 pt-4 border-t border-stone flex justify-between items-center">
                  <span className="text-base font-semibold text-text-primary">Total</span>
                  <span className="text-xl font-semibold text-text-primary">${total}</span>
                </div>

                {days > 0 && (
                  <p className="text-xs text-text-muted mt-2">
                    {startDate} to {endDate} ({days} days)
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
