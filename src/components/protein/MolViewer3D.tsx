import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ProteinProfile } from '../../types';
import { RotateCw, Pause, Play, Eye, Maximize2, ShieldCheck, Sparkles, Layers, Box, Atom } from 'lucide-react';

interface MolViewer3DProps {
  protein: ProteinProfile;
}

export const MolViewer3D: React.FC<MolViewer3DProps> = ({ protein }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [renderStyle, setRenderStyle] = useState<'cartoon' | 'ribbon' | 'spheres' | 'wireframe' | 'surface'>('cartoon');
  const [colorMode, setColorMode] = useState<'secondary' | 'plddt' | 'hydrophobicity'>('secondary');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = 380;

    // 1. Scene setup with light white / crisp background
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xfbfbfd);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 48;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    currentMount.innerHTML = '';
    currentMount.appendChild(renderer.domElement);

    // 4. Studio Lighting for crisp light background
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xea580c, 1.8);
    dirLight1.position.set(25, 30, 25);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0284c7, 1.4);
    dirLight2.position.set(-25, -20, -20);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xd97706, 1.2, 80);
    pointLight.position.set(0, 10, 25);
    scene.add(pointLight);

    // 5. Generate Molecule Model
    const molGroup = new THREE.Group();
    groupRef.current = molGroup;
    scene.add(molGroup);

    generateProteinStructure(molGroup, protein, renderStyle, colorMode);

    // 6. Interactive Mouse Drag to Rotate
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !molGroup) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      molGroup.rotation.y += deltaX * 0.01;
      molGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // 7. Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      if (isRotating && molGroup && !isDragging) {
        molGroup.rotation.y += 0.005;
        molGroup.rotation.x += 0.002;
      }
      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize listener
    const handleResize = () => {
      if (!currentMount || !rendererRef.current) return;
      const newWidth = currentMount.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [protein, renderStyle, colorMode, isRotating]);

  const generateProteinStructure = (
    group: THREE.Group,
    prot: ProteinProfile,
    style: string,
    colorScheme: string
  ) => {
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    // Spine coordinates
    const numResidues = Math.min(prot.length || 384, 130);
    const points: THREE.Vector3[] = [];

    // Folds simulating alpha-helices and beta-sheets
    for (let i = 0; i < numResidues; i++) {
      const t = (i / numResidues) * Math.PI * 6.5;
      const radius = 7.5 + Math.sin(i * 0.28) * 3.5;
      const x = Math.cos(t) * radius;
      const y = (i - numResidues / 2) * 0.48 + Math.cos(i * 0.45) * 2.2;
      const z = Math.sin(t) * radius + Math.sin(i * 0.55) * 2.5;
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);

    // Color Scheme
    const getColorForResidue = (index: number) => {
      if (colorScheme === 'plddt') {
        const plddt = 94 - (index % 28);
        if (plddt > 85) return new THREE.Color(0x0284c7); // High Confidence Blue
        if (plddt > 70) return new THREE.Color(0x10b981); // Good Confidence Emerald
        return new THREE.Color(0xf59e0b); // Low Confidence Amber
      } else if (colorScheme === 'hydrophobicity') {
        return index % 2 === 0 ? new THREE.Color(0xea580c) : new THREE.Color(0x0d9488);
      } else {
        // Secondary structure: Alpha Helices (Vibrant Orange), Beta Sheets (Teal), Loops (Indigo)
        if (index % 18 < 8) return new THREE.Color(0xea580c); // Alpha Helix
        if (index % 18 < 14) return new THREE.Color(0x0d9488); // Beta Strand
        return new THREE.Color(0x6366f1); // Loop / Coil
      }
    };

    if (style === 'cartoon') {
      // Cartoon format: Thick ribbon backbone with styled secondary structure cylinders and arrow strands
      const tubeGeometry = new THREE.TubeGeometry(curve, 120, 0.9, 10, false);
      const material = new THREE.MeshStandardMaterial({
        color: 0xea580c,
        roughness: 0.25,
        metalness: 0.2,
      });
      const mesh = new THREE.Mesh(tubeGeometry, material);
      group.add(mesh);

      // Add secondary structure cartoon nodes
      points.forEach((pt, idx) => {
        if (idx % 2 === 0) {
          const isHelix = idx % 18 < 8;
          const geo = isHelix 
            ? new THREE.CylinderGeometry(1.2, 1.2, 1.4, 12)
            : new THREE.BoxGeometry(1.5, 0.8, 1.8);
          const mat = new THREE.MeshStandardMaterial({
            color: getColorForResidue(idx),
            roughness: 0.2,
            metalness: 0.3,
          });
          const node = new THREE.Mesh(geo, mat);
          node.position.copy(pt);
          node.lookAt(points[(idx + 1) % points.length]);
          group.add(node);
        }
      });
    } else if (style === 'ribbon') {
      const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.7, 8, false);
      const material = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.3,
        metalness: 0.2,
      });
      const mesh = new THREE.Mesh(tubeGeometry, material);
      group.add(mesh);

      points.forEach((pt, idx) => {
        if (idx % 3 === 0) {
          const sphereGeo = new THREE.SphereGeometry(0.8, 12, 12);
          const sphereMat = new THREE.MeshStandardMaterial({
            color: getColorForResidue(idx),
            roughness: 0.2,
            metalness: 0.4,
          });
          const sphere = new THREE.Mesh(sphereGeo, sphereMat);
          sphere.position.copy(pt);
          group.add(sphere);
        }
      });
    } else if (style === 'spheres') {
      points.forEach((pt, idx) => {
        const sphereGeo = new THREE.SphereGeometry(1.4, 16, 16);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: getColorForResidue(idx),
          roughness: 0.25,
          metalness: 0.3,
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.copy(pt);
        group.add(sphere);
      });
    } else if (style === 'wireframe') {
      const tubeGeometry = new THREE.TubeGeometry(curve, 100, 1.0, 6, false);
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0xea580c,
        wireframe: true,
      });
      const mesh = new THREE.Mesh(tubeGeometry, wireframeMat);
      group.add(mesh);
    } else {
      // Surface mode
      const tubeGeometry = new THREE.TubeGeometry(curve, 90, 2.0, 14, false);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x0d9488,
        roughness: 0.2,
        transmission: 0.3,
        thickness: 1.4,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(tubeGeometry, material);
      group.add(mesh);
    }
  };

  return (
    <div className="relative rounded-3xl bg-white border border-orange-200 overflow-hidden shadow-sm">
      {/* 3D WebGL Canvas with light white background */}
      <div ref={mountRef} className="w-full h-[380px] cursor-grab active:cursor-grabbing bg-[#fbfbfd]" />

      {/* Top Overlay Badges */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 pointer-events-none">
        <span className="px-3 py-1 rounded-xl bg-white/95 text-slate-900 border border-orange-200 text-xs font-mono font-extrabold shadow-sm">
          {protein.geneSymbol} • {protein.uniprotId}
        </span>
        {protein.pdbId && (
          <span className="px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-950 border border-orange-300 text-[11px] font-mono font-bold shadow-xs">
            PDB: {protein.pdbId}
          </span>
        )}
        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300 text-[11px] font-mono font-bold flex items-center space-x-1 shadow-xs">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>3D WebGL Visualization</span>
        </span>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-orange-200 shadow-md text-xs">
        {/* Style Selector */}
        <div className="flex items-center space-x-1">
          <span className="text-slate-800 font-extrabold text-[11px] mr-1 hidden sm:inline">Format:</span>
          {(['cartoon', 'ribbon', 'spheres', 'wireframe', 'surface'] as const).map((style) => (
            <button
              key={style}
              onClick={() => setRenderStyle(style)}
              className={`px-2.5 py-1 rounded-xl capitalize text-[11px] font-bold transition-all cursor-pointer ${
                renderStyle === style
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-orange-50'
              }`}
            >
              {style}
            </button>
          ))}
        </div>

        {/* Color Scheme Selector & Rotation Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <span className="text-slate-800 font-extrabold text-[11px] mr-1 hidden sm:inline">Color:</span>
            {(['secondary', 'plddt', 'hydrophobicity'] as const).map((col) => (
              <button
                key={col}
                onClick={() => setColorMode(col)}
                className={`px-2 py-1 rounded-lg text-[10px] uppercase font-mono font-bold transition-all cursor-pointer ${
                  colorMode === col
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-orange-50'
                }`}
              >
                {col === 'secondary' ? '2° Structure' : col === 'plddt' ? 'pLDDT' : 'Hydro'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className="p-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-950 border border-orange-300 transition-colors cursor-pointer shadow-xs"
            title={isRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-orange-700" />}
          </button>
        </div>
      </div>
    </div>
  );
};
