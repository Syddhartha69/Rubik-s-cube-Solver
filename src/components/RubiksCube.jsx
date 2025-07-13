import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import * as THREE from "three";

// Individual cube piece component
function CubePiece({ position, color, size = 0.9 }) {
  const meshRef = useRef();

  return (
    <Box ref={meshRef} args={[size, size, size]} position={position}>
      <meshStandardMaterial color={color} />
    </Box>
  );
}

// Main Rubik's Cube component
function RubiksCube() {
  const groupRef = useRef();
  const [rotation, setRotation] = useState([0, 0, 0]);

  useFrame((state) => {
    // Gentle rotation animation
    groupRef.current.rotation.y += 0.005;
  });

  // Define colors for each face
  const colors = {
    front: "#ff0000", // Red
    back: "#ff8c00", // Orange
    top: "#ffffff", // White
    bottom: "#ffff00", // Yellow
    left: "#00ff00", // Green
    right: "#0000ff", // Blue
  };

  // Generate cube pieces positions
  const generateCubePieces = () => {
    const pieces = [];
    const positions = [];

    // Generate all positions for a 3x3x3 cube
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          positions.push([x, y, z]);
        }
      }
    }

    // Create pieces with appropriate colors
    positions.forEach(([x, y, z]) => {
      const pieceColors = [];

      // Determine which faces are visible for this piece
      if (x === 1) pieceColors.push(colors.right);
      if (x === -1) pieceColors.push(colors.left);
      if (y === 1) pieceColors.push(colors.top);
      if (y === -1) pieceColors.push(colors.bottom);
      if (z === 1) pieceColors.push(colors.front);
      if (z === -1) pieceColors.push(colors.back);

      pieces.push({
        position: [x, y, z],
        colors: pieceColors,
      });
    });

    return pieces;
  };

  const cubePieces = generateCubePieces();

  return (
    <group ref={groupRef}>
      {cubePieces.map((piece, index) => (
        <CubePiece
          key={index}
          position={piece.position}
          color={piece.colors[0] || "#333"}
        />
      ))}
    </group>
  );
}

// Main component that renders the 3D scene
export default function RubiksCubeScene() {
  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 75 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <RubiksCube />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}
