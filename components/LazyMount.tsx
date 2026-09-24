'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export default function LazyMount({ children, fallback = null, rootMargin = '400px', className = '' }: { children: ReactNode; fallback?: ReactNode; rootMargin?: string; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') { setReady(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); observer.disconnect(); }
    }, { rootMargin });
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, [rootMargin]);
  return <div ref={host} className={`lazy-mount ${className}`} style={{ height: '100%' }}>{ready ? children : fallback}</div>;
}