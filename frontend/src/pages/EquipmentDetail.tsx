import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, Share2,
  Calendar, Shield, CheckCircle2, MessageSquare,
  Heart
} from 'lucide-react';
import gsap from 'gsap';
import { useEquipmentDetail } from '@/hooks/useEquipment';
import EquipmentCard from '@/components/EquipmentCard';

export default function EquipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedDates, setSelectedDates] = useState({ start: '', end: '' });
  const sectionRef = useRef<HTMLDivElement>(null);

  const { equipment, loading, error } = useEquipmentDetail(id);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [id, loading]);

  if (loading) {
    return (
      <main className="min-h-screen bg-cream pt-24 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-cream pt-24 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <Link to="/catalog" className="text-terracotta hover:underline mt-4 inline-block">
            Back to Catalog
          </Link>
        </div>

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

  // TODO: Fetch similar equipment from API. For now, empty array.
  const similarEquipment: any[] = [];

  const availabilityConfig = {
    available: { label: 'Available Now', className: 'bg-sage' },
    booked: { label: 'Booked', className: 'bg-accent-gold' },
    coming_soon: { label: 'Coming Soon', className: 'bg-text-muted' },
  };

  const avail = availabilityConfig[equipment.availability];

  const handleBookNow = () => {
    navigate(`/book/${equipment.id}`);
  };

  return (
    <main ref={sectionRef} className="min-h-screen bg-cream pt-16">
      {/* Breadcrumb */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Link to="/catalog" className="hover:text-terracotta transition-colors">Catalog</Link>
          <span>/</span>
          <Link to={`/catalog?category=${equipment.category}`} className="hover:text-terracotta transition-colors">
            {equipment.category}
          </Link>
          <span>/</span>
          <span className="text-text-primary">{equipment.name}</span>
        </div>
      </div>

      {/* Title + Owner */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif font-h1 text-text-primary">{equipment.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <img
                src={equipment.owner.avatar}
                alt={equipment.owner.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm text-text-secondary">
                Listed by <span className="font-medium text-text-primary">{equipment.owner.name}</span>
              </span>
              <span className="text-terracotta text-sm font-medium cursor-pointer hover:underline">
                View Profile
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2.5 rounded-lg border transition-colors ${
                isBookmarked ? 'bg-terracotta border-terracotta text-white' : 'border-stone-dark text-text-secondary hover:bg-stone'
              }`}
              aria-label="Bookmark"
            >
              <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2.5 rounded-lg border border-stone-dark text-text-secondary hover:bg-stone transition-colors" aria-label="Share">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Gallery + Info */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone">
              <img
                src={equipment.gallery[activeImage] || equipment.image}
                alt={equipment.name}
                className="w-full h-full object-cover"
              />
            </div>
            {equipment.gallery.length > 1 && (
              <div className="flex gap-2 mt-3">
                {equipment.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                      activeImage === i ? 'border-terracotta' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-text-primary">${equipment.pricePerDay}</span>
              <span className="text-text-muted">/day</span>
            </div>
            <p className="text-sm text-text-muted mt-1">Minimum {equipment.minDays} days</p>

            {/* Availability Badge */}
            <div className="mt-4">
              <span className={`inline-flex items-center ${avail.className} text-white text-sm font-medium rounded-pill px-4 py-2`}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {avail.label}
              </span>
            </div>

            {/* Specs */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(equipment.specs).map(([key, value]) => (
                <div key={key} className="bg-stone/50 rounded-lg p-3">
                  <p className="text-xs text-text-muted uppercase tracking-wider">{key}</p>
                  <p className="text-sm font-medium text-text-primary mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mt-6">
              <p className="text-text-secondary leading-relaxed">{equipment.description}</p>
            </div>

            {/* Features */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-text-primary mb-3">Features</h4>
              <div className="flex flex-wrap gap-2">
                {equipment.features.map((feature) => (
                  <span
                    key={feature}
                    className="bg-stone text-text-secondary text-xs font-medium rounded-pill px-3 py-1.5"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Date Selection */}
            <div className="mt-6 bg-white rounded-xl border border-stone-dark p-4">
              <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-terracotta" />
                Select Dates
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={selectedDates.start}
                    onChange={(e) => setSelectedDates({ ...selectedDates, start: e.target.value })}
                    className="w-full border border-stone-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1 block">End Date</label>
                  <input
                    type="date"
                    value={selectedDates.end}
                    onChange={(e) => setSelectedDates({ ...selectedDates, end: e.target.value })}
                    className="w-full border border-stone-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBookNow}
                className="btn-primary flex-1 text-center justify-center"
              >
                Request Rental
              </button>
              <button className="btn-secondary flex-1 text-center justify-center flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Contact Owner
              </button>
            </div>

            {/* Insurance Note */}
            <div className="mt-4 flex items-start gap-2 bg-sage/10 rounded-lg p-3">
              <Shield className="w-4 h-4 text-sage shrink-0 mt-0.5" />
              <p className="text-xs text-text-secondary">
                Damage protection available for ${Math.round(equipment.pricePerDay * 0.05)}/day. Covers accidental damage up to $10,000.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Card */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-stone rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <img
            src={equipment.owner.avatar}
            alt={equipment.owner.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text-primary">{equipment.owner.name}</h3>
            <p className="text-sm text-text-secondary">Member since {equipment.owner.memberSince}</p>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent-gold text-accent-gold" />
                <span className="text-sm font-medium">{equipment.owner.rating}</span>
              </div>
              <span className="text-sm text-text-muted">{equipment.owner.responseRate} response rate</span>
            </div>
          </div>
          <Link
            to="/catalog"
            className="text-terracotta text-sm font-medium hover:underline shrink-0"
          >
            View All Listings
          </Link>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <h2 className="font-serif font-h2 text-text-primary">Reviews ({equipment.reviewCount})</h2>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-4xl font-semibold text-text-primary">{equipment.rating}</span>
          <div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(equipment.rating) ? 'fill-accent-gold text-accent-gold' : 'text-stone-dark'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-text-muted mt-1">{equipment.reviewCount} reviews</p>
          </div>
        </div>

        {/* Sample Reviews */}
        <div className="mt-6 space-y-4">
          {[
            { name: 'Tom Bradley', date: '2 weeks ago', rating: 5, text: 'Excellent equipment, well maintained. The owner was very responsive and helpful with pickup arrangements. Will definitely rent again.' },
            { name: 'Lisa Chen', date: '1 month ago', rating: 4, text: 'Great tractor, performed flawlessly during our planting season. Minor cosmetic wear but mechanically sound. Fair pricing too.' },
            { name: 'Mark Johnson', date: '2 months ago', rating: 5, text: 'Outstanding experience from start to finish. The GPS system saved us so much time. Highly recommend!' },
          ].map((review, i) => (
            <div key={i} className="border-b border-stone-dark pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-dark flex items-center justify-center text-sm font-medium text-text-primary">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{review.name}</p>
                  <p className="text-xs text-text-muted">{review.date}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mt-2">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-3.5 h-3.5 ${
                      j < review.rating ? 'fill-accent-gold text-accent-gold' : 'text-stone-dark'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-text-secondary mt-2">{review.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Equipment */}
      {similarEquipment.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-16">
          <h2 className="font-serif font-h2 text-text-primary">Similar Equipment</h2>
          <div className="flex gap-4 mt-6 overflow-x-auto pb-4 snap-x">
            {similarEquipment.map((eq) => (
              <div key={eq.id} className="snap-start shrink-0 w-[280px]">
                <EquipmentCard equipment={eq} compact />
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
