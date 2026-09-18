import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, Sphere, TorusKnot } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedCore() {
  const meshRef = useRef(null);
  const torusRef = useRef(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.cos(t / 4) / 2;
      meshRef.current.rotation.y = Math.sin(t / 4) / 2;
      meshRef.current.position.y = Math.sin(t / 1.5) / 10;
    }
    
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.2;
      torusRef.current.rotation.y = t * 0.3;
      torusRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            roughness={0.1}
            metalness={0.8}
            transmission={0.9}
            thickness={1}
            ior={1.5}
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
      </Float>

      <mesh ref={torusRef}>
        <torusKnotGeometry args={[2.2, 0.05, 128, 16]} />
        <meshStandardMaterial 
          color="#a855f7" 
          roughness={0.2}
          metalness={0.8}
          emissive="#64D2FF"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#a855f7" />
        
        <AnimatedCore />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
