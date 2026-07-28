import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Edges } from '@react-three/drei';
import * as THREE from 'three';

const getBuildingColor = (extension) => {
  const colors = {
    js: '#f7df1e',
    jsx: '#61dafb',
    ts: '#3178c6',
    tsx: '#3178c6',
    css: '#264de4',
    html: '#e34f26',
    json: '#000000',
    md: '#ffffff',
    py: '#3776ab',
    rs: '#dea584'
  };
  return colors[extension] || '#888888';
};

const Building = ({ data, position, onFileClick }) => {
  const [hovered, setHovered] = useState(false);
  const color = getBuildingColor(data.extension);
  
  const height = Math.max(0.5, Math.log10(data.size || 10) * 0.5); 

  return (
    <group position={position}>
      <mesh 
        position={[0, height / 2, 0]} 
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        onClick={(e) => { 
          e.stopPropagation(); 
          onFileClick(data);
        }}
        cursor="pointer"
      >
        <boxGeometry args={[1, height, 1]} />
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : color} 
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.5}
          roughness={0.2} 
          metalness={0.1} 
        />
        <Edges scale={1} threshold={15} color={hovered ? '#ffffff' : '#000000'} />
      </mesh>
      {hovered && (
        <Text
          position={[0, height + 0.5, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {data.name}
        </Text>
      )}
    </group>
  );
};

const District = ({ data, position, level = 0, onFileClick }) => {
  const items = data.children || [];
  const count = items.length;
  const cols = Math.ceil(Math.sqrt(count));
  const spacing = 1.5;
  
  const width = cols * spacing;
  const depth = Math.ceil(count / cols) * spacing;
  
  return (
    <group position={position}>
      <mesh position={[(width-spacing)/2, -0.1, (depth-spacing)/2]}>
        <boxGeometry args={[width + 1, 0.2, depth + 1]} />
        <meshStandardMaterial color="#1a1a2e" opacity={0.8} transparent />
        <Edges scale={1} threshold={15} color="#4a4a6a" />
      </mesh>
      
      <Text
        position={[(width-spacing)/2, 0.2, (depth-spacing)/2 + depth/2 + 0.5]}
        fontSize={0.5}
        color="#a0a0b0"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI/2, 0, 0]}
      >
        {data.name}
      </Text>

      {items.map((child, i) => {
        const x = (i % cols) * spacing;
        const z = Math.floor(i / cols) * spacing;
        
        if (child.type === 'file') {
          return <Building key={child.path} data={child} position={[x, 0, z]} onFileClick={onFileClick} />;
        } else {
          return <District key={child.path} data={child} position={[x, 0, z]} level={level + 1} onFileClick={onFileClick} />;
        }
      })}
    </group>
  );
};

const Cityscape = ({ tree, onFileClick }) => {
  if (!tree) return null;

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050510' }}>
      <Canvas camera={{ position: [15, 15, 15], fov: 50 }}>
        <color attach="background" args={['#050510']} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2.5} color="#ff00aa" />
        <pointLight position={[-10, 10, -10]} intensity={2.5} color="#00aaff" />
        <directionalLight position={[0, 10, 5]} intensity={2} />
        
        <group position={[-5, 0, -5]}>
          <District data={tree} position={[0, 0, 0]} onFileClick={onFileClick} />
        </group>
        
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};

export default Cityscape;
