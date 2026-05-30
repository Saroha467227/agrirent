import React from 'react';
import { motion } from 'framer-motion';
import { Shield, LayoutDashboard, CreditCard, CalendarCheck, MessageSquareHeart, Image as ImageIcon } from 'lucide-react';

const features = [
  {
    icon: <Shield className="w-6 h-6 text-emerald-400" />,
    title: 'JWT Authentication',
    description: 'Bank-grade security for your account and transactions. All data is encrypted and protected.',
    color: 'from-emerald-400/20 to-emerald-600/5',
    borderColor: 'group-hover:border-emerald-500/50'
  },
  {
    icon: <LayoutDashboard className="w-6 h-6 text-lime-400" />,
    title: 'Role-Based Dashboards',
    description: 'Customized interfaces for farmers, equipment owners, and admins. See exactly what you need.',
    color: 'from-lime-400/20 to-lime-600/5',
    borderColor: 'group-hover:border-lime-500/50'
  },
  {
    icon: <CreditCard className="w-6 h-6 text-amber-400" />,
    title: 'Razorpay Integration',
    description: 'Lightning-fast, secure online payments supporting UPI, cards, and net banking.',
    color: 'from-amber-400/20 to-amber-600/5',
    borderColor: 'group-hover:border-amber-500/50'
  },
  {
    icon: <CalendarCheck className="w-6 h-6 text-blue-400" />,
    title: 'Booking Management',
    description: 'Track rentals, manage schedules, and automate availability with our smart calendar system.',
    color: 'from-blue-400/20 to-blue-600/5',
    borderColor: 'group-hover:border-blue-500/50'
  },
  {
    icon: <MessageSquareHeart className="w-6 h-6 text-purple-400" />,
    title: 'Reviews & Ratings',
    description: 'Build trust through verified community reviews. Rent from top-rated owners with confidence.',
    color: 'from-purple-400/20 to-purple-600/5',
    borderColor: 'group-hover:border-purple-500/50'
  },
  {
    icon: <ImageIcon className="w-6 h-6 text-rose-400" />,
    title: 'Cloudinary Uploads',
    description: 'High-quality, optimized equipment imagery powered by cloud infrastructure.',
    color: 'from-rose-400/20 to-rose-600/5',
    borderColor: 'group-hover:border-rose-500/50'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="how-it-works">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Platform Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight"
          >
            Everything you need to <br className="hidden sm:block" />
            <span className="text-slate-400 font-medium">scale your farming.</span>
          </motion.h2>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className={`group relative glass rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 border border-white/5 ${feature.borderColor}`}
            >
              {/* Hover Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
