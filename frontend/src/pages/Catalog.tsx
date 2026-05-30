import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid3X3, List, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { categories } from '@/data/equipment';
import EquipmentCard from '@/components/EquipmentCard';
import { useEquipmentList } from '@/hooks/useEquipment';

gsap.registerPlugin(ScrollTrigger);

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('minPrice') || 0),
    Number(searchParams.get('maxPrice') || 1000),
  ]);
  const [availabilityFilter, setAvailabilityFilter] = useState(searchParams.get('availability') || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Sync URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.q = searchQuery;
    if (selectedCategory !== 'All') params.category = selectedCategory;
    if (priceRange[0] > 0) params.minPrice = String(priceRange[0]);
    if (priceRange[1] < 1000) params.maxPrice = String(priceRange[1]);
    if (availabilityFilter !== 'all') params.availability = availabilityFilter;
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategory, priceRange, availabilityFilter]);

  const { equipment, loading, error, fetchEquipment } = useEquipmentList({
    search: searchQuery,
    category: selectedCategory,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
  });

  // Re-fetch when filters change (debounced search would be better here, but for now we fetch directly)
  useEffect(() => {
    fetchEquipment({
      search: searchQuery,
      category: selectedCategory,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
    });
  }, [searchQuery, selectedCategory, priceRange, fetchEquipment]);

  const filteredEquipment = useMemo(() => {
    return equipment.filter((eq) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          eq.name.toLowerCase().includes(q) ||
          eq.category.toLowerCase().includes(q) ||
          eq.location.toLowerCase().includes(q) ||
          eq.owner.name.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Category
      if (selectedCategory !== 'All' && eq.category !== selectedCategory) return false;
      // Price
      if (eq.pricePerDay < priceRange[0] || eq.pricePerDay > priceRange[1]) return false;
      // Availability
      if (availabilityFilter !== 'all' && eq.availability !== availabilityFilter) return false;
      return true;
    });
  }, [searchQuery, selectedCategory, priceRange, availabilityFilter]);

  // Entrance animation
  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current!.querySelectorAll('.eq-card'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [filteredEquipment]);

  const activeFiltersCount = [
    selectedCategory !== 'All',
    priceRange[0] > 0 || priceRange[1] < 1000,
    availabilityFilter !== 'all',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory('All');
    setPriceRange([0, 1000]);
    setAvailabilityFilter('all');
    setSearchQuery('');
  };

  return (
    <main className="min-h-screen bg-cream pt-16">
      {/* Catalog Header */}
      <div className="bg-charcoal py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif font-h1 text-white">Equipment Catalog</h1>
          <div className="mt-6 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tractors, harvesters..."
              className="w-full bg-white/10 border border-white/20 rounded-pill py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-terracotta transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 z-30 bg-cream border-b border-stone-dark">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-terracotta text-white border-terracotta'
                  : 'bg-white border-stone-dark text-text-secondary hover:bg-stone'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Active Filter Pills */}
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-terracotta text-white rounded-pill px-3 py-1.5 text-xs font-medium">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('All')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 1000) && (
              <span className="inline-flex items-center gap-1 bg-terracotta text-white rounded-pill px-3 py-1.5 text-xs font-medium">
                ${priceRange[0]} - ${priceRange[1]}
                <button onClick={() => setPriceRange([0, 1000])}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {availabilityFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-terracotta text-white rounded-pill px-3 py-1.5 text-xs font-medium">
                {availabilityFilter}
                <button onClick={() => setAvailabilityFilter('all')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Results Count */}
            <span className="text-sm text-text-secondary ml-auto">
              Showing {filteredEquipment.length} result{filteredEquipment.length !== 1 ? 's' : ''}
            </span>

            {/* View Toggle */}
            <div className="hidden sm:flex items-center border border-stone-dark rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-terracotta text-white' : 'bg-white text-text-secondary hover:bg-stone'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-terracotta text-white' : 'bg-white text-text-secondary hover:bg-stone'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-stone-dark grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Category */}
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedCategory === cat
                          ? 'bg-terracotta text-white'
                          : 'bg-stone text-text-secondary hover:bg-stone-dark'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">
                  Max Price: ${priceRange[1]}/day
                </label>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={50}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-terracotta"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>$0</span>
                  <span>$1000</span>
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Availability</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'available', label: 'Available Now' },
                    { value: 'coming_soon', label: 'Coming Soon' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setAvailabilityFilter(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        availabilityFilter === opt.value
                          ? 'bg-terracotta text-white'
                          : 'bg-stone text-text-secondary hover:bg-stone-dark'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-terracotta hover:underline mt-3"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div
          ref={gridRef}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
          }
        >
          {loading ? (
            <div className="col-span-full py-16 flex justify-center">
              <span className="w-8 h-8 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-16 text-red-500">
              {error}
            </div>
          ) : filteredEquipment.length > 0 ? (
            filteredEquipment.map((equipment) => (
              <div key={equipment.id} className="eq-card">
                {viewMode === 'grid' ? (
                  <EquipmentCard equipment={equipment} />
                ) : (
                  <div className="flex bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
                    <div className="w-48 sm:w-56 shrink-0">
                      <img
                        src={equipment.image}
                        alt={equipment.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{equipment.category}</p>
                        <h3 className="text-lg font-semibold text-text-primary mt-1">{equipment.name}</h3>
                        <p className="text-sm text-text-secondary mt-1">{equipment.location}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <img src={equipment.owner.avatar} alt={equipment.owner.name} className="w-5 h-5 rounded-full" />
                          <span className="text-xs text-text-secondary">by {equipment.owner.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-semibold">${equipment.pricePerDay}<span className="text-sm font-normal text-text-muted">/day</span></span>
                        <span className="bg-terracotta text-white rounded-pill px-4 py-2 text-sm font-medium hover:bg-terracotta-hover transition-colors cursor-pointer">
                          View Details
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-text-muted text-lg">No equipment found matching your criteria.</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-terracotta hover:underline text-sm font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
