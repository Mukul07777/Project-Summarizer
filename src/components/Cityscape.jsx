import React, { useState, useRef, useEffect, useContext } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Edges, QuadraticBezierLine, CameraControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const BuildingRegistryContext = React.createContext(null);

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

const DependencyLines = ({ selectedFile, activeDependencies }) => {
  const registry = useContext(BuildingRegistryContext);
  const [lines, setLines] = useState([]);

  // Use a simple effect to update lines when selection changes
  // We use requestAnimationFrame to ensure all building matrices are updated by ThreeJS first
  useEffect(() => {
    let frameId;
    
    const updateLines = () => {
      if (!registry || !registry.current) return;
      
      if (!selectedFile || !activeDependencies || activeDependencies.length === 0) {
        setLines([]);
        return;
      }
      
      const sourceRef = registry.current.get(selectedFile.path);
      if (!sourceRef) return;

      const sourcePos = new THREE.Vector3();
      sourceRef.getWorldPosition(sourcePos);

      const newLines = [];
      activeDependencies.forEach(depPath => {
        // Strip out quotes and paths like ./ or ../
        const cleanDepName = depPath.replace(/['"./]/g, '');
        if (!cleanDepName) return;

        // Naive resolution: find a building whose name includes the import
        for (const [path, ref] of registry.current.entries()) {
          if (path !== selectedFile.path && path.toLowerCase().includes(cleanDepName.toLowerCase())) {
            const targetPos = new THREE.Vector3();
            ref.getWorldPosition(targetPos);
            newLines.push({ start: sourcePos, end: targetPos });
            break; 
          }
        }
      });
      
      setLines(newLines);
    };

    frameId = requestAnimationFrame(() => {
      updateLines();
    });

    return () => cancelAnimationFrame(frameId);
  }, [selectedFile, activeDependencies, registry]);

  return (
    <group>
      {lines.map((line, i) => {
        const mid = new THREE.Vector3().addVectors(line.start, line.end).multiplyScalar(0.5);
        mid.y += Math.max(3, line.start.distanceTo(line.end) * 0.3); // Arc height
        
        return (
          <QuadraticBezierLine
            key={i}
            start={line.start}
            end={line.end}
            mid={mid}
            color="#ff00aa"
            lineWidth={4}
            transparent
            opacity={0.8}
            dashed={true}
            dashScale={5}
            dashSize={1}
          />
        );
      })}
    </group>
  );
};

const Building = ({ data, position, onFileClick, searchQuery, aiHighlightedFiles }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef();
  const registry = useContext(BuildingRegistryContext);
  
  const color = getBuildingColor(data.extension);
  const height = Math.max(0.5, Math.log10(data.size || 10) * 0.5); 
  
  const isSearchMatch = searchQuery && data.name.toLowerCase().includes(searchQuery.toLowerCase());
  const isAiMatch = aiHighlightedFiles && aiHighlightedFiles.includes(data.path);
  
  const isDimmed = (searchQuery && !isSearchMatch) || (aiHighlightedFiles && aiHighlightedFiles.length > 0 && !isAiMatch);

  useEffect(() => {
    if (registry && registry.current && ref.current) {
      registry.current.set(data.path, ref.current);
    }
    return () => {
      if (registry && registry.current) {
        registry.current.delete(data.path);
      }
    };
  }, [data.path, registry]);

  const finalColor = isAiMatch ? '#ffaa00' : isSearchMatch ? '#00ffaa' : hovered ? '#ffffff' : color;
  const emissiveIntensity = isAiMatch ? 3 : isSearchMatch ? 2 : hovered ? 0.8 : isDimmed ? 0.1 : 0.5;

  return (
    <group position={position} ref={ref}>
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
          color={finalColor} 
          emissive={finalColor}
          emissiveIntensity={emissiveIntensity}
          opacity={isDimmed ? 0.2 : 1}
          transparent={isDimmed}
          roughness={0.2} 
          metalness={0.1} 
        />
        <Edges scale={1} threshold={15} color={isAiMatch || isSearchMatch || hovered ? '#ffffff' : '#000000'} />
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

const District = ({ data, position, level = 0, onFileClick, searchQuery, aiHighlightedFiles }) => {
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
          return <Building key={child.path} data={child} position={[x, 0, z]} onFileClick={onFileClick} searchQuery={searchQuery} aiHighlightedFiles={aiHighlightedFiles} />;
        } else {
          return <District key={child.path} data={child} position={[x, 0, z]} level={level + 1} onFileClick={onFileClick} searchQuery={searchQuery} aiHighlightedFiles={aiHighlightedFiles} />;
        }
      })}
    </group>
  );
};

const Cityscape = ({ tree, onFileClick, searchQuery, selectedFile, activeDependencies, aiHighlightedFiles }) => {
  const registry = useRef(new Map());
  const cameraControlsRef = useRef();

  useEffect(() => {
    if (aiHighlightedFiles && aiHighlightedFiles.length > 0 && registry.current && cameraControlsRef.current) {
      const center = new THREE.Vector3();
      let count = 0;
      
      aiHighlightedFiles.forEach(path => {
        const ref = registry.current.get(path);
        if (ref) {
          const pos = new THREE.Vector3();
          ref.getWorldPosition(pos);
          center.add(pos);
          count++;
        }
      });
      
      if (count > 0) {
        center.divideScalar(count);
        // Position camera diagonally up and away from the center of matches
        const camPos = center.clone().add(new THREE.Vector3(5, 8, 8));
        cameraControlsRef.current.setLookAt(
          camPos.x, camPos.y, camPos.z, // Position
          center.x, center.y, center.z, // Target
          true // Smooth animation
        );
      }
    }
  }, [aiHighlightedFiles]);

  if (!tree) return null;

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#020205' }}>
      <Canvas camera={{ position: [15, 15, 15], fov: 50 }}>
        <color attach="background" args={['#020205']} />
        <fog attach="fog" args={['#020205', 20, 70]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <ambientLight intensity={1.0} />
        <pointLight position={[10, 20, 10]} intensity={2.0} color="#ff00aa" />
        <pointLight position={[-10, 20, -10]} intensity={2.0} color="#00aaff" />
        <directionalLight position={[0, 10, 5]} intensity={1.5} />
        
        <BuildingRegistryContext.Provider value={registry}>
          <group position={[-5, 0, -5]}>
            <District data={tree} position={[0, 0, 0]} onFileClick={onFileClick} searchQuery={searchQuery} aiHighlightedFiles={aiHighlightedFiles} />
          </group>
          <DependencyLines selectedFile={selectedFile} activeDependencies={activeDependencies} />
        </BuildingRegistryContext.Provider>
        
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.2} />
        </EffectComposer>
        
        <CameraControls ref={cameraControlsRef} makeDefault />
      </Canvas>
    </div>
  );
};

export default Cityscape;
