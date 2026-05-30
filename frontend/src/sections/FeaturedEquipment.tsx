import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { categories } from '@/data/equipment';
import EquipmentCard from '@/components/EquipmentCard';
import { useEquipmentList } from '@/hooks/useEquipment';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedEquipment() {
  const [activeCategory, setActiveCategory] = useState('All');
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { equipment, loading, error } = useEquipmentList();

  const filteredEquipment = activeCategory === 'All'
    ? equipment.slice(0, 6)
    : equipment.filter((e) => e.category === activeCategory).slice(0, 6);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current!.querySelectorAll('.animate-in'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Crossfade animation on category change
  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [activeCategory]);

  return (
    <section ref={sectionRef} className="py-20 lg:py-24 bg-cream">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center animate-in">
          <h2 className="font-serif font-h2 text-text-primary">Popular This Season</h2>
          <p className="text-text-secondary mt-2 max-w-md mx-auto">
            Browse the most requested equipment from farmers in your area
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mt-8 animate-in">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-pill text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-terracotta text-white'
                  : 'bg-stone text-text-secondary hover:bg-stone-dark'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Equipment Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
        >
          {loading ? (
            <div className="col-span-full py-12 flex justify-center">
              <span className="w-8 h-8 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12 text-red-500">
              {error}
            </div>
          ) : filteredEquipment.length > 0 ? (
            filteredEquipment.map((eq) => (
              <div key={eq.id} className="animate-in">
                <EquipmentCard equipment={eq} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-text-muted">
              No equipment found for this category.
            </div>
          )}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10 animate-in">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-terracotta font-medium text-sm hover:underline transition-all"
          >
            View All Equipment
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
