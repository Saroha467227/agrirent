import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CTABanner() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current!.querySelectorAll('.animate-in'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-24 bg-stone">
      <div className="max-w-[36rem] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="animate-in font-serif font-h2 text-text-primary">
          Ready to Put Your Equipment to Work?
        </h2>
        <p className="animate-in text-text-secondary mt-3 leading-relaxed">
          List your tractor, harvester, or implements and start earning passive income during the off-season.
        </p>
        <div className="animate-in mt-8">
          <Link
            to="/login?mode=signup"
            className="btn-primary inline-flex items-center text-base px-8 py-4"
          >
            List Your Equipment
          </Link>
        </div>
      </div>
    </section>
  );
}
