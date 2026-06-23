import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function FloatingNodes(props) {
  const ref = useRef();
  
  // Mathematically generate a clean cluster of 1,500 point vectors inside a spherical boundary
  const [sphere] = useState(() => random.inSphere(new Float32Array(4500), { radius: 1.2 }));

  useFrame((state, delta) => {
    // Continuous subtle rotational tracking loops to simulate an active background mind map
    ref.current.rotation.x -= delta / 15;
    ref.current.rotation.y -= delta / 20;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial 
          transparent 
          color="#6366F1" 
          size={0.015} 
          sizeAttenuation 
          depthWrite={false} 
        />
      </Points>
    </group>
  );
}

export default function InteractiveBrainCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-30 dark:opacity-50 transition-opacity duration-500">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <FloatingNodes />
      </Canvas>
    </div>
  );
}