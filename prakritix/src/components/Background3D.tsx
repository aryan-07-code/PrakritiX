import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

const NODE_COUNT = 60;
const CONNECTION_DISTANCE = 4.0;

function NeuralNetwork({ isLightMode }: { isLightMode: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  
  // Generate random node positions, colors, and velocities
  const { positions, colors, velocities } = useMemo(() => {
    const positions = new Float32Array(NODE_COUNT * 3);
    const colors = new Float32Array(NODE_COUNT * 3);
    const velocities = [];
    
    const colorPalette = [
      new THREE.Color('#10b981'), // Green (Degradable)
      new THREE.Color('#f59e0b'), // Orange (Non-Degradable)
      new THREE.Color('#e5e7eb'), // Silver/White (Metal)
      new THREE.Color('#ef4444'), // Red (Hazardous)
    ];

    for (let i = 0; i < NODE_COUNT; i++) {
      // Random position in a sphere
      const r = 10 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Random velocity for drift
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.015,
        (Math.random() - 0.5) * 0.015,
        (Math.random() - 0.5) * 0.015
      ));
    }
    
    return { positions, colors, velocities };
  }, []);

  // Pre-allocate arrays for line geometry to avoid GC overhead
  const maxLines = (NODE_COUNT * (NODE_COUNT - 1)) / 2;
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
  const lineColors = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
  
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    return geo;
  }, [linePositions, lineColors]);

  const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: isLightMode ? 0.3 : 0.6,
    blending: isLightMode ? THREE.NormalBlending : THREE.AdditiveBlending,
    depthWrite: false,
  }), [isLightMode]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!groupRef.current || !linesRef.current || !instancedMeshRef.current) return;
    
    // Slow rotation of the entire group
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;

    // Drift nodes
    for (let i = 0; i < NODE_COUNT; i++) {
      positions[i * 3] += velocities[i].x;
      positions[i * 3 + 1] += velocities[i].y;
      positions[i * 3 + 2] += velocities[i].z;
      
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      const dist = Math.sqrt(x*x + y*y + z*z);
      
      // Bounce back if they drift too far
      if (dist > 12) {
        velocities[i].multiplyScalar(-1);
      }

      // Update instanced mesh
      dummy.position.set(x, y, z);
      
      // Add slight rotation to nodes
      dummy.rotation.x += 0.01;
      dummy.rotation.y += 0.01;
      
      dummy.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
      
      // Set color for bloom
      const pulse = (Math.sin(state.clock.elapsedTime * 2 + i) + 1) * 0.5;
      const baseColor = new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]);
      
      // Adjust color based on theme
      if (isLightMode) {
        instancedMeshRef.current.setColorAt(i, baseColor.multiplyScalar(0.3 + pulse * 0.2));
      } else {
        instancedMeshRef.current.setColorAt(i, baseColor.multiplyScalar(0.5 + pulse * 0.5));
      }
    }
    
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    if (instancedMeshRef.current.instanceColor) {
      instancedMeshRef.current.instanceColor.needsUpdate = true;
    }

    // Update connections
    let lineCount = 0;
    
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distSq = dx*dx + dy*dy + dz*dz;
        
        if (distSq < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
          const idx = lineCount * 6;
          
          linePositions[idx] = positions[i * 3];
          linePositions[idx + 1] = positions[i * 3 + 1];
          linePositions[idx + 2] = positions[i * 3 + 2];
          linePositions[idx + 3] = positions[j * 3];
          linePositions[idx + 4] = positions[j * 3 + 1];
          linePositions[idx + 5] = positions[j * 3 + 2];
          
          const alpha = 1.0 - Math.sqrt(distSq) / CONNECTION_DISTANCE;
          const pulse = (Math.sin(state.clock.elapsedTime * 3 + i + j) + 1) * 0.5 * 0.5 + 0.5;
          const intensity = isLightMode ? (alpha * pulse * 0.8) : (alpha * pulse * 2.0); // Boost intensity for bloom
          
          lineColors[idx] = colors[i * 3] * intensity;
          lineColors[idx + 1] = colors[i * 3 + 1] * intensity;
          lineColors[idx + 2] = colors[i * 3 + 2] * intensity;
          lineColors[idx + 3] = colors[j * 3] * intensity;
          lineColors[idx + 4] = colors[j * 3 + 1] * intensity;
          lineColors[idx + 5] = colors[j * 3 + 2] * intensity;
          
          lineCount++;
        }
      }
    }
    
    lineGeometry.setDrawRange(0, lineCount * 2);
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={instancedMeshRef} args={[null as any, null as any, NODE_COUNT]}>
        <icosahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial 
          color={isLightMode ? "#e2e8f0" : "#1a2035"} 
          metalness={0.9} 
          roughness={0.1} 
          transparent 
          opacity={isLightMode ? 0.6 : 0.9} 
        />
      </instancedMesh>
      <lineSegments ref={linesRef} geometry={lineGeometry} material={lineMaterial} />
    </group>
  );
}

export default function Background3D() {
  const { theme } = useTheme();
  const isLightMode = theme === 'light';
  
  return (
    <div className={`fixed inset-0 -z-10 transition-colors duration-500 ${isLightMode ? 'bg-gray-50' : 'bg-[#0a0e27]'}`}>
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={[isLightMode ? '#f9fafb' : '#0a0e27']} />
        <ambientLight intensity={isLightMode ? 0.6 : 0.2} />
        <pointLight position={[10, 10, 10]} intensity={isLightMode ? 1.5 : 1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f0ff" />
        
        <NeuralNetwork isLightMode={isLightMode} />
        
        {!isLightMode && (
          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.1} 
              luminanceSmoothing={0.9} 
              intensity={1.5} 
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
