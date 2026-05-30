import { useRef, useEffect } from 'react';
import { Search, Calendar, Handshake, Tractor } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { howItWorksSteps } from '@/data/equipment';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="w-12 h-12 text-terracotta" strokeWidth={1.5} />,
  Calendar: <Calendar className="w-12 h-12 text-terracotta" strokeWidth={1.5} />,
  Handshake: <Handshake className="w-12 h-12 text-terracotta" strokeWidth={1.5} />,
  Tractor: <Tractor className="w-12 h-12 text-terracotta" strokeWidth={1.5} />,
};

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current!.querySelectorAll('.step-card'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-20 lg:py-24 bg-charcoal text-white"
    >
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif font-h2 text-white">How AgriRent Works</h2>
          <p className="text-white/60 mt-2 max-w-md mx-auto">
            Four simple steps to get the equipment you need
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {howItWorksSteps.map((step) => (
            <div key={step.number} className="step-card text-center">
              {/* Step Number */}
              <div className="w-14 h-14 mx-auto rounded-full border-2 border-white/20 flex items-center justify-center">
                <span className="font-serif text-2xl text-white">{step.number}</span>
              </div>

              {/* Icon */}
              <div className="mt-5 flex justify-center">
                {iconMap[step.icon]}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-white mt-4">{step.title}</h3>

              {/* Description */}
              <p className="text-sm text-white/60 mt-2 max-w-[16rem] mx-auto leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
