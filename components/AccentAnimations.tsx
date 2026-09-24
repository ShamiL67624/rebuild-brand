'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type AccentKind = 'spark' | 'flow' | 'solar' | 'current' | 'aurora';

function BusinessCurrent({ moving, wide = false }: { moving: boolean; wide?: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ time: { value: 0 }, wide: { value: wide ? 1 : 0 } }), [wide]);
  useFrame((_, delta) => {
    if (moving && material.current) material.current.uniforms.time.value += Math.min(delta, .05);
  });
  return <mesh frustumCulled={false}>
    <planeGeometry args={[2, 2]}/>
    <shaderMaterial ref={material} transparent depthWrite={false} depthTest={false} uniforms={uniforms}
      vertexShader={`varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`}
      fragmentShader={`precision mediump float;
        varying vec2 vUv;
        uniform float time;
        uniform float wide;
        void main() {
          vec2 uv = mix(vUv, vUv.yx, wide);
          float light = 0.0;
          for (int i = 0; i < 4; i++) {
            float lane = float(i);
            float path = .18 + lane * .19 + sin(uv.y * 7.0 + time * .32 + lane * 1.6) * .13;
            float distanceToPath = abs(uv.x - path);
            float thread = 1.0 - smoothstep(.001, .006, distanceToPath);
            float halo = exp(-distanceToPath * 30.0) * .09;
            float pulse = pow(max(0.0, sin(uv.y * 17.0 - time * (1.3 + lane * .2) + lane * 2.0)), 22.0);
            light += thread * (.13 + pulse * .55) + halo * pulse;
            light += wide * exp(-distanceToPath * 13.0) * (.025 + .025 * sin(time * .4 + lane));
          }
          float fade = smoothstep(0.0, .08, uv.y) * smoothstep(0.0, .08, 1.0 - uv.y);
          vec3 gold = mix(vec3(.63, .40, .18), vec3(.95, .77, .44), min(light, 1.0));
          gl_FragColor = vec4(gold, min(light * fade, .68));
        }`}/>
  </mesh>;
}

export default function AccentAnimations({ kind, moving }: { kind: AccentKind; moving: boolean }) {
  const group = useRef<THREE.Group>(null);
  const lights = useRef<THREE.Group>(null);
  const progress = useRef(.5);
  const time = useRef(0);
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-6, -.8, 0), new THREE.Vector3(-3, .5, .2),
    new THREE.Vector3(0, -.2, .3), new THREE.Vector3(3, .7, .1), new THREE.Vector3(6, -.3, 0),
  ]), []);
  useEffect(() => {
    if (kind !== 'flow' || !moving) return;
    const update = () => {
      const bounds = document.getElementById('businesses')?.getBoundingClientRect();
      if (bounds) progress.current = THREE.MathUtils.clamp((innerHeight - bounds.top) / (innerHeight + bounds.height), 0, 1);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [kind, moving]);
  useFrame((_, delta) => {
    if (!moving || !group.current) return;
    time.current += Math.min(delta, .05);
    const t = time.current;
    if (kind === 'flow') {
      group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, (progress.current - .5) * .2, 3, delta);
      lights.current?.children.forEach((light, i) => light.position.copy(curve.getPoint((t * .07 + i / 6 + progress.current * .25) % 1)));
    } else {
      group.current.rotation.z = t * (kind === 'spark' ? .25 : .075);
      group.current.rotation.y = Math.sin(t * .3) * .3;
      lights.current?.children.forEach((light, i) => {
        const angle = t * .5 + i * Math.PI * 2 / 3;
        light.position.set(Math.cos(angle) * 1.55, Math.sin(angle) * 1.55, Math.sin(angle * 2) * .3);
      });
    }
  });
  if (kind === 'current') return <BusinessCurrent moving={moving}/>;
  if (kind === 'aurora') return <BusinessCurrent moving={moving} wide/>;
  if (kind === 'flow') return <group ref={group}>
    {[0, .13, -.13].map(offset => <mesh key={offset} position={[0, offset, 0]}><tubeGeometry args={[curve, 64, .009, 4, false]}/><meshBasicMaterial color="#d7b475" transparent opacity={offset === 0 ? .65 : .25}/></mesh>)}
    <group ref={lights}>{Array.from({ length: 6 }, (_, i) => <mesh key={i} position={curve.getPoint(i / 6)}><sphereGeometry args={[.045, 8, 8]}/><meshBasicMaterial color="#ffe1a1"/></mesh>)}</group>
  </group>;
  return <group ref={group}>
    {[0, 1, 2].map(i => <mesh key={i} rotation={[i * .55, i * .45, i * .7]}><torusGeometry args={[1.5, .012, 5, 64]}/><meshBasicMaterial color="#d8b676" transparent opacity={.55 - i * .1}/></mesh>)}
    {kind === 'solar' && <><mesh><icosahedronGeometry args={[.65, 1]}/><meshBasicMaterial color="#e8c780" wireframe transparent opacity={.65}/></mesh>{Array.from({ length: 16 }, (_, i) => { const a = i * Math.PI / 8; return <mesh key={i} position={[Math.cos(a) * 1.95, Math.sin(a) * 1.95, 0]} rotation={[0, 0, a]}><boxGeometry args={[.2, .012, .012]}/><meshBasicMaterial color="#d8b676" transparent opacity={.6}/></mesh>; })}</>}
    <group ref={lights}>{[0, 1, 2].map(i => <mesh key={i} position={[Math.cos(i * 2.094) * 1.55, Math.sin(i * 2.094) * 1.55, 0]}><sphereGeometry args={[.055, 8, 8]}/><meshBasicMaterial color="#ffe3a4"/></mesh>)}</group>
  </group>;
}
