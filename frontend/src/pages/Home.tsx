import Hero from '@/sections/Hero';
import FeaturedEquipment from '@/sections/FeaturedEquipment';
import HowItWorks from '@/sections/HowItWorks';
import Testimonials from '@/sections/Testimonials';
import StatsBar from '@/sections/StatsBar';
import CTABanner from '@/sections/CTABanner';

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedEquipment />
      <HowItWorks />
      <Testimonials />
      <StatsBar />
      <CTABanner />
    </main>
  );
}
