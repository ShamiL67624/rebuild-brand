import Image from 'next/image';
import { ArrowUpRight, ArrowRight, CarFront, House, Handshake, BriefcaseBusiness, ChartNoAxesCombined, Phone, MoveUp, Camera, Video, ShieldCheck, Heart, Leaf, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Logo from '@/components/Logo';
import PageMotion from '@/components/PageMotion';
import { PhotoStories, PeopleStory } from '@/components/PhotoStories';
import { Hero, BusinessExplorer, LatestUpdates, GlobalPresence, SustainabilityLinks } from '@/components/Interactive';

const services = [
  { name: 'On the road', image: '/images/motorists.jpg', description: 'For every journey ahead', icon: CarFront, href: 'https://iocl.com/' },
  { name: 'In your home', image: '/images/home.jpg', description: 'A little warmth, every day', icon: House, href: 'https://cx.indianoil.in/' },
  { name: 'For your business', image: '/images/refinery.jpg', description: 'Let’s grow, together', icon: Handshake, href: '#businesses' },
  { name: 'For your future', image: '/images/recruitment-team.jpg', description: 'Find where you belong', icon: BriefcaseBusiness, href: '#news' },
  { name: 'For our investors', image: '/images/city.jpg', description: 'Progress that creates value', icon: ChartNoAxesCombined, href: '#news' },
];

function Linkedin() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 9h4v12H3V9Zm6 0h4v2c1-2 6-3 7 1v9h-4v-8c0-2-3-2-3 0v8H9V9Z"/></svg>;
}

export default function Home() {
  return <>
    <Header/>
    <PageMotion/>
    <main id="main">
      <div id="home"><Hero/></div>
      <section id="services" className="services-section">
        <div className="container" data-reveal>
          <div className="services-intro"><span className="eyebrow"><span className="orange-dot"/>ALWAYS A PART OF YOUR WORLD</span><span>Find your connection <ArrowRight size={15}/></span></div>
          <div className="services-grid">{services.map(s => <a key={s.name} href={s.href} className="service-card" data-tilt>
            <div className="service-photo"><Image src={s.image} alt="" fill sizes="(max-width: 580px) 50vw, (max-width: 900px) 33vw, 20vw"/><span className="service-icon"><s.icon size={19} strokeWidth={1.5}/></span></div>
            <div className="service-caption"><h3>{s.name}<ArrowUpRight size={17}/></h3><p>{s.description}</p></div>
          </a>)}</div>
        </div>
      </section>
      <PhotoStories/>
      <section className="business-section section" id="businesses">
        <div className="business-orbit" aria-hidden="true"/>
        <div className="container" data-reveal>
          <div className="section-heading"><div><span className="eyebrow"><span className="orange-dot"/>A WORLD OF ENERGY</span><h2>One purpose.<br/><em>Endless possibilities.</em></h2></div><p>From the energy you use today<br/>to the ideas that will power tomorrow.</p></div>
          <BusinessExplorer/>
          <div className="business-footnote"><span>INTEGRATED. INNOVATIVE. INDIANOIL.</span><span>Explore the energy behind everyday life <ArrowUpRight size={16}/></span></div>
        </div>
      </section>
      <section className="sustainability-section section container" id="sustainability" data-reveal>
        <div className="sustainability-photo" data-tilt>
          <Image src="/images/solar.jpg" alt="Solar panels harvesting the sun’s energy" fill sizes="(max-width: 760px) 100vw, 50vw"/>
          <div className="photo-gradient"/>
          <span className="photo-pill"><Leaf size={14}/> THE NEXT CHAPTER OF ENERGY</span>
          <div className="solar-orbit" aria-hidden="true"><span/><span/><span/></div>
          <div className="photo-caption"><span>Good energy.<br/>For a better earth.</span><a href="https://iocl.com/" className="circle-link" aria-label="Discover IndianOil’s sustainability initiatives"><ArrowUpRight size={24}/></a></div>
        </div>
        <div className="sustainability-copy"><span className="eyebrow"><span className="orange-dot"/>PROGRESS WITH PURPOSE</span><h2>The future is<br/><em>ours to shape.</em></h2><p>A growing nation. A changing planet. We’re exploring new ways to bring the two forward, with cleaner energy and care at every step.</p><SustainabilityLinks/><a className="text-link" href="https://iocl.com/">Our commitment to tomorrow <ArrowUpRight size={17}/></a></div>
      </section>
      <div className="values-strip container" data-reveal><span><Heart size={19}/> People at the heart</span><span><Zap size={19}/> Innovation in our spirit</span><span><Leaf size={19}/> Responsibility in every step</span></div>
      <section className="news-section section" id="news"><div className="container" data-reveal><div className="section-heading"><div><span className="eyebrow"><span className="orange-dot"/>THE LATEST FROM OUR WORLD</span><h2>Moving forward.<br/><em>Making headlines.</em></h2></div><a href="https://iocl.com/" className="text-link" target="_blank" rel="noreferrer">All announcements<ArrowUpRight size={17}/></a></div><LatestUpdates/></div></section>
      <PeopleStory/>
      <GlobalPresence/>
      <section className="connect-section" id="contact"><div className="container connect-inner" data-reveal><div><span className="eyebrow">GREAT THINGS START WITH A CONVERSATION</span><h2>Your world.<br/>Our shared <em>tomorrow.</em></h2></div><div className="connect-action"><p>We’re here to help you take the next step.</p><a className="button button-white" href="tel:18002333555">Let’s connect <ArrowUpRight size={19}/></a></div><div className="connect-rings" aria-hidden="true"/></div></section>
    </main>
    <footer>
      <div className="container footer-main">
        <div className="footer-brand"><Logo/><p>Rooted in India.<br/>Energising a world of possibilities.</p><div className="social-links"><a href="https://www.linkedin.com/company/indian-oil-corp-limited/" aria-label="IndianOil on LinkedIn"><Linkedin/></a><a href="https://www.instagram.com/indianoilcorp/" aria-label="IndianOil on Instagram"><Camera size={17}/></a><a href="https://www.youtube.com/user/indianoilcorp" aria-label="IndianOil on YouTube"><Video size={18}/></a></div></div>
        <div className="footer-column"><h3>Discover</h3><a href="#about">Our story</a><a href="#businesses">Our businesses</a><a href="#sustainability">Sustainability</a><a href="#global">Global presence</a></div>
        <div className="footer-column"><h3>Here for you</h3><a href="#services">Customers</a><a href="#services">Business partners</a><a href="#news">Careers & opportunities</a><a href="#news">Investor information</a></div>
        <div className="footer-column footer-contact"><h3>A conversation away</h3><a href="tel:18002333555"><Phone size={17}/><span>Customer care<strong>1800-2333-555</strong></span></a><a href="tel:18605991111"><Phone size={17}/><span>Commercial LPG<strong>1860-5991-111</strong></span></a><a href="tel:1906" className="emergency"><ShieldCheck size={18}/><span>LPG Emergency <strong>1906</strong></span><ArrowUpRight size={17}/></a></div>
      </div>
      <div className="container footer-bottom"><span>IndianOil · Independent design concept · Illustrative content</span><div><a href="https://iocl.com/">Official website <ArrowUpRight size={12}/></a><a href="#home" className="back-top">Back to top <MoveUp size={14}/></a></div></div>
      <div className="footer-wordmark container" aria-hidden="true">The energy of India<span>®</span></div>
    </footer>
  </>;
}
