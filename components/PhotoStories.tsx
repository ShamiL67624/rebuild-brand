import Image from 'next/image';
import { ArrowUpRight, MoveRight } from 'lucide-react';

export function PhotoStories() {
  const stories = [
    { image: '/images/energy-plant.jpg', alt: 'Refinery towers reaching into the sky', label: 'ENERGISING INDUSTRY', title: 'The strength to\nmove a nation.', href: '#businesses', number: '01' },
    { image: '/images/research.jpg', alt: 'Precision equipment in an energy research laboratory', label: 'REIMAGINING WHAT’S NEXT', title: 'Big ideas. Real impact.', href: '#businesses', number: '02' },
    { image: '/images/wind-energy.jpg', alt: 'Wind turbines harvesting clean energy at sunset', label: 'EMBRACING NEW ENERGY', title: 'A brighter kind of future.', href: '#sustainability', number: '03' },
  ];
  return <section className="photo-stories section container" id="about" data-reveal>
    <div className="section-heading"><div><span className="eyebrow"><span className="orange-dot"/>MORE THAN ENERGY</span><h2>Part of your life.<br/><em>Part of India’s story.</em></h2></div><div className="section-heading-aside"><p>In everyday moments and extraordinary ambitions,<br/>we’re there. Moving forward, together.</p><a className="text-link" href="https://iocl.com/" target="_blank" rel="noreferrer">Meet IndianOil<ArrowUpRight size={17}/></a></div></div>
    <div className="story-mosaic">{stories.map((story, i) => <a className={`story-photo story-photo-${i}`} href={story.href} key={story.label} data-tilt>
      <Image src={story.image} alt={story.alt} fill sizes="(max-width: 580px) 100vw, 55vw"/>
      <div className="story-photo-shade"/><span className="story-number">{story.number} /</span><div className="story-photo-caption"><span className="eyebrow">{story.label}</span><h3>{story.title}</h3></div><span className="story-arrow"><ArrowUpRight size={23}/></span>
    </a>)}</div>
    <div className="story-bottom"><span>Connected by purpose. Driven by possibility.</span><span>That’s the energy of India. <MoveRight size={20}/></span></div>
  </section>;
}

export function PeopleStory() {
  return <section className="people-story container" data-reveal>
    <div className="people-image"><Image src="/images/recruitment-team.jpg" alt="People sharing ideas and working together" fill sizes="(max-width: 700px) 100vw, 55vw"/><span className="photo-pill">OUR PEOPLE. OUR GREATEST ENERGY.</span></div>
    <div className="people-story-copy"><span className="eyebrow"><span className="orange-dot"/>MAKE YOUR NEXT CHAPTER MATTER</span><h2>Bring your spark.<br/><em>Find your purpose.</em></h2><p>Big challenges need curious minds. Join a world of people who turn possibility into progress.</p><a className="button button-navy" href="#news">Explore opportunities<ArrowUpRight size={18}/></a><span className="people-signature">Together, we make a difference.</span></div>
  </section>;
}
