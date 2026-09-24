'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowUpRight, ArrowDown, ChevronLeft, ChevronRight, Leaf, MoveUpRight, Zap, Globe2 } from 'lucide-react';
import { businesses, updates, subsidiaries } from '@/lib/content';

const Scene = dynamic(() => import('./Scene'), { ssr: false, loading: () => <div className="scene-fallback"/> });
const EnergyEmblem = dynamic(() => import('./EnergyEmblem'), { ssr: false, loading: () => <div className="emblem-loading"/> });

const slides = [
  { label: 'THE ENERGY OF INDIA', first: 'Energy for a billion', second: 'possibilities.', copy: 'From the smallest everyday moments to a nation’s biggest ambitions. We’re moving India forward, together.', image: '/images/energy-plant.jpg', imageLabel: 'POWERING PROGRESS', link: 'Discover our world', href: '#about' },
  { label: 'A BETTER TOMORROW STARTS TODAY', first: 'A new kind of', second: 'good energy.', copy: 'New thinking. Cleaner possibilities. Discover how we’re helping shape a more responsible energy future.', image: '/images/solar.jpg', imageLabel: 'SHAPING TOMORROW', link: 'Explore our green agenda', href: '#sustainability' },
  { label: 'PEOPLE. PURPOSE. POSSIBILITIES.', first: 'Great futures start', second: 'with you.', copy: 'Bring your ideas, your ambition, and your spark. Let’s build the next chapter of India’s energy story.', image: '/images/recruitment-team.jpg', imageLabel: 'BETTER TOGETHER', link: 'Find your opportunity', href: '#news' },
];

export function Hero() {
  const [slide, setSlide] = useState(0);
  const item = slides[slide];
  return <section className="hero" aria-roledescription="carousel" aria-label="Featured stories">
    <div className="hero-grid" aria-hidden="true"/>
    <div className="container hero-layout">
      <div className="hero-content" aria-live="polite"><div className="eyebrow hero-eyebrow"><span className="orange-dot"/>{item.label}<span className="eyebrow-rule"/></div><div key={slide} className="hero-copy-enter"><h1>{item.first}<br/><em>{item.second}</em></h1><p>{item.copy}</p><div className="hero-actions"><a className="button button-orange" href={item.href}>{item.link}<ArrowUpRight size={19}/></a><a href="#businesses" className="hero-secondary">Explore our businesses <ArrowUpRight size={16}/></a></div></div><div className="hero-promise"><span className="promise-symbol"><Zap size={18} strokeWidth={1.6}/></span><span>Every home. Every journey.<br/><strong>Every tomorrow.</strong></span></div></div>
      <div className="hero-visual"><span className="hero-visual-coordinate">INDIA AT HEART. THE WORLD AHEAD.</span><div className="hero-emblem"><EnergyEmblem/></div><a className="hero-photo hero-photo-primary" href={item.href}><div className="hero-photo-inner"><Image className="hero-image" key={item.image} src={item.image} alt={slide === 0 ? 'Industrial refinery towers' : slide === 1 ? 'Solar panels in the sunshine' : 'A team working together'} fill sizes="240px" preload/></div><span><span className="small-status"/>{item.imageLabel}<ArrowUpRight size={14}/></span></a><a className="hero-photo hero-photo-secondary" href="#sustainability"><div className="hero-photo-inner"><Image src="/images/wind-energy.jpg" alt="Wind turbines at sunset" fill sizes="180px"/></div><span><Leaf size={12}/> A GREENER HORIZON</span></a><span className="hero-orbit-label"><Globe2 size={13}/> ONE WORLD. SHARED POSSIBILITIES.</span></div>
    </div>
    <div className="hero-bottom container"><div className="slide-controls"><span className="slide-current">0{slide + 1}</span><div className="slide-track">{slides.map((s, i) => <button key={s.label} className={slide === i ? 'active' : ''} onClick={() => setSlide(i)} aria-label={`Show story ${i + 1}`} aria-pressed={slide === i}/>)}</div><span className="slide-total">03</span><button className="icon-button" onClick={() => setSlide((slide + 2) % 3)} aria-label="Previous story"><ChevronLeft size={17}/></button><button className="icon-button" onClick={() => setSlide((slide + 1) % 3)} aria-label="Next story"><ChevronRight size={17}/></button></div><a className="scroll-cue" href="#services"><span>SCROLL TO EXPLORE</span><ArrowDown size={15}/></a><span className="hero-bottom-note">Indian roots. Limitless horizons.</span></div>
  </section>;
}

export function BusinessExplorer() {
  const [selected, setSelected] = useState(0);
  const b = businesses[selected];
  return <div className="business-explorer"><div className="business-nav"><div className="business-tabs" role="tablist" aria-label="Our businesses" aria-orientation="vertical">{businesses.map((item, i) => <button key={item.name} id={`business-tab-${i}`} role="tab" aria-selected={selected === i} aria-controls="business-panel" className={selected === i ? 'selected' : ''} tabIndex={selected === i ? 0 : -1} onKeyDown={e => { if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) { e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? businesses.length - 1 : (selected + (['ArrowDown', 'ArrowRight'].includes(e.key) ? 1 : businesses.length - 1)) % businesses.length; setSelected(next); document.getElementById(`business-tab-${next}`)?.focus(); } }} onClick={() => setSelected(i)}><span className="tab-number">0{i + 1}</span><span>{item.name}</span><ArrowUpRight size={17}/></button>)}</div></div><div id="business-panel" className="business-panel" role="tabpanel" aria-labelledby={`business-tab-${selected}`} tabIndex={0}><Image key={b.image} src={b.image} alt={`${b.name} — illustrative energy industry photograph`} fill sizes="(max-width: 760px) 100vw, 65vw"/><div className="business-panel-shade"/><span className="business-panel-label">OUR EXPERTISE / 0{selected + 1}</span><div key={selected} className="business-panel-content"><span className="eyebrow">{b.label}</span><h3>{b.title}</h3><p>{b.description}</p><a className="text-link" href={b.href} target="_blank" rel="noreferrer">Explore {b.name}<ArrowUpRight size={17}/></a></div><span className="business-watermark" aria-hidden="true">0{selected + 1}</span></div></div>;
}

export function LatestUpdates() {
  const [filter, setFilter] = useState('All updates');
  const filtered = filter === 'All updates' ? updates : updates.filter(u => u.category === filter);
  return <><div className="news-tabs" role="group" aria-label="Filter updates">{['All updates', 'Recruitment', 'Investors', 'Public Notices'].map(f => <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f} className={filter === f ? 'active' : ''}>{f}<span>{f === 'All updates' ? updates.length : updates.filter(u => u.category === f).length}</span></button>)}</div><div className="news-grid" aria-live="polite">{filtered.map((u, i) => <article className="news-card" key={u.title}><div className={`news-card-art art-${u.icon}`}>{u.category === 'Recruitment' ? <Image className="recruitment-photo" src="/images/recruitment-team.jpg" alt="People collaborating around a workspace" fill sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, 25vw"/> : <Image className="notice-reference-image" src={u.category === 'Investors' ? '/images/investors.webp' : '/images/scam-alert.webp'} alt={u.category === 'Investors' ? 'IndianOil shareholder information notice' : 'IndianOil public advisory about fraudulent offers'} fill sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, 25vw"/>}<span className="news-category">{u.category}</span></div><div className="news-card-content"><span className="eyebrow">{u.tag}</span><h3>{u.title}</h3><p>{u.description}</p><a className="text-link" href={u.href} target="_blank" rel="noreferrer">{u.link}<ArrowUpRight size={16}/></a></div><span className="news-index" aria-hidden="true">0{i + 1}</span></article>)}</div><p className="news-disclaimer">A selection of announcements from the original brief. Visit IndianOil for current information.</p></>;
}

export function GlobalPresence() {
  const [selected, setSelected] = useState(0);
  return <section className="global-section section" id="global"><div className="container" data-reveal><div className="global-layout"><div className="global-copy"><span className="eyebrow"><span className="orange-dot"/>ROOTED HERE. REACHING FURTHER.</span><h2>Indian at heart.<br/><em>Global in spirit.</em></h2><p>Our story begins in India. Our connections reach across oceans. Wherever we go, we bring the same energy, expertise, and belief in a better tomorrow.</p><a href="https://iocl.com/" className="text-link" target="_blank" rel="noreferrer">Explore our global presence<ArrowUpRight size={17}/></a><span className="global-coordinate"><span className="orange-dot"/> NEW DELHI, INDIA · CONNECTED TO THE WORLD</span></div><div className="globe-wrap"><div className="globe-grid" aria-hidden="true"/><Scene kind="globe" selected={selected} onSelect={setSelected}/><span className="globe-caption"><Globe2 size={14}/> ENERGY WITHOUT BORDERS</span></div></div><div className="global-locations">{subsidiaries.map((s, i) => <button key={s.name} className={i === selected ? 'location selected' : 'location'} onClick={() => setSelected(i)} aria-pressed={i === selected}><span className="location-dot"/><span><small>{s.location}</small><strong>{s.name}</strong></span><MoveUpRight size={19}/></button>)}</div><p className="location-description" aria-live="polite">{subsidiaries[selected].description}</p></div></section>;
}

export function SustainabilityLinks() {
  return <div className="sustainability-gallery">{[
    { title: 'A greener tomorrow', image: '/images/forest.jpg', alt: 'Sunlight in a lush green forest' },
    { title: 'Care at our core', image: '/images/research.jpg', alt: 'Laboratory research equipment' },
    { title: 'New energy', image: '/images/wind-energy.jpg', alt: 'Wind turbines at sunset' },
  ].map(item => <a href="https://iocl.com/" target="_blank" rel="noreferrer" key={item.title}><Image src={item.image} alt={item.alt} fill sizes="(max-width: 760px) 33vw, 17vw"/><span>{item.title}<ArrowUpRight size={15}/></span></a>)}</div>;
}
