import React from 'react';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import EquipmentSection from './components/EquipmentSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import MouseGlow from './components/MouseGlow';

const Home = () => {
  return (
    <div className="bg-[#020617] text-white min-h-screen selection:bg-emerald-500/30 selection:text-emerald-100 relative">
      <MouseGlow />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <EquipmentSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Home;
