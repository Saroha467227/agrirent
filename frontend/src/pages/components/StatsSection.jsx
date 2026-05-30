import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '10K+', label: 'Active Farmers' },
  { value: '5K+', label: 'Machines Listed' },
  { value: '100+', label: 'Cities Covered' },
  { value: '99%', label: 'Satisfaction Rate' }
];

const StatsSection = () => {
  return (
    <section className="py-20 relative overflow-hidden border-y border-white/5 bg-slate-900/50">
      <div className="absolute inset-0 bg-emerald-900/5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-2">
                <span className="gradient-text">{stat.value}</span>
              </div>
              <p className="text-sm md:text-base font-medium text-slate-400 uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
