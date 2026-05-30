import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, ShieldCheck, Zap, Users, Star, StarHalf, MapPin } from 'lucide-react';
import { locationData } from '../../utils/locationData';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const states = Object.keys(locationData);
  const districts = selectedState ? Object.keys(locationData[selectedState]) : [];
  const villages = selectedDistrict && selectedState ? locationData[selectedState][selectedDistrict] : [];

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#020617]" />
        
        {/* Animated Gradient Orbs */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-[20%] left-[10%] w-[40rem] h-[40rem] bg-emerald-500/20 rounded-full blur-[120px] mix-blend-screen"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] bg-lime-500/20 rounded-full blur-[100px] mix-blend-screen"
        />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-emerald-900/30 rounded-full blur-[150px] mix-blend-screen" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="text-left pt-10 lg:pt-0">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border-emerald-500/30 bg-emerald-500/10 mb-8"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-emerald-300">Modernizing Indian Agriculture</span>
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
            >
              Rent the Right <br className="hidden sm:block" />
              <span className="gradient-text">Farm Equipment</span> <br className="hidden sm:block" />
              When You Need It.
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed"
            >
              The premium marketplace connecting farmers with top-tier equipment owners. 
              Transparent pricing, secure payments, and verified machinery.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mt-10"
            >
              <form 
                action="/equipment" 
                method="GET"
                className="flex flex-col gap-2 p-2 rounded-2xl glass border border-emerald-500/20 bg-slate-900/50 backdrop-blur-md max-w-2xl"
              >
                <div className="flex items-center px-4 py-2 w-full">
                  <div className="w-5 h-5 text-emerald-400 shrink-0">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    name="search"
                    placeholder="Search tractors, harvesters..." 
                    className="w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-none focus:ring-0 ml-3 py-2 text-sm sm:text-base"
                  />
                </div>
                
                <div className="w-full h-[1px] bg-slate-700/50 shrink-0"></div>

                <div className="flex flex-col sm:flex-row items-center w-full divide-y sm:divide-y-0 sm:divide-x divide-slate-700/50">
                  <div className="flex items-center px-4 py-2 w-full">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <select 
                      name="state"
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        setSelectedDistrict('');
                      }}
                      className="w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-none focus:ring-0 ml-2 py-2 text-sm sm:text-base appearance-none cursor-pointer"
                    >
                      <option value="" className="text-slate-900">Select State</option>
                      {states.map(state => (
                        <option key={state} value={state} className="text-slate-900">{state}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center px-4 py-2 w-full">
                    <select 
                      name="district"
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      disabled={!selectedState}
                      className="w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-none focus:ring-0 ml-2 py-2 text-sm sm:text-base appearance-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="" className="text-slate-900">Select District</option>
                      {districts.map(district => (
                        <option key={district} value={district} className="text-slate-900">{district}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center px-4 py-2 w-full">
                    <select 
                      name="village"
                      disabled={!selectedDistrict}
                      className="w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-none focus:ring-0 ml-2 py-2 text-sm sm:text-base appearance-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="" className="text-slate-900">Select Village</option>
                      {villages.map(village => (
                        <option key={village} value={village} className="text-slate-900">{village}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full mt-2 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0"
                >
                  Search
                </button>
              </form>
            </motion.div>

            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mt-12 flex items-center gap-6 text-sm font-medium text-slate-400"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Verified Owners
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                Instant Booking
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                10k+ Farmers
              </div>
            </motion.div>
          </div>

          {/* Right Content - Floating Cards */}
          <div className="relative h-[500px] hidden lg:block">
            <motion.div
              style={{ y: useTransform(scrollY, [0, 500], [0, -50]) }}
              className="absolute top-10 right-0 w-[340px] glass rounded-3xl p-4 shadow-2xl border-white/10 animate-float-slow z-20"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-slate-900/50">
                <img src="/images/tractor.png" alt="Premium Tractor" className="w-full h-full object-contain p-4 drop-shadow-2xl hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg">John Deere 5050D</h3>
                  <p className="text-emerald-400 font-semibold mt-1">₹1,200 <span className="text-slate-400 text-sm font-normal">/ day</span></p>
                </div>
                <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-white">4.9</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{ y: useTransform(scrollY, [0, 500], [0, 80]) }}
              className="absolute bottom-10 left-0 w-[300px] glass rounded-3xl p-4 shadow-2xl border-white/10 animate-float z-10"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-slate-900/50">
                <img src="/images/harvester.png" alt="Combine Harvester" className="w-full h-full object-contain p-4 drop-shadow-2xl hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Mahindra Arjun 605</h3>
                  <p className="text-emerald-400 font-semibold mt-1">₹3,500 <span className="text-slate-400 text-sm font-normal">/ day</span></p>
                </div>
                <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-white">4.8</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Scroll</span>
        <div className="w-0.5 h-12 bg-white/10 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-emerald-500 rounded-full animate-[grid-move_2s_ease-in-out_infinite]" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
