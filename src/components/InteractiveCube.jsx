import React, { useState, useRef, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

const COLORS = {
  RED: "#ff0000",
  ORANGE: "#ff8c00",
  WHITE: "#ffffff",
  YELLOW: "#ffff00",
  GREEN: "#00ff00",
  BLUE: "#0000ff",
};

const COLOR_NAMES = {
  [COLORS.RED]: "Red",
  [COLORS.ORANGE]: "Orange",
  [COLORS.WHITE]: "White",
  [COLORS.YELLOW]: "Yellow",
  [COLORS.GREEN]: "Green",
  [COLORS.BLUE]: "Blue",
};

// Individual cube piece component
function CubePiece({
  position,
  color,
  size = 0.9,
  onClick,
  isSelected,
  pieceId,
}) {
  const meshRef = useRef();

  const handleClick = (event) => {
    event.stopPropagation();
    onClick(pieceId);
  };

  return (
    <Box
      ref={meshRef}
      args={[size, size, size]}
      position={position}
      onClick={handleClick}
    >
      <meshStandardMaterial
        color={color || "#333"}
        transparent
        opacity={isSelected ? 0.8 : 1}
      />
    </Box>
  );
}

// Floating color palette component
function ColorPalette({ position, onColorSelect, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute z-50 bg-white rounded-lg shadow-xl p-4 border border-gray-200"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="text-center mb-3">
        <h3 className="font-semibold text-gray-800">Choose Color</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(COLORS).map(([name, color]) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all hover:scale-110 shadow-md"
            style={{ backgroundColor: color }}
            title={COLOR_NAMES[color]}
          />
        ))}
      </div>
      <button
        onClick={onClose}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-colors"
      >
        ×
      </button>
    </motion.div>
  );
}

// Main 3D cube component
function RubiksCube3D({ pieceColors, onPieceClick, selectedPiece }) {
  const groupRef = useRef();

  // Generate cube pieces
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

    // Create pieces with colors from state
    positions.forEach(([x, y, z], index) => {
      pieces.push({
        id: index,
        position: [x, y, z],
        color: pieceColors[index] || "#333", // Default gray if no color set
      });
    });

    return pieces;
  };

  const cubePieces = generateCubePieces();

  return (
    <group ref={groupRef}>
      {cubePieces.map((piece) => (
        <CubePiece
          key={piece.id}
          pieceId={piece.id}
          position={piece.position}
          color={piece.color}
          onClick={onPieceClick}
          isSelected={selectedPiece === piece.id}
        />
      ))}
    </group>
  );
}

export default function InteractiveCube({
  cubeState,
  onCubeStateChange,
  onSolve,
  isSolving,
}) {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [palettePosition, setPalettePosition] = useState({ x: 0, y: 0 });
  const [showPalette, setShowPalette] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [pieceColors, setPieceColors] = useState({}); // Store colors for each piece

  const handlePieceClick = useCallback((pieceId) => {
    setSelectedPiece(pieceId);

    // Calculate palette position based on mouse position
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      setPalettePosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }

    setShowPalette(true);
  }, []);

  const handleColorSelect = useCallback(
    (color) => {
      if (selectedPiece !== null) {
        // Update piece colors
        const newPieceColors = { ...pieceColors };
        newPieceColors[selectedPiece] = color;
        setPieceColors(newPieceColors);

        // Check if all pieces are colored (27 pieces total)
        const coloredCount = Object.keys(newPieceColors).length;
        if (coloredCount >= 27) {
          setIsComplete(true);
        }

        // Update cube state
        const newCubeState = { ...cubeState };
        onCubeStateChange(newCubeState);
      }

      setShowPalette(false);
      setSelectedPiece(null);
    },
    [selectedPiece, pieceColors, cubeState, onCubeStateChange]
  );

  const handlePaletteClose = useCallback(() => {
    setShowPalette(false);
    setSelectedPiece(null);
  }, []);

  const coloredCount = Object.keys(pieceColors).length;

  return (
    <div className="relative w-full h-full">
      {/* 3D Cube Canvas */}
      <div className="w-full h-96 md:h-[500px] bg-gray-50 rounded-lg border-2 border-gray-200">
        <Canvas
          camera={{ position: [5, 5, 5], fov: 75 }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />
          <RubiksCube3D
            pieceColors={pieceColors}
            onPieceClick={handlePieceClick}
            selectedPiece={selectedPiece}
          />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            autoRotateSpeed={0}
          />
        </Canvas>
      </div>

      {/* Floating Color Palette */}
      <AnimatePresence>
        {showPalette && (
          <ColorPalette
            position={palettePosition}
            onColorSelect={handleColorSelect}
            onClose={handlePaletteClose}
          />
        )}
      </AnimatePresence>

      {/* Instructions and Progress */}
      <div className="mt-6 text-center">
        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            Click on any square to select a color, then choose from the palette
          </p>
          <div className="flex justify-center items-center gap-2">
            <span className="text-sm text-gray-500">Progress:</span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(coloredCount / 27) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-500">{coloredCount}/27</span>
          </div>
        </div>

        {/* Solve Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSolve}
          disabled={!isComplete || isSolving}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg shadow-lg"
        >
          {isSolving ? "Solving..." : "🧩 Solve Cube"}
        </motion.button>
      </div>
    </div>
  );
}
