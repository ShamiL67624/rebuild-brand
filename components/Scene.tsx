'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Component, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { subsidiaries } from '@/lib/content';
import AccentAnimations, { type AccentKind } from './AccentAnimations';

class SceneBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback ?? <div className="scene-fallback"/> : this.props.children; }
}

function Energy({ moving }: { moving: boolean }) {
  const group = useRef<THREE.Group>(null);
  const geometries = useMemo(() => Array.from({ length: 9 }, (_, n) => {
    const points = Array.from({ length: 100 }, (_, i) => {
      const t = i / 99;
      return new THREE.Vector3((t - .5) * 15, Math.sin(t * 5.5 + n * .045) * 1.1 + n * .08 - 1, Math.cos(t * 5 + n * .15) * .8);
    });
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 110, n % 3 === 0 ? .012 : .004, 4, false);
  }), []);
  const particles = useMemo(() => {
    const a = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) { const t = i / 150; a[i * 3] = (t - .5) * 15; a[i * 3 + 1] = Math.sin(i * 12.9898) * 2; a[i * 3 + 2] = Math.cos(i * 4.123) * 2; }
    return a;
  }, []);
  useEffect(() => () => geometries.forEach(g => g.dispose()), [geometries]);
  useFrame(({ clock, pointer }, delta) => {
    if (!group.current || !moving) return;
    group.current.position.y = Math.sin(clock.elapsedTime * .2) * .15;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.x * .09, 2, delta);
    group.current.rotation.z = Math.sin(clock.elapsedTime * .12) * .025;
  });
  return <group ref={group} rotation={[0, 0, -.12]}>{geometries.map((g, i) => <mesh key={i} geometry={g}><meshBasicMaterial color={i % 3 ? '#bd9452' : '#edcc88'} transparent opacity={i % 3 ? .16 : .5}/></mesh>)}<points><bufferGeometry><bufferAttribute attach="attributes-position" args={[particles, 3]}/></bufferGeometry><pointsMaterial color="#e2bd73" size={.025} transparent opacity={.6} sizeAttenuation/></points></group>;
}

function position(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
}

// Approximate coastlines are shared by the live scene and its static fallback.
const continentRings = [
      [
        [37, -17],
        [36, 4],
        [32, 25],
        [31, 33],
        [12, 44],
        [11, 51],
        [-12, 44],
        [-26, 33],
        [-35, 18],
        [-20, 12],
        [-4, 9],
        [5, -5],
        [15, -17],
      ],
      [
        [36, -10],
        [44, -9],
        [49, -5],
        [51, 4],
        [58, 8],
        [71, 26],
        [69, 45],
        [73, 85],
        [70, 140],
        [60, 166],
        [52, 141],
        [41, 130],
        [34, 122],
        [23, 113],
        [10, 106],
        [1, 104],
        [7, 98],
        [22, 90],
        [9, 78],
        [7, 76],
        [23, 68],
        [25, 57],
        [13, 44],
        [30, 33],
        [37, 27],
        [41, 29],
        [46, 16],
        [37, 15],
        [43, 5],
      ],
      [
        [-11, 131],
        [-14, 143],
        [-26, 153],
        [-38, 145],
        [-35, 116],
        [-23, 113],
        [-15, 124],
      ],
      [
        [70, -165],
        [70, -130],
        [60, -110],
        [50, -60],
        [26, -80],
        [18, -88],
        [20, -105],
        [33, -118],
        [55, -132],
        [62, -165],
      ],
      [
        [11, -72],
        [7, -50],
        [-5, -35],
        [-23, -43],
        [-54, -68],
        [-40, -73],
        [-17, -75],
        [0, -80],
      ],
];

function insideRing(lat: number, lon: number, ring: number[][]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [yi, xi] = ring[i];
    const [yj, xj] = ring[j];
    if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function globeDetails() {
  const coastlines = continentRings.map(ring => ring.flatMap(([lat, lon], i) => {
    const start = position(lat, lon, 1);
    const [nextLat, nextLon] = ring[(i + 1) % ring.length];
    const end = position(nextLat, nextLon, 1);
    return Array.from({ length: 12 }, (_, step) => start.clone().lerp(end, step / 12).normalize().multiplyScalar(1.81));
  }));
  const grid: THREE.Vector3[][] = [];
  for (let lat = -60; lat <= 60; lat += 30) {
    grid.push(Array.from({ length: 181 }, (_, i) => position(lat, i * 2 - 180, 1.795)));
  }
  for (let lon = -180; lon < 180; lon += 30) {
    grid.push(Array.from({ length: 91 }, (_, i) => position(i * 2 - 90, lon, 1.795)));
  }
  const dots: THREE.Vector3[] = [];
  for (let lat = -56; lat <= 72; lat += 3.2) {
    for (let lon = -178; lon <= 180; lon += 3.2 / Math.max(.35, Math.cos(lat * Math.PI / 180))) {
      if (continentRings.some(ring => insideRing(lat, lon, ring))) dots.push(position(lat, lon, 1.812));
    }
  }
  const routes = subsidiaries.map(s => {
    const start = position(28.61, 77.2, 1.835);
    const end = position(s.lat, s.lon, 1.835);
    const mid = start.clone().add(end).normalize().multiplyScalar(2.45);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  });
  return { coastlines, grid, dots, routes };
}

const globeRotation = new THREE.Euler(.15, -2.85, -.12);

function GlobeFallback({ selected }: { selected: number }) {
  const gradientId = useId().replace(/:/g, '');
  const details = useMemo(globeDetails, []);
  const project = (point: THREE.Vector3) => point.clone().applyEuler(globeRotation);
  const path = (points: THREE.Vector3[]) => {
    let visible = false;
    return points.map(point => {
      const p = project(point);
      if (p.z < .04) { visible = false; return ''; }
      const command = visible ? 'L' : 'M';
      visible = true;
      return `${command}${p.x.toFixed(3)},${(-p.y).toFixed(3)}`;
    }).join(' ');
  };
  return <svg viewBox="-2.15 -2.15 4.3 4.3" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
    <defs><radialGradient id={gradientId} cx="32%" cy="24%" r="78%"><stop stopColor="#38546c"/><stop offset=".65" stopColor="#162d47"/><stop offset="1" stopColor="#0d1c30"/></radialGradient></defs>
    <circle r="1.78" fill={`url(#${gradientId})`} stroke="#526b80" strokeWidth=".009"/>
    {details.grid.map((points, i) => <path key={`grid-${i}`} d={path(points)} fill="none" stroke="#a9c2d3" strokeOpacity=".21" strokeWidth=".006"/>)}
    {details.coastlines.map((points, i) => <path key={`coast-${i}`} d={path([...points, points[0]])} fill="none" stroke="#c6d7e2" strokeOpacity=".6" strokeWidth=".009"/>)}
    {details.dots.map((point, i) => { const p = project(point); return p.z > .04 ? <circle key={`dot-${i}`} cx={p.x} cy={-p.y} r=".009" fill="#a9c1d0" fillOpacity=".6"/> : null; })}
    {details.routes.map((curve, i) => <path key={`route-${i}`} d={path(curve.getPoints(48))} fill="none" stroke={i === selected ? '#ffc389' : '#ed813b'} strokeWidth={i === selected ? '.022' : '.014'} strokeOpacity={i === selected ? 1 : .75}/>)}
    {[{ lat: 28.61, lon: 77.2 }, ...subsidiaries].map((s, i) => { const p = project(position(s.lat, s.lon, 1.84)); return <g key={`location-${i}`}><circle cx={p.x} cy={-p.y} r={i === selected + 1 ? '.095' : '.075'} fill="none" stroke="#fca25e" strokeWidth=".013" opacity=".7"/><circle cx={p.x} cy={-p.y} r=".032" fill="#ffd1a6"/></g>; })}
  </svg>;
}

function Globe({ moving, selected, onSelect }: { moving: boolean; selected: number; onSelect?: (i: number) => void }) {
  const group = useRef<THREE.Group>(null);
  const lights = useRef<THREE.Group>(null);
  const hovered = useRef(false);
  const time = useRef(0);
  const details = useMemo(globeDetails, []);
  const coastlines = useMemo(() => details.coastlines.map(points => new THREE.BufferGeometry().setFromPoints(points)), [details]);
  const grid = useMemo(() => details.grid.map(points => new THREE.BufferGeometry().setFromPoints(points)), [details]);
  const dots = useMemo(() => new THREE.BufferGeometry().setFromPoints(details.dots), [details]);
  const routes = useMemo(() => details.routes.map(curve => new THREE.TubeGeometry(curve, 48, .01, 6, false)), [details]);
  useEffect(() => () => { [...routes, ...coastlines, ...grid, dots].forEach(g => g.dispose()); }, [routes, coastlines, grid, dots]);
  useFrame((_, delta) => {
    if (!moving) return;
    time.current += Math.min(delta, .05);
    if (group.current && !hovered.current) group.current.rotation.y = -2.85 + Math.sin(time.current * .15) * .13;
    lights.current?.children.forEach((light, i) => light.position.copy(details.routes[i].getPoint((time.current * .16 + i / 3) % 1)));
  });
  return <group ref={group} rotation={[.15, -2.85, -.12]} onPointerOver={() => { hovered.current = true; }} onPointerOut={() => { hovered.current = false; }}>
    <mesh><sphereGeometry args={[1.77, 64, 40]}/><meshStandardMaterial color="#142c46" roughness={.88}/></mesh>
    {grid.map((geometry, i) => <lineLoop key={`grid-${i}`} geometry={geometry}><lineBasicMaterial color="#a3bdd0" transparent opacity={.22} depthWrite={false}/></lineLoop>)}
    {coastlines.map((geometry, i) => <lineLoop key={`coast-${i}`} geometry={geometry}><lineBasicMaterial color="#cbdde8" transparent opacity={.68} depthWrite={false}/></lineLoop>)}
    <points geometry={dots}><pointsMaterial color="#adcadb" size={.018} transparent opacity={.72} depthWrite={false} sizeAttenuation/></points>
    <mesh position={position(28.61, 77.2, 1.855)}><sphereGeometry args={[.053, 16, 16]}/><meshBasicMaterial color="#ffce9d"/></mesh>
    {subsidiaries.map((s, i) => <group key={s.name}>
      <mesh position={position(s.lat, s.lon, 1.855)} onClick={(e) => { e.stopPropagation(); onSelect?.(i); }}>
        <sphereGeometry args={[selected === i ? .075 : .048, 16, 16]}/><meshBasicMaterial color={selected === i ? '#ffd5b1' : '#fa9149'}/>
      </mesh>
      <mesh position={position(s.lat, s.lon, 1.855)} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), position(s.lat, s.lon, 1))}>
        <ringGeometry args={[selected === i ? .1 : .077, selected === i ? .116 : .086, 32]}/><meshBasicMaterial color="#fc9f59" transparent opacity={selected === i ? .95 : .55} side={THREE.DoubleSide} depthWrite={false}/>
      </mesh>
      <mesh geometry={routes[i]}><meshBasicMaterial color={selected === i ? '#ffb977' : '#ed813b'} transparent opacity={selected === i ? 1 : .72} depthWrite={false}/></mesh>
      <mesh position={position(s.lat, s.lon, 1.87)} onClick={(e) => { e.stopPropagation(); onSelect?.(i); }}><sphereGeometry args={[.14, 12, 12]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/></mesh>
    </group>)}
    <group ref={lights}>{details.routes.map((curve, i) => <mesh key={i} position={curve.getPoint(i / 3)}><sphereGeometry args={[.027, 10, 10]}/><meshBasicMaterial color="#fff2db"/></mesh>)}</group>
  </group>;
}

export default function Scene({ kind = 'energy', selected = 0, onSelect }: { kind?: 'energy' | 'globe' | AccentKind; selected?: number; onSelect?: (i: number) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [supported, setSupported] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  useEffect(() => {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    setSupported(!!gl);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setReduced(media.matches);
    motion(); media.addEventListener('change', motion);
    const observer = new IntersectionObserver(([entry]) => { setVisible(entry.isIntersecting); if (entry.isIntersecting) setEntered(true); }, { rootMargin: '80px' });
    if (host.current) observer.observe(host.current);
    const visibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); media.removeEventListener('change', motion); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  const moving = visible && !reduced && tabVisible;
  const fallback = kind === 'globe' ? <GlobeFallback selected={selected}/> : <div className="scene-fallback"/>;
  return <div ref={host} className={`three-scene ${kind}`} aria-hidden="true"><SceneBoundary fallback={fallback}>{supported && entered ? <Canvas camera={{ position: [0, 0, kind === 'globe' ? 5.4 : 6], fov: 45 }} dpr={[1, 1.5]} frameloop={moving ? 'always' : 'demand'} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} fallback={fallback}><ambientLight intensity={kind === 'globe' ? 1.25 : 1.8}/><directionalLight position={[3, 4, 5]} intensity={kind === 'globe' ? 2 : 3} color={kind === 'globe' ? '#d6e7f1' : '#e3be80'}/>{kind === 'globe' ? <Globe moving={moving} selected={selected} onSelect={onSelect}/> : kind === 'energy' ? <Energy moving={moving}/> : <AccentAnimations kind={kind} moving={moving}/>}</Canvas> : fallback}</SceneBoundary></div>;
}
