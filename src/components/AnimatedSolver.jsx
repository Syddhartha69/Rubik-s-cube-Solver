import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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

// Animated cube piece component
function AnimatedCubePiece({
  position,
  colors,
  size = 0.9,
  rotation = [0, 0, 0],
}) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotation[0];
      meshRef.current.rotation.y = rotation[1];
      meshRef.current.rotation.z = rotation[2];
    }
  });

  return (
    <Box ref={meshRef} args={[size, size, size]} position={position}>
      <meshStandardMaterial color={colors[0] || "#333"} />
    </Box>
  );
}

// Main animated cube component
function AnimatedRubiksCube({ cubeState, currentMove, moveProgress }) {
  const groupRef = useRef();

  useFrame((state) => {
    // Gentle rotation
    groupRef.current.rotation.y += 0.003;
  });

  // Generate cube pieces with animation states
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

    // Create pieces with appropriate colors and animations
    positions.forEach(([x, y, z], index) => {
      const pieceColors = [];
      let rotation = [0, 0, 0];

      // Determine which faces are visible for this piece
      if (x === 1) pieceColors.push(COLORS.BLUE);
      if (x === -1) pieceColors.push(COLORS.GREEN);
      if (y === 1) pieceColors.push(COLORS.WHITE);
      if (y === -1) pieceColors.push(COLORS.YELLOW);
      if (z === 1) pieceColors.push(COLORS.RED);
      if (z === -1) pieceColors.push(COLORS.ORANGE);

      // Apply rotation based on current move
      if (currentMove && moveProgress > 0) {
        const moveType = currentMove.replace(/['2]/g, "");
        const isPrime = currentMove.includes("'");
        const isDouble = currentMove.includes("2");

        let angle = (Math.PI / 2) * moveProgress;
        if (isPrime) angle = -angle;
        if (isDouble) angle *= 2;

        switch (moveType) {
          case "R":
            if (x === 1) rotation = [0, angle, 0];
            break;
          case "L":
            if (x === -1) rotation = [0, -angle, 0];
            break;
          case "U":
            if (y === 1) rotation = [angle, 0, 0];
            break;
          case "D":
            if (y === -1) rotation = [-angle, 0, 0];
            break;
          case "F":
            if (z === 1) rotation = [0, 0, angle];
            break;
          case "B":
            if (z === -1) rotation = [0, 0, -angle];
            break;
        }
      }

      pieces.push({
        id: index,
        position: [x, y, z],
        colors: pieceColors,
        rotation,
      });
    });

    return pieces;
  };

  const cubePieces = generateCubePieces();

  return (
    <group ref={groupRef}>
      {cubePieces.map((piece) => (
        <AnimatedCubePiece
          key={piece.id}
          position={piece.position}
          colors={piece.colors}
          rotation={piece.rotation}
        />
      ))}
    </group>
  );
}

export default function AnimatedSolver({ solution, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentMove, setCurrentMove] = useState(0);
  const [moveProgress, setMoveProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  const solutionData = solution || {
    steps: [
      {
        name: "cross",
        description: "Create a white cross on the top face",
        moves: ["F", "R", "U", "R'", "U'", "F'"],
      },
      {
        name: "corners",
        description: "Solve the white corners",
        moves: ["R", "U", "R'", "U", "R", "U2", "R'"],
      },
    ],
  };

  const currentStepData = solutionData.steps[currentStep];
  const currentMoveData = currentStepData?.moves[currentMove];

  useEffect(() => {
    if (!isPlaying) return;

    const moveDuration = 2000 / speed; // 2 seconds per move
    const interval = setInterval(() => {
      setMoveProgress((prev) => {
        if (prev >= 1) {
          // Move completed, go to next move
          if (currentMove < currentStepData.moves.length - 1) {
            setCurrentMove(currentMove + 1);
            setMoveProgress(0);
          } else {
            // Step completed, go to next step
            if (currentStep < solutionData.steps.length - 1) {
              setCurrentStep(currentStep + 1);
              setCurrentMove(0);
              setMoveProgress(0);
            } else {
              // All steps completed
              setIsPlaying(false);
              onComplete?.();
              return 1;
            }
          }
          return 0;
        }
        return prev + 0.02; // Increment progress
      });
    }, moveDuration / 50); // Update 50 times per move

    return () => clearInterval(interval);
  }, [
    currentStep,
    currentMove,
    moveProgress,
    isPlaying,
    speed,
    currentStepData,
    solutionData,
    onComplete,
  ]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCurrentMove(0);
    setMoveProgress(0);
    setIsPlaying(true);
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Solving Animation
          </h2>
          <button
            onClick={() => onComplete?.()}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {solutionData.steps.length} - Move{" "}
              {currentMove + 1} of {currentStepData?.moves.length || 0}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(
                (currentStep * 100 +
                  (currentMove / (currentStepData?.moves.length || 1)) * 100) /
                  solutionData.steps.length
              )}
              % Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (currentStep * 100 +
                    (currentMove / (currentStepData?.moves.length || 1)) *
                      100) /
                  solutionData.steps.length
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* 3D Cube Animation */}
        <div className="p-6">
          <div className="w-full h-96 md:h-[500px] mb-6">
            <Canvas
              camera={{ position: [5, 5, 5], fov: 75 }}
              className="w-full h-full"
            >
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <AnimatedRubiksCube
                cubeState={{}}
                currentMove={currentMoveData}
                moveProgress={moveProgress}
              />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
              />
            </Canvas>
          </div>

          {/* Current Step Info */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {currentStepData?.name.toUpperCase()}
            </h3>
            <p className="text-gray-600 mb-4">{currentStepData?.description}</p>

            {/* Current Move */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                Current Move:
              </h4>
              <div className="text-3xl font-mono font-bold text-blue-600">
                {currentMoveData || "Complete!"}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayPause}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {isPlaying ? "⏸️ Pause" : "▶️ Play"}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                🔄 Reset
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Speed:</span>
              <select
                value={speed}
                onChange={(e) => handleSpeedChange(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-lg"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={4}>4x</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
