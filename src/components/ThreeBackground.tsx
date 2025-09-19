import { useEffect, useRef } from 'react';

// Type declaration for Three.js
interface ThreeJS {
  Scene: new () => any;
  PerspectiveCamera: new (fov: number, aspect: number, near: number, far: number) => any;
  WebGLRenderer: new (options: { canvas: HTMLCanvasElement; alpha: boolean; antialias: boolean }) => any;
  BufferGeometry: new () => any;
  BufferAttribute: new (array: Float32Array, itemSize: number) => any;
  PointsMaterial: new (options: { size: number; color: number; transparent: boolean; opacity: number; blending: number }) => any;
  Points: new (geometry: any, material: any) => any;
  PlaneGeometry: new (width: number, height: number, widthSegments: number, heightSegments: number) => any;
  MeshBasicMaterial: new (options: { color: number; transparent: boolean; opacity: number; wireframe: boolean }) => any;
  Mesh: new (geometry: any, material: any) => any;
  AdditiveBlending: number;
}

declare global {
  interface Window {
    THREE: ThreeJS;
  }
}

const ThreeBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || !window.THREE) return;

    const { THREE } = window;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 150;
    const posArray = new Float32Array(particlesCount * 3);
    const velocityArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
      velocityArray[i] = (Math.random() - 0.5) * 0.002;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add gentle waves
    const waveGeometry = new THREE.PlaneGeometry(50, 50, 100, 100);
    const waveMaterial = new THREE.MeshBasicMaterial({
      color: 0xc7d2fe,
      transparent: true,
      opacity: 0.1,
      wireframe: true
    });
    
    const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
    waveMesh.rotation.x = -Math.PI / 2;
    waveMesh.position.y = -5;
    scene.add(waveMesh);

    camera.position.z = 10;

    let time = 0;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Animate particles
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocityArray[i3];
        positions[i3 + 1] += velocityArray[i3 + 1] + Math.sin(time + i) * 0.0005;
        positions[i3 + 2] += velocityArray[i3 + 2];

        // Reset particles that go too far
        if (positions[i3] > 10) positions[i3] = -10;
        if (positions[i3] < -10) positions[i3] = 10;
        if (positions[i3 + 1] > 10) positions[i3 + 1] = -10;
        if (positions[i3 + 1] < -10) positions[i3 + 1] = 10;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // Animate waves
      const wavePositions = waveGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < wavePositions.length; i += 3) {
        const x = wavePositions[i];
        const y = wavePositions[i + 1];
        wavePositions[i + 2] = Math.sin(x * 0.1 + time) * 0.5 + Math.sin(y * 0.1 + time) * 0.5;
      }
      waveGeometry.attributes.position.needsUpdate = true;

      // Gentle rotation
      particlesMesh.rotation.y = time * 0.1;
      waveMesh.rotation.z = time * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40"
      style={{ background: 'transparent' }}
    />
  );
};

export default ThreeBackground;