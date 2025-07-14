import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { motion as motion3d } from "framer-motion-3d";
import * as THREE from "three";
import { COLORS, FACES } from "../utils/cubeState";
import SolvingGuide from "./SolvingGuide";

function getPieceColors(position, cubeState) {
  const colors = {};
  const [x, y, z] = position;

  // Map 3D position to 2D face indices.
  // This requires a defined mapping based on how the 2D arrays are structured.
  // Assuming a standard layout:
  // 0 1 2
  // 3 4 5
  // 6 7 8

  // Front face (z=1), Back face (z=-1)
  if (z > 0.5) colors.front = cubeState[FACES.FRONT][y * -3 + x + 4];
  if (z < -0.5) colors.back = cubeState[FACES.BACK][y * -3 - x + 4];

  // Top face (y=1), Bottom face (y=-1)
  if (y > 0.5) colors.top = cubeState[FACES.TOP][z * 3 + x + 4];
  if (y < -0.5) colors.bottom = cubeState[FACES.BOTTOM][z * -3 + x + 4];

  // Right face (x=1), Left face (x=-1)
  if (x > 0.5) colors.right = cubeState[FACES.RIGHT][y * -3 - z + 4];
  if (x < -0.5) colors.left = cubeState[FACES.LEFT][y * -3 + z + 4];

  return colors;
}

function AnimatedCubePiece({ position, quaternion, colors, size = 0.95 }) {
  const pieceColors = colors;
  const black = "#222222";

  const materials = [
    new THREE.MeshStandardMaterial({
      color: pieceColors.right || black,
      roughness: 0.3,
      metalness: 0.2,
    }),
    new THREE.MeshStandardMaterial({
      color: pieceColors.left || black,
      roughness: 0.3,
      metalness: 0.2,
    }),
    new THREE.MeshStandardMaterial({
      color: pieceColors.top || black,
      roughness: 0.3,
      metalness: 0.2,
    }),
    new THREE.MeshStandardMaterial({
      color: pieceColors.bottom || black,
      roughness: 0.3,
      metalness: 0.2,
    }),
    new THREE.MeshStandardMaterial({
      color: pieceColors.front || black,
      roughness: 0.3,
      metalness: 0.2,
    }),
    new THREE.MeshStandardMaterial({
      color: pieceColors.back || black,
      roughness: 0.3,
      metalness: 0.2,
    }),
  ];

  return (
    <Box
      args={[size, size, size]}
      position={position}
      quaternion={quaternion}
      material={materials}
    />
  );
}

function AnimatedRubiksCube({ pieces, move, progress }) {
  if (!move) {
    return (
      <group>
        {pieces.map((p) => (
          <AnimatedCubePiece key={p.id} {...p} />
        ))}
      </group>
    );
  }

  const moveType = move.replace(/['2]/g, "");
  const isPrime = move.includes("'");
  const isDouble = move.includes("2");

  let angle = (Math.PI / 2) * progress;
  if (isDouble) angle *= 2;
  if (isPrime) angle *= -1;

  let axis, shouldMove;
  switch (moveType) {
    case "R":
      axis = [1, 0, 0];
      shouldMove = (p) => p.position.x > 0.5;
      break;
    case "L":
      axis = [1, 0, 0];
      angle *= -1;
      shouldMove = (p) => p.position.x < -0.5;
      break;
    case "U":
      axis = [0, 1, 0];
      shouldMove = (p) => p.position.y > 0.5;
      break;
    case "D":
      axis = [0, 1, 0];
      angle *= -1;
      shouldMove = (p) => p.position.y < -0.5;
      break;
    case "F":
      axis = [0, 0, 1];
      shouldMove = (p) => p.position.z > 0.5;
      break;
    case "B":
      axis = [0, 0, 1];
      angle *= -1;
      shouldMove = (p) => p.position.z < -0.5;
      break;
    default:
      axis = [1, 0, 0];
      angle = 0;
      shouldMove = () => false;
      break;
  }

  const movingPieces = pieces.filter(shouldMove);
  const staticPieces = pieces.filter((p) => !shouldMove(p));

  const rotation = new THREE.Euler().setFromVector3(
    new THREE.Vector3(...axis).multiplyScalar(angle)
  );

  return (
    <group>
      {staticPieces.map((p) => (
        <AnimatedCubePiece key={p.id} {...p} />
      ))}
      <motion3d.group
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
          rotateZ: rotation.z,
        }}
      >
        {movingPieces.map((p) => (
          <AnimatedCubePiece key={p.id} {...p} />
        ))}
      </motion3d.group>
    </group>
  );
}

const applyMoveToPieces = (pieces, move) => {
  if (!move) return pieces;
  const moveType = move.replace(/['2]/g, "");
  const isPrime = move.includes("'");
  const isDouble = move.includes("2");

  let angle = Math.PI / 2;
  if (isDouble) angle *= 2;
  if (isPrime) angle *= -1;

  let axis;
  let shouldMove;

  switch (moveType) {
    case "R":
      axis = new THREE.Vector3(1, 0, 0);
      shouldMove = (p) => p.position.x > 0.5;
      break;
    case "L":
      axis = new THREE.Vector3(1, 0, 0);
      angle *= -1;
      shouldMove = (p) => p.position.x < -0.5;
      break;
    case "U":
      axis = new THREE.Vector3(0, 1, 0);
      shouldMove = (p) => p.position.y > 0.5;
      break;
    case "D":
      axis = new THREE.Vector3(0, 1, 0);
      angle *= -1;
      shouldMove = (p) => p.position.y < -0.5;
      break;
    case "F":
      axis = new THREE.Vector3(0, 0, 1);
      shouldMove = (p) => p.position.z > 0.5;
      break;
    case "B":
      axis = new THREE.Vector3(0, 0, 1);
      angle *= -1;
      shouldMove = (p) => p.position.z < -0.5;
      break;
    default:
      return pieces;
  }

  const rotation = new THREE.Quaternion().setFromAxisAngle(axis, angle);

  return pieces.map((p) => {
    if (shouldMove(p)) {
      const newPosition = p.position.clone().applyQuaternion(rotation).round();
      const newQuaternion = new THREE.Quaternion().multiplyQuaternions(
        rotation,
        p.quaternion
      );
      return { ...p, position: newPosition, quaternion: newQuaternion };
    }
    return p;
  });
};

const invertMove = (move) => {
  if (move.endsWith("'")) return move.slice(0, -1);
  if (move.endsWith("2")) return move;
  return `${move}'`;
};

const initializeCubePieces = (initialCubeState) => {
  const pieces = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        const initialPosition = [x, y, z];
        pieces.push({
          id: `${x},${y},${z}`,
          position: new THREE.Vector3(x, y, z),
          quaternion: new THREE.Quaternion(),
          initialPosition,
          colors: getPieceColors(initialPosition, initialCubeState),
        });
      }
    }
  }
  return pieces;
};

export default function AnimatedSolver({
  solution,
  onComplete,
  initialCubeState,
}) {
  const [allMoves, setAllMoves] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [animationConfig, setAnimationConfig] = useState({
    move: null,
    basePieces: null,
  });

  useEffect(() => {
    const initialPieces = initializeCubePieces(initialCubeState);

    const movesWithContext =
      solution?.steps?.flatMap((step, stepIndex) =>
        step.moves.map((move, moveInStepIndex) => ({
          move,
          stepIndex,
          moveInStepIndex,
          description: step.description,
        }))
      ) || [];
    setAllMoves(movesWithContext);

    const history = [initialPieces];
    let currentPieces = initialPieces;
    for (const move of movesWithContext) {
      currentPieces = applyMoveToPieces(currentPieces, move.move);
      history.push(currentPieces);
    }
    setMoveHistory(history);

    setAnimationConfig({ move: null, basePieces: initialPieces });
    setCurrentMoveIndex(0);
  }, [solution, initialCubeState]);

  const handleNextMove = () => {
    if (isAnimating || currentMoveIndex >= allMoves.length) return;
    const move = allMoves[currentMoveIndex].move;
    setIsAnimating(true);

    const basePieces = moveHistory[currentMoveIndex];
    setAnimationConfig({ move, basePieces });

    setTimeout(() => {
      setAnimationConfig({
        move: null,
        basePieces: moveHistory[currentMoveIndex + 1],
      });
      setCurrentMoveIndex((prev) => prev + 1);
      if (currentMoveIndex + 1 === allMoves.length) {
        setIsSolved(true);
      }
      setIsAnimating(false);
    }, 400);
  };

  const handlePreviousMove = () => {
    if (isAnimating || currentMoveIndex === 0) return;
    const inverseMove = invertMove(allMoves[currentMoveIndex - 1].move);
    setIsAnimating(true);
    setIsSolved(false);

    const basePieces = moveHistory[currentMoveIndex - 1];
    setAnimationConfig({ move: inverseMove, basePieces });

    setTimeout(() => {
      setAnimationConfig({
        move: null,
        basePieces: moveHistory[currentMoveIndex - 1],
      });
      setCurrentMoveIndex((prev) => prev - 1);
      setIsAnimating(false);
    }, 400);
  };

  const { basePieces, move } = animationConfig;

  if (!basePieces) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center text-white">
        Loading Solution...
      </div>
    );
  }

  const solutionData = solution || { steps: [] };
  const currentMoveData = allMoves[currentMoveIndex - 1];
  const currentStepIndex = currentMoveData ? currentMoveData.stepIndex : 0;
  const currentStepData = solutionData.steps[currentStepIndex];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-black/30 backdrop-blur-lg border-b border-white/10 text-white p-4 z-10"
      >
        <div className="flex items-center justify-between max-w-[2000px] mx-auto">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Solving Steps
            </h2>
            <p className="text-gray-300 mt-1">
              Watch the solution unfold step by step
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onComplete?.()}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <span className="text-2xl font-bold">×</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - 3D Cube */}
        <div className="flex-1 relative">
          <Canvas camera={{ position: [5, 5, 5], fov: 35 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 5]} intensity={2} />
            <AnimatePresence>
              <AnimatedRubiksCube
                pieces={basePieces}
                move={move}
                progress={isAnimating ? 1 : 0}
              />
            </AnimatePresence>
            <OrbitControls enablePan={false} autoRotate={false} />
          </Canvas>
        </div>

        {/* Right Panel - Steps & Controls */}
        <div className="w-[400px] bg-black/20 backdrop-blur-lg border-l border-white/10 p-6 flex flex-col">
          {currentStepData && (
            <div className="mb-6">
              <p className="text-sm text-purple-300">
                Step {currentStepIndex + 1} / {solutionData.steps.length}
              </p>
              <h3 className="text-xl font-bold text-white mt-1">
                {currentStepData.description}
              </h3>
            </div>
          )}

          <div className="flex-1 bg-black/20 rounded-lg p-4 overflow-y-auto">
            {currentStepData?.moves.map((move, index) => {
              const isMoveActive =
                currentMoveData?.stepIndex === currentStepIndex &&
                currentMoveData?.moveInStepIndex === index;
              return (
                <motion.div
                  key={index}
                  animate={{
                    backgroundColor: isMoveActive
                      ? "rgba(168, 85, 247, 0.3)"
                      : "rgba(0,0,0,0)",
                  }}
                  className="text-white font-mono text-lg p-2 rounded-md"
                >
                  {move}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6">
            <div className="text-center text-white mb-4">
              <p>
                Move {currentMoveIndex} / {allMoves.length}
              </p>
              <div className="w-full bg-white/10 rounded-full h-2.5 mt-2">
                <motion.div
                  className="bg-purple-500 h-2.5 rounded-full"
                  animate={{
                    width: `${(currentMoveIndex / allMoves.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <motion.button
                onClick={handlePreviousMove}
                disabled={currentMoveIndex === 0}
                className="w-full py-3 text-lg font-semibold text-white bg-white/10 rounded-lg disabled:opacity-50"
                whileHover={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                Previous
              </motion.button>
              {isSolved ? (
                <motion.button
                  onClick={onComplete}
                  className="w-full py-3 text-lg font-semibold text-white bg-green-600 rounded-lg"
                  whileHover={{ backgroundColor: "#16a34a" }}
                >
                  Done
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleNextMove}
                  disabled={currentMoveIndex === allMoves.length}
                  className="w-full py-3 text-lg font-semibold text-white bg-purple-600 rounded-lg disabled:opacity-50"
                  whileHover={{ backgroundColor: "#a855f7" }}
                >
                  Next
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
