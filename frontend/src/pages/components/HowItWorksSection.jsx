import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Tractor } from 'lucide-react';

const steps = [
  {
    icon: <Search className="w-8 h-8 text-emerald-400" />,
    title: 'Browse Equipment',
    description: 'Search our verified catalog by category, location, and price. View detailed photos and real farmer reviews.'
  },
  {
    icon: <Calendar className="w-8 h-8 text-emerald-400" />,
    title: 'Book & Pay Securely',
    description: 'Select your dates and pay instantly via Razorpay. Your money is held securely until the rental is complete.'
  },
  {
    icon: <Tractor className="w-8 h-8 text-emerald-400" />,
    title: 'Start Farming',
    description: 'Pick up the equipment or get it delivered. Focus on your harvest while we handle the paperwork.'
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How AgriRent Works
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Three simple steps to access the machinery you need. No complicated contracts, no hidden fees.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0" />

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative text-center"
              >
                <div className="relative w-24 h-24 mx-auto mb-8">
                  {/* Glowing backdrop */}
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl" />
                  {/* Icon container */}
                  <div className="relative w-full h-full glass rounded-full flex items-center justify-center border border-emerald-500/30 bg-slate-900/80">
                    {step.icon}
                  </div>
                  {/* Step Number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-emerald-950 font-bold rounded-full flex items-center justify-center border-2 border-slate-950">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
