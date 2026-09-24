'use client';

import { useEffect } from 'react';

export default function PageMotion() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    if (!preference.matches) elements.forEach(element => {
      if (element.getBoundingClientRect().top > innerHeight) element.classList.add('will-reveal');
      observer.observe(element);
    });
    const cards = document.querySelectorAll<HTMLElement>('[data-tilt]');
    const move = (event: PointerEvent) => {
      if (preference.matches || event.pointerType !== 'mouse') return;
      const card = event.currentTarget as HTMLElement;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--tilt-x', `${((event.clientY - bounds.top) / bounds.height - .5) * -5}deg`);
      card.style.setProperty('--tilt-y', `${((event.clientX - bounds.left) / bounds.width - .5) * 5}deg`);
    };
    const reset = (event: PointerEvent) => {
      const card = event.currentTarget as HTMLElement;
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    };
    cards.forEach(card => { card.addEventListener('pointermove', move); card.addEventListener('pointerleave', reset); });
    return () => {
      observer.disconnect();
      cards.forEach(card => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', reset); });
    };
  }, []);
  return null;
}
