import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowDown, Phone, WhatsappLogo, Star, Quotes, CaretLeft, CaretRight,
  CheckCircle, ShieldCheck, Wrench, Car, Clock, Eye, Target, Trophy,
} from '@phosphor-icons/react';
import PageTransition from '../components/PageTransition';
import siteData from '../data/siteData';

const iconMap = { Wrench, Car, ShieldCheck, Eye, Target, Trophy, Star };

function AnimatedCounter({ target, suffix = '', duration = 2.5 }) {
  const [count, setCount] = useState(0); const ref = useRef(null); const inView = useInView(ref, { once: true, margin: '-50px' }); const num = parseInt(String(target).replace(/[^0-9]/g, ''), 10) || 0;
  useEffect(() => { if (!inView) return; let s = 0; const inc = num / (duration * 60); const t = setInterval(() => { s += inc; if (s >= num) { setCount(num); clearInterval(t); } else setCount(Math.floor(s)); }, 1000/60); return () => clearInterval(t); }, [inView, num, duration]);
  return <span ref={ref}>{inView ? count.toLocaleString() : '0'}{suffix}</span>;
}

function NoiseTexture({ opacity = 0.035 }) {
  return <div className="absolute inset-0 pointer-events-none z-10" style={{ opacity, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }} />;
}

/* ================================================================ 1. HERO -- Split: Image Left, Content Right, Clean White + Orange ================================================================ */
function HeroSection() {
  const { hero } = siteData;
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-white">
      <NoiseTexture opacity={0.02} />
      <div className="grid lg:grid-cols-2 min-h-screen">
        <div className="relative overflow-hidden">
          <motion.img src={hero?.backgroundImages?.[0]?.url || 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1400&q=80'} alt="Vehicle Exchange Centre" className="absolute inset-0 w-full h-full object-cover object-center" style={{ scale: imgScale }} loading="eager" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
        </div>
        <motion.div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-24 lg:py-0 pt-36" style={{ y: textY }}>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <div className="w-12 h-[2px] bg-blue-600 mb-6" />
            <p className="text-blue-600 text-xs font-semibold uppercase tracking-[0.3em] mb-6" style={{ fontFamily: 'var(--font-sans)' }}>80+ Verified Reviews</p>
            <div className="overflow-hidden">
              {['YOUR', 'EXCHANGE', 'HUB.'].map((line, i) => (
                <motion.div key={line} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.5 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}>
                  <h1 className={`font-heading leading-[0.88] tracking-tight ${i === 1 ? 'text-blue-600' : 'text-neutral-900'}`} style={{ fontSize: 'clamp(2.2rem, 7vw, 4.5rem)', fontWeight: i === 1 ? 900 : 300 }}>{line}</h1>
                </motion.div>
              ))}
            </div>
            <p className="text-neutral-500 text-sm sm:text-base leading-relaxed mt-8 max-w-md" style={{ fontFamily: 'var(--font-sans)' }}>
              Professional auto body repair on Craster Road. From minor dents to major collision damage, we restore vehicles to pre-accident condition using modern equipment and skilled technicians.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/contact" className="group inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 text-sm uppercase tracking-[0.15em] font-semibold hover:bg-blue-700 transition-all" style={{ fontFamily: 'var(--font-sans)' }}>{hero?.ctaPrimary || 'Book Test Drive'} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></Link>
              <a href="tel:+263772405466" className="group inline-flex items-center gap-3 border border-neutral-200 text-neutral-700 px-8 py-4 text-sm uppercase tracking-[0.15em] font-semibold hover:border-blue-600 hover:text-blue-600 transition-all" style={{ fontFamily: 'var(--font-sans)' }}><Phone size={16} weight="fill" /> Call Us</a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================ 2. PROCESS STRIP ================================================================ */
function ProcessStrip() {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: '-50px' });
  const steps = [{ icon: Eye, label: 'Assess', desc: 'Full damage inspection' }, { icon: Target, label: 'Quote', desc: 'Transparent pricing' }, { icon: Wrench, label: 'Repair', desc: 'Factory-standard work' }, { icon: Car, label: 'Deliver', desc: 'Quality-checked return' }];
  return (
    <section ref={ref} className="bg-blue-600 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div key={step.label} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/15 flex items-center justify-center shrink-0"><step.icon size={22} weight="fill" className="text-white" /></div>
              <div><h3 className="text-white font-heading text-base font-bold uppercase">{step.label}</h3><p className="text-white/60 text-xs" style={{ fontFamily: 'var(--font-sans)' }}>{step.desc}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================ 3. SERVICES ================================================================ */
function ServicesGrid() {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: '-80px' }); const { servicesPreview, services } = siteData;
  const imgs = ['https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80','https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80','https://images.unsplash.com/photo-1549317661-bd32c8ce0571?w=800&q=80','https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80','https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80','https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80'];
  return (
    <section ref={ref} className="bg-neutral-50 py-24 sm:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="mb-14 sm:mb-20 text-center">
          <div className="w-12 h-[2px] bg-blue-600 mx-auto mb-6" />
          <h2 className="font-heading text-neutral-900 leading-[0.92] font-bold uppercase" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>Our <span className="text-blue-600">Services</span></h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesPreview?.slice(0,6).map((service, i) => { const Icon = iconMap[service.icon] || Wrench; return (
            <motion.div key={service.title} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.08*i }}>
              <Link to={`/services#${services?.items?.[i]?.slug || ''}`} className="group block bg-white border border-neutral-100 hover:border-blue-600/30 transition-colors overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden"><img src={imgs[i]} alt={service.title} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" loading="lazy" /><div className="absolute top-4 left-4 w-10 h-10 bg-green-600 flex items-center justify-center"><Icon size={18} weight="fill" className="text-white" /></div></div>
                <div className="p-6"><h3 className="font-heading text-neutral-900 text-lg font-bold uppercase tracking-wide mb-2">{service.title}</h3><p className="text-neutral-500 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>{service.desc}</p><div className="flex items-center gap-2 mt-4 text-blue-600 group-hover:translate-x-1 transition-transform"><span className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>Details</span><ArrowRight size={14} /></div></div>
              </Link>
            </motion.div>
          ); })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================ 4. STATS ================================================================ */
function StatsBand() {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: '-50px' }); const { stats } = siteData;
  return (
    <section ref={ref} className="bg-white py-20 sm:py-24 border-y border-neutral-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12"><div className="grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16">
        {stats?.map((stat, i) => (<motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: i * 0.12 }} className="text-center"><div className="font-heading text-blue-600 leading-none font-bold" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}><AnimatedCounter target={String(stat.number).replace(/[^0-9]/g, '')} suffix={String(stat.number).replace(/[0-9]/g, '')} /></div><div className="text-neutral-400 text-xs sm:text-sm uppercase tracking-[0.25em] mt-3" style={{ fontFamily: 'var(--font-sans)' }}>{stat.label}</div></motion.div>))}
      </div></div>
    </section>
  );
}

/* ================================================================ 5. ABOUT ================================================================ */
function AboutSection() {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <section ref={ref} className="bg-white py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12"><div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9 }}>
          <div className="w-12 h-[2px] bg-blue-600 mb-6" />
          <h2 className="font-heading text-neutral-900 leading-[0.95] font-bold uppercase mb-8" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>About <span className="text-blue-600">VEC</span></h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-6 max-w-lg" style={{ fontFamily: 'var(--font-sans)' }}>Vehicle Exchange Centre on Craster Road delivers expert collision repair and spray painting. Our certified technicians use modern frame straighteners, computerised colour matching, and downdraft spray booths to achieve factory-grade results.</p>
          <div className="flex gap-10"><div><div className="text-blue-600 font-heading text-3xl font-bold">3.7</div><div className="text-neutral-400 text-[10px] uppercase tracking-[0.2em] mt-2" style={{ fontFamily: 'var(--font-sans)' }}>Rating</div></div><div><div className="text-blue-600 font-heading text-3xl font-bold">80</div><div className="text-neutral-400 text-[10px] uppercase tracking-[0.2em] mt-2" style={{ fontFamily: 'var(--font-sans)' }}>Reviews</div></div></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 0.2 }} className="relative">
          <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0571?w=800&q=80" alt="VEC workshop" className="w-full aspect-[4/5] object-cover object-center" loading="lazy" />
          <div className="absolute -top-3 -right-3 w-20 h-20 border-t-2 border-r-2 border-blue-600/30" />
        </motion.div>
      </div></div>
    </section>
  );
}

/* ================================================================ 6. INSURANCE PARTNERS ================================================================ */
function InsurancePartners() {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: '-50px' });
  const partners = ['Old Mutual', 'First Mutual', 'Nicoz Diamond', 'Zimnat', 'Credsure', 'Fidelity'];
  return (
    <section ref={ref} className="bg-neutral-50 py-16 border-y border-neutral-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <p className="text-neutral-400 text-xs uppercase tracking-[0.3em] text-center mb-10" style={{ fontFamily: 'var(--font-sans)' }}>Insurance Partners</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
          {partners.map((name, i) => (<motion.div key={name} initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.06 }} className="flex items-center justify-center h-16 bg-white border border-neutral-100"><span className="text-neutral-400 text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans)' }}>{name}</span></motion.div>))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================ 7. TESTIMONIALS ================================================================ */
function TestimonialsSection() {
  const [active, setActive] = useState(0); const { homeTestimonials } = siteData; const ref = useRef(null); const inView = useInView(ref, { once: true, margin: '-80px' }); const testimonials = homeTestimonials || [];
  const next = useCallback(() => setActive(p => (p+1) % testimonials.length), [testimonials.length]); const prev = useCallback(() => setActive(p => (p-1+testimonials.length) % testimonials.length), [testimonials.length]);
  useEffect(() => { const t = setInterval(next, 7000); return () => clearInterval(t); }, [next]);
  if (!testimonials.length) return null; const t = testimonials[active];
  return (
    <section ref={ref} className="bg-neutral-50 py-24 sm:py-32 lg:py-40">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
        <Quotes size={48} weight="fill" className="text-blue-600/10 mx-auto mb-8" />
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
            <blockquote className="text-neutral-800 text-lg sm:text-xl lg:text-2xl leading-relaxed font-heading mb-10">&ldquo;{t.text}&rdquo;</blockquote>
            <div className="flex flex-col items-center gap-3"><div className="w-8 h-[2px] bg-blue-600" /><div className="text-neutral-900 text-sm uppercase tracking-[0.15em] font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>{t.name}</div><div className="flex gap-0.5 mt-1">{[...Array(t.rating||5)].map((_,i)=><Star key={i} size={12} weight="fill" className="text-blue-600" />)}</div></div>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-center gap-6 mt-12">
          <button onClick={prev} className="w-10 h-10 border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-blue-600 transition-colors"><CaretLeft size={16} /></button>
          <div className="flex gap-2">{testimonials.map((_,i)=><button key={i} onClick={()=>setActive(i)} className={`h-[2px] transition-all duration-500 ${i===active?'w-10 bg-blue-600':'w-3 bg-neutral-200'}`} />)}</div>
          <button onClick={next} className="w-10 h-10 border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-blue-600 transition-colors"><CaretRight size={16} /></button>
        </div>
      </div>
    </section>
  );
}

/* ================================================================ 8. CTA ================================================================ */
function CTASection() {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80" alt="" className="absolute inset-0 w-full h-full object-cover object-center" loading="lazy" />
      <div className="absolute inset-0 bg-neutral-950/70" /><NoiseTexture opacity={0.03} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <h2 className="font-heading text-white leading-[0.92] font-bold uppercase mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Get Your Vehicle <span className="text-blue-500">Restored</span></h2>
        <p className="text-white/50 text-sm sm:text-base max-w-xl mx-auto mb-10" style={{ fontFamily: 'var(--font-sans)' }}>Visit us at A2, Harare for a free assessment.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact" className="group inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 text-sm uppercase tracking-[0.15em] font-semibold hover:bg-blue-700 transition-all" style={{ fontFamily: 'var(--font-sans)' }}>Book Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></Link>
          <a href="https://wa.me/263772405466" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center gap-3 border border-green-500/40 text-green-400 px-8 py-4 text-sm uppercase tracking-[0.15em] font-semibold hover:bg-green-500/10 transition-all" style={{ fontFamily: 'var(--font-sans)' }}><WhatsappLogo size={18} weight="fill" /> WhatsApp</a>
        </div>
      </motion.div>
    </section>
  );
}

export default function Home() {
  return (<PageTransition><HeroSection /><ProcessStrip /><ServicesGrid /><StatsBand /><AboutSection /><InsurancePartners /><TestimonialsSection /><CTASection /></PageTransition>);
}
