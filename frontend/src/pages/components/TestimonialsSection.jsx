import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Ramesh Singh",
    role: "Wheat Farmer, Punjab",
    content: "AgriRent completely changed how I manage my harvests. I used to rely on expensive middlemen for harvesters, but now I book directly from verified owners. The equipment is always top-notch and arrives on time.",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=Ramesh+Singh&background=10b981&color=fff&size=150"
  },
  {
    id: 2,
    name: "Suresh Kumar",
    role: "Equipment Owner, Haryana",
    content: "Listing my tractors on AgriRent has become my main source of secondary income. The platform handles all the payments securely via Razorpay, and I can manage my bookings from my phone. Highly recommended for owners.",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=Suresh+Kumar&background=0284c7&color=fff&size=150"
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Sugarcane Farmer, Gujarat",
    content: "The interface is incredibly easy to use, even for someone who isn't very tech-savvy. Being able to read reviews from other farmers before booking gives me the confidence to rent expensive machinery without worry.",
    rating: 4,
    image: "https://ui-avatars.com/api/?name=Amit+Patel&background=8b5cf6&color=fff&size=150"
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoplay]);

  const handleNext = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-slate-900/50 border-y border-white/5" id="testimonials">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Farmer Stories
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
          >
            Trusted by thousands of <br className="hidden sm:block" />
            <span className="gradient-text">Indian Farmers.</span>
          </motion.h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-12 z-20">
            <button onClick={handlePrev} className="p-2 sm:p-3 rounded-full glass hover:bg-emerald-500/20 hover:text-emerald-400 transition-all text-slate-400 border border-white/10">
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-12 z-20">
            <button onClick={handleNext} className="p-2 sm:p-3 rounded-full glass hover:bg-emerald-500/20 hover:text-emerald-400 transition-all text-slate-400 border border-white/10">
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Slider */}
          <div className="overflow-hidden px-4 sm:px-8 py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="glass rounded-3xl p-8 sm:p-12 border border-white/10 relative shadow-2xl"
              >
                <Quote className="absolute top-8 right-8 w-16 h-16 text-white/5" />
                
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonials[currentIndex].rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} 
                    />
                  ))}
                </div>

                <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed font-medium mb-10 relative z-10">
                  "{testimonials[currentIndex].content}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500/30">
                    <img 
                      src={testimonials[currentIndex].image} 
                      alt={testimonials[currentIndex].name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{testimonials[currentIndex].name}</h4>
                    <p className="text-emerald-400 text-sm font-medium">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setAutoplay(false);
                  setCurrentIndex(i);
                }}
                className={`transition-all duration-300 rounded-full h-2 ${
                  i === currentIndex ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
