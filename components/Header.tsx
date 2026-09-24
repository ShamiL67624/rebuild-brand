'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Search, Menu, X, Mic, Phone, Globe2, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import { businesses, updates } from '@/lib/content';

type Recognition = { lang: string; start: () => void; abort: () => void; onresult: ((event: { results: { transcript: string }[][] }) => void) | null; onerror: (() => void) | null; onend: (() => void) | null };

export default function Header() {
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [voice, setVoice] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const recognition = useRef<Recognition | null>(null);
  useEffect(() => () => recognition.current?.abort(), []);
  useEffect(() => {
    if (!menu) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', dismiss);
    return () => window.removeEventListener('keydown', dismiss);
  }, [menu]);
  const searchItems = [...businesses.map(b => ({ title: b.name, href: '#businesses', description: b.description })), ...updates.map(u => ({ title: u.title, href: u.href, description: u.description })), { title: 'Households & LPG', href: 'https://cx.indianoil.in/', description: 'LPG services and customer portal' }, { title: 'Environment & sustainability', href: '#sustainability', description: 'Our green agenda and energy transition' }];
  const results = searchItems.filter(item => `${item.title} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  function startVoice() {
    const api = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    const Constructor = api.SpeechRecognition || api.webkitSpeechRecognition;
    if (!Constructor) { setVoice('Voice search is not supported in this browser. Please type your search.'); return; }
    recognition.current?.abort();
    const speech = new Constructor();
    recognition.current = speech;
    speech.lang = 'en-IN';
    speech.onresult = (event) => { setQuery(event.results[0][0].transcript); setVoice(''); };
    speech.onerror = () => setVoice('Microphone unavailable. Please type your search.');
    speech.onend = () => setVoice(previous => previous === 'Listening…' ? '' : previous);
    setVoice('Listening…');
    try { speech.start(); } catch { setVoice('Voice search unavailable. Please type your search.'); }
  }
  function stopVoice() { recognition.current?.abort(); recognition.current = null; setVoice(''); }
  function closeSearch() { stopVoice(); if (dialog.current?.open) dialog.current.close(); }
  function openSearch() { setMenu(false); dialog.current?.showModal(); input.current?.focus(); }
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="utility-bar">
      <span className="utility-message"><span className="utility-dot"/> A nation on the move. An energy that connects.</span>
      <div className="utility-links">
        <a href="tel:1906"><Phone size={11} aria-hidden="true"/> LPG emergency <strong>1906</strong></a>
        <span className="utility-divider" aria-hidden="true"/>
        <a href="https://iocl.com/" aria-label="Visit IndianOil for language options"><Globe2 size={12} aria-hidden="true"/> English <ChevronDown size={11} aria-hidden="true"/></a>
      </div>
    </div>
    <header className="header">
      <div className="header-inner">
        <Logo/>
        <nav id="main-navigation" aria-label="Main navigation" className={menu ? 'navigation open' : 'navigation'}>
          {[['Who we are', '#about'], ['Our businesses', '#businesses'], ['For you', '#services'], ['Sustainability', '#sustainability']].map(([name, href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{name}<ChevronDown size={12} aria-hidden="true"/></a>)}
          <a className="mobile-contact" href="#contact" onClick={() => setMenu(false)}>Get in touch <ArrowUpRight size={15} aria-hidden="true"/></a>
        </nav>
        <div className="header-actions">
          <button className="icon-button search-toggle" aria-label="Search website" onClick={openSearch}><Search size={19} aria-hidden="true"/></button>
          <a className="contact-link" href="#contact" onClick={() => setMenu(false)}>Get in touch <ArrowUpRight size={16} aria-hidden="true"/></a>
          <button ref={menuButton} className="icon-button menu-toggle" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="main-navigation" onClick={() => setMenu(previous => !previous)}>{menu ? <X aria-hidden="true"/> : <Menu aria-hidden="true"/>}</button>
        </div>
      </div>
    </header>
    <dialog className="search-dialog" ref={dialog} aria-labelledby="search-title" onCancel={closeSearch} onClose={stopVoice} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); closeSearch(); } }} onClick={event => { if (event.target === dialog.current) closeSearch(); }}>
      <div className="search-heading"><span className="eyebrow">EXPLORE INDIANOIL</span><button className="icon-button" aria-label="Close search" onClick={closeSearch}><X aria-hidden="true"/></button></div>
      <h2 id="search-title">What are you looking for?</h2>
      <div className="search-input">
        <Search size={20} aria-hidden="true"/>
        <input ref={input} aria-label="Search content" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try careers, LPG, or refining…" type="search"/>
        <button className="icon-button" aria-label="Start voice search" onClick={startVoice}><Mic size={20} aria-hidden="true"/></button>
      </div>
      <p role="status" className="voice-status">{voice}</p>
      <div className="search-results">{results.length ? results.map((result, index) => <a key={`${result.title}-${index}`} href={result.href} onClick={closeSearch}><span>{result.title}<small>{result.description}</small></span><ArrowUpRight size={18} aria-hidden="true"/></a>) : <p>No results found. Try “careers”, “LPG”, or “energy”.</p>}</div>
    </dialog>
  </>;
}
