import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Filter, Star, Loader2, List, LayoutGrid } from 'lucide-react';
import api from '../api/axios';
import { locationData } from '../utils/locationData';

const CATEGORIES = ['Tractor', 'Harvester', 'Plow', 'Seeder', 'Other'];

const Equipment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Form states mapped to URL params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    state: searchParams.get('state') || '',
    district: searchParams.get('district') || '',
    village: searchParams.get('village') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  const states = Object.keys(locationData);
  const districts = filters.state ? Object.keys(locationData[filters.state]) : [];
  const villages = filters.district && filters.state ? locationData[filters.state][filters.district] : [];

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError('');
      // Convert URL searchParams to a string for axios
      const queryString = searchParams.toString();
      const { data } = await api.get(`/equipment?${queryString}`);
      setEquipment(data);
    } catch (err) {
      setError('Failed to fetch equipment listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [searchParams]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Equipment Marketplace</h1>
            <p className="text-slate-500 mt-1">Find and book the right machinery for your farm.</p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
              aria-label="Grid View"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
              aria-label="List View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <div className="flex items-center gap-2 font-semibold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                <Filter className="w-5 h-5 text-emerald-500" />
                Filters
              </div>

              <form onSubmit={applyFilters} className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="e.g. Tractor"
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-colors"
                    />
                  </div>
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                  <select
                    name="state"
                    value={filters.state}
                    onChange={(e) => setFilters({ ...filters, state: e.target.value, district: '', village: '' })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-colors"
                  >
                    <option value="">All States</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">District</label>
                  <select
                    name="district"
                    value={filters.district}
                    onChange={(e) => setFilters({ ...filters, district: e.target.value, village: '' })}
                    disabled={!filters.state}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-colors disabled:opacity-50"
                  >
                    <option value="">All Districts</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>

                {/* Village */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Village / City</label>
                  <select
                    name="village"
                    value={filters.village}
                    onChange={handleFilterChange}
                    disabled={!filters.district}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-colors disabled:opacity-50"
                  >
                    <option value="">All Villages</option>
                    {villages.map(village => (
                      <option key={village} value={village}>{village}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-colors"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Price per day (₹)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-colors"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-emerald-500/20"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilters({ search: '', state: '', district: '', category: '', minPrice: '', maxPrice: '' });
                    setSearchParams({});
                  }}
                  className="w-full mt-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
                >
                  Clear All
                </button>
              </form>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
                <p className="text-slate-500">Loading equipment...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">{error}</div>
            ) : equipment.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No equipment found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'flex flex-col gap-6'}>
                {equipment.map(item => (
                  <div 
                    key={item._id} 
                    className={`bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all group ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : 'flex flex-col'}`}
                  >
                    {/* Image */}
                    <div className={`relative bg-slate-100 ${viewMode === 'list' ? 'w-full sm:w-64 shrink-0' : 'w-full aspect-[4/3]'}`}>
                      <img 
                        src={item.images && item.images.length > 0 ? item.images[0] : '/images/tractor.png'} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        4.9
                      </div>
                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">Currently Booked</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">{item.category}</p>
                          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">
                            {item.title}
                          </h3>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xl font-bold text-slate-900">₹{item.pricePerDay}</span>
                          <span className="text-sm text-slate-500 block">/ day</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {item.location?.village ? `${item.location.village}, ${item.location.district}, ${item.location.state}` : item.location?.district ? `${item.location.district}, ${item.location.state}` : item.location}
                      </div>
                      
                      {viewMode === 'list' && (
                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                      )}

                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                            {item.owner?.name?.charAt(0) || 'O'}
                          </div>
                          <span className="text-sm text-slate-600">{item.owner?.name || 'Owner'}</span>
                        </div>
                        <Link 
                          to={`/equipment/${item._id}`}
                          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                            item.isAvailable 
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-50 text-slate-400 pointer-events-none'
                          }`}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equipment;
