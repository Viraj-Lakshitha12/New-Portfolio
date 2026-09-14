import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function WireframeOrb() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || 300;
    let height = mount.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const geo1 = new THREE.IcosahedronGeometry(1.6, 2);
    const mat1 = new THREE.MeshBasicMaterial({
      color: 0x64d2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const orb1 = new THREE.Mesh(geo1, mat1);
    scene.add(orb1);

    const geo2 = new THREE.IcosahedronGeometry(1.05, 1);
    const mat2 = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const orb2 = new THREE.Mesh(geo2, mat2);
    scene.add(orb2);

    const geo3 = new THREE.IcosahedronGeometry(0.55, 0);
    const mat3 = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const orb3 = new THREE.Mesh(geo3, mat3);
    scene.add(orb3);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      orb1.rotation.x += 0.003;
      orb1.rotation.y += 0.005;
      orb2.rotation.x -= 0.004;
      orb2.rotation.y -= 0.003;
      orb3.rotation.x += 0.006;
      orb3.rotation.y -= 0.007;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      width = mount.clientWidth || 300;
      height = mount.clientHeight || 300;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      geo1.dispose();
      mat1.dispose();
      geo2.dispose();
      mat2.dispose();
      geo3.dispose();
      mat3.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}