'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import styles from './EnergyEmblem.module.css';

class EmblemBoundary extends Component<{
  children: ReactNode;
  onFailure: () => void;
}, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

/** A tapered, gently twisting tube gives the loop the feel of poured liquid. */
function makeEnergyLoop() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(.24, 1.65, -.1),
    new THREE.Vector3(.85, .67, .23),
    new THREE.Vector3(.98, -.33, .18),
    new THREE.Vector3(.49, -1.13, -.1),
    new THREE.Vector3(-.48, -1.17, -.18),
    new THREE.Vector3(-1.03, -.49, .1),
    new THREE.Vector3(-.84, .35, .35),
    new THREE.Vector3(-.26, .98, .17),
  ], true, 'catmullrom', .42);
  const segments = 160;
  const sides = 20;
  const frames = curve.computeFrenetFrames(segments, true);
  const vertices: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = curve.getPointAt(t);
    const thickness = .19 + .115 * (1 - Math.cos(t * Math.PI * 2)) / 2;
    const twist = t * Math.PI * 2;
    for (let j = 0; j <= sides; j++) {
      const a = j / sides * Math.PI * 2;
      const x = Math.cos(a) * thickness;
      const y = Math.sin(a) * thickness * .72;
      const n = x * Math.cos(twist) - y * Math.sin(twist);
      const b = x * Math.sin(twist) + y * Math.cos(twist);
      vertices.push(
        point.x + frames.normals[i].x * n + frames.binormals[i].x * b,
        point.y + frames.normals[i].y * n + frames.binormals[i].y * b,
        point.z + frames.normals[i].z * n + frames.binormals[i].z * b,
      );
      if (i < segments && j < sides) {
        const first = i * (sides + 1) + j;
        const second = first + sides + 1;
        indices.push(first, first + 1, second, second, first + 1, second + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function StudioLighting({ onFailure }: { onFailure: () => void }) {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const environment = generator.fromScene(room, .04);
    scene.environment = environment.texture;
    invalidate();
    const contextLost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    gl.domElement.addEventListener('webglcontextlost', contextLost);
    return () => {
      gl.domElement.removeEventListener('webglcontextlost', contextLost);
      scene.environment = null;
      environment.dispose();
      room.dispose();
      generator.dispose();
    };
  }, [gl, scene, invalidate, onFailure]);
  return null;
}

function Sculpture({ moving }: { moving: boolean }) {
  const sculpture = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);
  const time = useRef(0);
  const geometry = useMemo(makeEnergyLoop, []);
  const particles = useMemo(() => {
    const positions = new Float32Array(27 * 3);
    for (let i = 0; i < 27; i++) {
      const a = i * 2.39996;
      const radius = 1.65 + (i % 5) * .12;
      positions[i * 3] = Math.cos(a) * radius;
      positions[i * 3 + 1] = Math.sin(a) * radius * .75 + .18;
      positions[i * 3 + 2] = Math.sin(i * 7.23) * .75;
    }
    return positions;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame(({ pointer }, delta) => {
    if (!moving) return;
    time.current += Math.min(delta, .05);
    if (sculpture.current) {
      sculpture.current.rotation.y = THREE.MathUtils.damp(sculpture.current.rotation.y, -.32 + pointer.x * .18 + Math.sin(time.current * .3) * .2, 2.2, delta);
      sculpture.current.rotation.x = THREE.MathUtils.damp(sculpture.current.rotation.x, .12 - pointer.y * .1, 2.2, delta);
      sculpture.current.position.y = .13 + Math.sin(time.current * .7) * .075;
    }
    if (orbit.current) orbit.current.rotation.y = Math.sin(time.current * .22) * .15;
  });

  return <>
    <ambientLight intensity={.7} />
    <directionalLight position={[-3, 5, 5]} intensity={3.5} color="#fff6dd" />
    <directionalLight position={[4, .2, 2]} intensity={2} color="#ffb880" />
    <pointLight position={[-2, -1, 3]} intensity={9} color="#ffffff" />
    <group ref={sculpture} position={[0, .13, 0]} rotation={[.12, -.32, -.19]}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial color="#f16b16" metalness={.38} roughness={.2} clearcoat={1} clearcoatRoughness={.12} envMapIntensity={1.7} />
      </mesh>
      <mesh geometry={geometry} scale={[.71, .82, .8]} rotation={[.06, -.47, .16]} position={[.06, -.03, .12]}>
        <meshPhysicalMaterial color="#ffba67" metalness={.55} roughness={.18} clearcoat={1} envMapIntensity={1.6} />
      </mesh>
      <mesh position={[0, -.11, .12]}>
        <sphereGeometry args={[.35, 40, 32]} />
        <meshPhysicalMaterial color="#f5781d" metalness={.18} roughness={.13} clearcoat={1} envMapIntensity={2} />
      </mesh>
    </group>
    <group ref={orbit}>
      <group rotation={[1.13, -.12, -.34]} position={[0, .03, 0]}>
        <mesh scale={[1.1, 1, 1]}>
          <torusGeometry args={[1.91, .008, 6, 120]} />
          <meshBasicMaterial color="#264267" transparent opacity={.36} />
        </mesh>
        <mesh position={[1.78, .69, 0]}>
          <sphereGeometry args={[.065, 16, 16]} />
          <meshStandardMaterial color="#142542" roughness={.25} metalness={.5} />
        </mesh>
        <mesh position={[-1.79, -.67, 0]}>
          <sphereGeometry args={[.055, 16, 16]} />
          <meshStandardMaterial color="#f4772b" roughness={.25} metalness={.3} />
        </mesh>
      </group>
      <mesh rotation={[1.24, .31, .34]} position={[0, .03, 0]} scale={[1.1, 1, 1]}>
        <torusGeometry args={[2.04, .004, 5, 120]} />
        <meshBasicMaterial color="#e99552" transparent opacity={.3} />
      </mesh>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[particles, 3]} /></bufferGeometry>
        <pointsMaterial color="#e77d3a" size={.027} transparent opacity={.65} sizeAttenuation />
      </points>
    </group>
  </>;
}

export default function EnergyEmblem({ className = '' }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState(false);
  const [entered, setEntered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const onFailure = useMemo(() => () => setFailed(true), []);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2');
      setSupported(Boolean(context));
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch { setSupported(false); }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduced(media.matches);
    const updateVisibility = () => setTabVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setEntered(true);
    }, { rootMargin: '80px' });
    if (host.current) observer.observe(host.current);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  const moving = visible && tabVisible && !reduced;
  const showCanvas = supported && entered && !failed;
  return <div ref={host} className={`${styles.emblem} ${className}`} aria-hidden="true" data-animated={moving}>
    <div className={styles.halo} />
    <div className={styles.floor} />
    <div className={`${styles.fallback} ${ready && !failed ? styles.hidden : ''}`}>
      <div className={styles.fallbackOrbit} />
      <div className={styles.fallbackLoop} />
      <div className={styles.fallbackInner} />
      <div className={styles.fallbackCore} />
    </div>
    {showCanvas && <div className={styles.canvas}>
      <EmblemBoundary onFailure={onFailure}>
        <Canvas
          camera={{ position: [0, .25, 6.7], fov: 43 }}
          dpr={[1, 1.5]}
          frameloop={moving ? 'always' : 'demand'}
          gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.2;
            setReady(true);
          }}
          fallback={null}
          style={{ touchAction: 'pan-y' }}
        >
          <StudioLighting onFailure={onFailure} />
          <Sculpture moving={moving} />
        </Canvas>
      </EmblemBoundary>
    </div>}
    <span className={styles.crossTop}>+</span>
    <span className={styles.crossBottom}>+</span>
    <span className={styles.coordinate}>28°36′ N &nbsp; 77°12′ E</span>
  </div>;
}
