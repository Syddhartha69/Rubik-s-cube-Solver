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
    // Very gentle rotation for visual appeal
    groupRef.current.rotation.y += 0.002;
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
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-6 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              🧩 Solving Animation
            </h2>
            <p className="text-blue-100 mt-1 text-sm md:text-base">
              Watch the magic happen in real-time 3D
            </p>
          </div>
          <button
            onClick={() => onComplete?.()}
            className="w-8 h-8 md:w-10 md:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <span className="text-lg md:text-xl font-bold">×</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-16 md:top-20 left-0 right-0 bg-gray-50/90 backdrop-blur-sm border-b border-gray-200 p-3 md:p-4 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <span className="text-xs md:text-sm font-semibold text-gray-700">
              Step {currentStep + 1} of {solutionData.steps.length} • Move{" "}
              {currentMove + 1} of {currentStepData?.moves.length || 0}
            </span>
            <span className="text-xs md:text-sm text-gray-500 font-medium">
              {Math.round(
                (currentStep * 100 +
                  (currentMove / (currentStepData?.moves.length || 1)) * 100) /
                  solutionData.steps.length
              )}
              % Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 md:h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${
                  (currentStep * 100 +
                    (currentMove / (currentStepData?.moves.length || 1)) *
                      100) /
                  solutionData.steps.length
                }%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-full pt-24 md:pt-28">
        {/* 3D Cube Animation */}
        <div className="flex-1 p-2 md:p-4 lg:p-6">
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 overflow-hidden">
            <Canvas
              camera={{ position: [5, 5, 5], fov: 75 }}
              className="w-full h-full"
            >
              <ambientLight intensity={0.8} />
              <pointLight position={[10, 10, 10]} intensity={1.5} />
              <AnimatedRubiksCube
                cubeState={{}}
                currentMove={currentMoveData}
                moveProgress={moveProgress}
              />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                autoRotate={false}
              />
            </Canvas>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-full lg:w-80 xl:w-96 p-3 md:p-4 lg:p-6 bg-gray-50/95 backdrop-blur-sm border-l border-gray-200 overflow-y-auto">
          {/* Current Step Info */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
              {currentStepData?.name.toUpperCase()}
            </h3>
            <p className="text-gray-600 mb-4 text-sm md:text-base">
              {currentStepData?.description}
            </p>

            {/* Current Move */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 md:p-4">
              <h4 className="font-semibold text-gray-700 mb-2 text-sm md:text-base">
                Current Move:
              </h4>
              <div className="text-2xl md:text-4xl font-mono font-bold text-center bg-white rounded-lg py-2 md:py-3 shadow-sm">
                {currentMoveData || "Complete!"}
              </div>
            </div>
          </div>

          {/* Move Sequence */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm mb-4 md:mb-6">
            <h4 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">
              Move Sequence:
            </h4>
            <div className="flex flex-wrap gap-1 md:gap-2">
              {currentStepData?.moves.map((move, index) => (
                <div
                  key={index}
                  className={`
                    px-2 md:px-3 py-1 md:py-2 rounded-lg font-mono text-xs md:text-sm font-bold transition-all
                    ${
                      index === currentMove
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-110"
                        : index < currentMove
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }
                  `}
                >
                  {move}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-4 text-sm md:text-base">
              Controls
            </h4>

            <div className="space-y-3">
              <button
                onClick={handlePlayPause}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 md:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold text-sm md:text-base"
              >
                {isPlaying ? "⏸️ Pause" : "▶️ Play"}
              </button>

              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 md:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-semibold text-sm md:text-base"
              >
                🔄 Reset
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs md:text-sm font-medium text-gray-600">
                  Speed:
                </span>
                <select
                  value={speed}
                  onChange={(e) => handleSpeedChange(Number(e.target.value))}
                  className="flex-1 px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs md:text-sm"
                >
                  <option value={0.5}>0.5x (Slow)</option>
                  <option value={1}>1x (Normal)</option>
                  <option value={2}>2x (Fast)</option>
                  <option value={4}>4x (Very Fast)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
