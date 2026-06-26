import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Character } from '../types';

interface ThreeCanvasProps {
  characters: Character[];
  selectedChar: Character | null;
  onSelectChar: (char: Character | null) => void;
  onTransitionComplete?: () => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  characters,
  selectedChar,
  onSelectChar,
  onTransitionComplete,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const particlesRef = useRef<THREE.Points | null>(null);
  const particleCount = 250;
  const particleData = useRef<{ pos: THREE.Vector3; speed: THREE.Vector3 }[]>(
    [],
  );

  // Update sizes on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current)
        return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set up ThreeScene on mount
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 15);
    cameraRef.current = camera;

    // 3. Renderer with alpha = true (to see beautiful gradient background underneath)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.DirectionalLight(0xffffff, 1.2);
    pointLight.position.set(5, 10, 7);
    scene.add(pointLight);

    // 5. Background Ambient Sparkles
    const pGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 32;
      const y = (Math.random() - 0.5) * 22;
      const z = (Math.random() - 0.5) * 15;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      particleData.current.push({
        pos: new THREE.Vector3(x, y, z),
        speed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005 + 0.004,
          (Math.random() - 0.5) * 0.005,
        ),
      });

      // Soft white and blue background particles
      colors[i * 3] = 0.85 + Math.random() * 0.15;
      colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
      colors[i * 3 + 2] = 0.95 + Math.random() * 0.05;
    }

    pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom Canvas Round Glow Texture
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const pMaterial = new THREE.PointsMaterial({
      size: 0.16,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false,
    });

    const sparkles = new THREE.Points(pGeometry, pMaterial);
    scene.add(sparkles);
    particlesRef.current = sparkles;

    // 6. Render/Animate Tick Loop
    const animate = () => {
      // Rotate sparkles ambiently
      if (particlesRef.current) {
        const positionsArr = particlesRef.current.geometry.attributes.position
          .array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const data = particleData.current[i];
          data.pos.add(data.speed);

          if (data.pos.y > 11) data.pos.y = -11;
          if (data.pos.x > 16) data.pos.x = -16;
          if (data.pos.x < -16) data.pos.x = 16;

          positionsArr[i * 3] = data.pos.x;
          positionsArr[i * 3 + 1] = data.pos.y;
          positionsArr[i * 3 + 2] = data.pos.z;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className='absolute inset-0 w-full h-full z-0 pointer-events-none'
      id='three-canvas-root'
    />
  );
};
