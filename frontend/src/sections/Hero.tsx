import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const tractorRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Entrance animations
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tl.fromTo(badgeRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(headlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
      .fromTo(subheadRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.55')
      .fromTo(ctaRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.55');
  }, []);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Tractor parallax
  useEffect(() => {
    if (tractorRef.current) {
      const rotateY = mousePos.x * 15;
      const rotateX = -mousePos.y * 8;
      tractorRef.current.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    }
  }, [mousePos]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100dvh] overflow-hidden bg-cream"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Aerial view of agricultural fields"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to right, rgba(250,247,242,0.97) 0%, rgba(250,247,242,0.85) 35%, rgba(250,247,242,0.5) 60%, transparent 80%)',
        }}
      />

      {/* 3D Tractor Showcase */}
      <div
        className="absolute z-[2] hidden lg:block"
        style={{
          top: '50%',
          right: '5%',
          transform: 'translateY(-50%)',
          width: '50vw',
          height: '75vh',
        }}
      >
        <div
          ref={tractorRef}
          className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <img
            src="/images/detail-gallery-1.jpg"
            alt="3D Tractor Model"
            className="max-w-full max-h-full object-contain drop-shadow-2xl"
            style={{
              filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.3))',
            }}
          />
        </div>
        {/* Platform Glow Ring */}
        <div
          className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[60%] h-4 rounded-full opacity-40"
          style={{
            background: 'radial-gradient(ellipse, rgba(199,91,57,0.5) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-[3] flex items-center min-h-[100dvh]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-[38rem] pt-20 lg:pt-0">
            {/* Badge */}
            <div ref={badgeRef} className="inline-block opacity-0">
              <span className="inline-flex items-center bg-stone text-text-secondary rounded-pill px-4 py-2 text-sm font-medium">
                Agricultural Equipment Rental
              </span>
            </div>

            {/* Headline */}
            <h1
              ref={headlineRef}
              className="font-serif font-display text-text-primary mt-6 opacity-0"
            >
              Rent the Right Equipment, Right When You Need It
            </h1>

            {/* Subhead */}
            <p
              ref={subheadRef}
              className="text-lg text-text-secondary mt-5 max-w-[28rem] leading-relaxed opacity-0"
            >
              From tractors to harvesters, connect with local equipment owners and keep your farm running year-round.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-wrap gap-4 mt-8 opacity-0">
              <Link
                to="/catalog"
                className="btn-primary inline-flex items-center"
              >
                Browse Equipment
              </Link>
              <Link
                to="/login?mode=signup"
                className="btn-secondary inline-flex items-center"
              >
                List Your Equipment
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] animate-bounce-down opacity-40">
        <ChevronDown className="w-6 h-6 text-text-primary" />
      </div>
    </section>
  );
}
