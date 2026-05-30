import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Loader2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const EquipmentSection = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const { data } = await api.get('/equipment');
        // Only show up to 4 featured items on the home page
        setEquipment(data.slice(0, 4));
        setLoading(false);
      } catch (err) {
        setError('Failed to load equipment');
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);
  return (
    <section className="py-24 relative" id="equipment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Premium Machinery, <br />
              <span className="text-emerald-400">Ready to Deploy.</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Browse our selection of top-rated equipment. Maintained by verified owners and ready for your next harvest.
            </p>
          </div>
          <button className="group flex items-center gap-2 text-emerald-400 font-medium hover:text-emerald-300 transition-colors">
            View full catalog
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12 text-rose-400">{error}</div>
          ) : equipment.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-400">No equipment found.</div>
          ) : equipment.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group glass rounded-2xl border border-white/5 overflow-hidden hover:border-emerald-500/30 transition-colors flex flex-col"
            >
              {/* Header with Category Icon */}
              <div className="relative aspect-[5/3] bg-gradient-to-br from-emerald-500/10 via-slate-800/50 to-slate-900/50 p-6 overflow-hidden flex items-center justify-center">
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 z-10">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-white">{item.rating || '4.9'}</span>
                  <span className="text-xs text-slate-400">({item.reviews || Math.floor(Math.random() * 100 + 20)})</span>
                </div>
                
                <div className="absolute top-3 right-3 z-10">
                  {item.isAvailable ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Available
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium">
                      Booked
                    </span>
                  )}
                </div>

                {/* Category Icon */}
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0h-2.25m0 0V5.625c0-.621.504-1.125 1.125-1.125h3.026a2.999 2.999 0 012.287 1.059l1.838 2.174" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs font-medium text-emerald-400 mb-1 uppercase tracking-wider">{item.category}</p>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{item.title}</h3>
                
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                  <MapPin className="w-4 h-4" />
                  {item.location?.village ? `${item.location.village}, ${item.location.district}, ${item.location.state}` : item.location?.district ? `${item.location.district}, ${item.location.state}` : item.location}
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-white">₹{item.pricePerDay}</span>
                    <span className="text-sm text-slate-500"> /day</span>
                  </div>
                  <Link 
                    to={item.isAvailable ? `/equipment/${item._id}` : '#'}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      item.isAvailable
                        ? 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    {item.isAvailable ? 'Book Now' : 'Unavailable'}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EquipmentSection;
