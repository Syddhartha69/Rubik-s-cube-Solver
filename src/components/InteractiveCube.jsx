import React, { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  IoColorPaletteOutline,
  IoArrowForward,
  IoArrowBack,
  IoArrowUp,
  IoArrowDown,
  IoReload,
} from "react-icons/io5";
import {
  FaCube,
  FaCheck,
  FaExclamationTriangle,
  FaRandom,
} from "react-icons/fa";
import { FACES, COLORS } from "../utils/cubeState";

const COLOR_NAMES = {
  [COLORS.front]: "Red (Front)",
  [COLORS.back]: "Orange (Back)",
  [COLORS.top]: "White (Top)",
  [COLORS.bottom]: "Yellow (Bottom)",
  [COLORS.right]: "Blue (Right)",
  [COLORS.left]: "Green (Left)",
};

const FACE_DETAILS = {
  [FACES.FRONT]: { name: "Front", icon: "🔴" },
  [FACES.BACK]: { name: "Back", icon: "🟠" },
  [FACES.TOP]: { name: "Top", icon: "⚪" },
  [FACES.BOTTOM]: { name: "Bottom", icon: "🟡" },
  [FACES.RIGHT]: { name: "Right", icon: "🔵" },
  [FACES.LEFT]: { name: "Left", icon: "🟢" },
};

// Navigation map for cube rotation
const NAVIGATION = {
  [FACES.FRONT]: {
    up: FACES.TOP,
    down: FACES.BOTTOM,
    left: FACES.LEFT,
    right: FACES.RIGHT,
  },
  [FACES.BACK]: {
    up: FACES.TOP,
    down: FACES.BOTTOM,
    left: FACES.RIGHT,
    right: FACES.LEFT,
  },
  [FACES.TOP]: {
    up: FACES.BACK,
    down: FACES.FRONT,
    left: FACES.LEFT,
    right: FACES.RIGHT,
  },
  [FACES.BOTTOM]: {
    up: FACES.FRONT,
    down: FACES.BACK,
    left: FACES.LEFT,
    right: FACES.RIGHT,
  },
  [FACES.LEFT]: {
    up: FACES.TOP,
    down: FACES.BOTTOM,
    left: FACES.BACK,
    right: FACES.FRONT,
  },
  [FACES.RIGHT]: {
    up: FACES.TOP,
    down: FACES.BOTTOM,
    left: FACES.FRONT,
    right: FACES.BACK,
  },
};

// Color Picker Component
function ColorPicker({ selectedColor, onColorSelect }) {
  return (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <IoColorPaletteOutline className="text-2xl text-purple-400" />
        <h3 className="font-semibold text-white text-lg">Select a Color</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(COLORS).map(([, color]) => (
          <motion.button
            key={color}
            onClick={() => onColorSelect(color)}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className={`w-14 h-14 rounded-full border-4 transition-all shadow-lg ${
              selectedColor === color
                ? "border-purple-400 scale-105"
                : "border-white/20"
            }`}
            style={{ backgroundColor: color }}
            title={COLOR_NAMES[color]}
          />
        ))}
      </div>
    </div>
  );
}

function CubeFace({ colors, onSquareClick }) {
  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 w-80 h-80 md:w-96 md:h-96 bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-2xl">
        {Array.from({ length: 9 }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => onSquareClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              aspect-square rounded-xl transition-all shadow-lg border-2
              ${index === 4 ? "border-white/50" : "border-white/20"}
              hover:border-white/60 hover:shadow-xl
            `}
            style={{
              backgroundColor: colors?.[index] || "#333",
            }}
            title={`${
              Object.keys(FACES).find(
                (key) => COLORS[FACES[key]] === colors?.[index]
              ) || "Click to set color"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function NavigationControls({ currentFace, onRotate }) {
  const directions = NAVIGATION[currentFace];

  return (
    <div className="relative w-64 h-64 mt-8">
      {/* Up Arrow */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onRotate("up")}
        className="absolute top-0 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-7xl border border-white/30 transition-all"
        title={`Rotate to ${FACE_DETAILS[directions.up].name}`}
      >
        <IoArrowUp />
      </motion.button>

      {/* Down Arrow */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onRotate("down")}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-7xl border border-white/30 transition-all"
        title={`Rotate to ${FACE_DETAILS[directions.down].name}`}
      >
        <IoArrowDown />
      </motion.button>

      {/* Left Arrow */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onRotate("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-7xl border border-white/30 transition-all"
        title={`Rotate to ${FACE_DETAILS[directions.left].name}`}
      >
        <IoArrowBack />
      </motion.button>

      {/* Right Arrow */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onRotate("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-7xl border border-white/30 transition-all"
        title={`Rotate to ${FACE_DETAILS[directions.right].name}`}
      >
        <IoArrowForward />
      </motion.button>

      {/* Current Face Label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-white/20">
        <div className="text-center">
          <div className="text-2xl mb-1">{FACE_DETAILS[currentFace].icon}</div>
          <div className="text-lg font-bold text-white">
            {FACE_DETAILS[currentFace].name}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressIndicator({ faceColors }) {
  const totalSquares = 54; // 6 faces * 9 squares
  const filledSquares = faceColors.filter(Boolean).length;
  const progress = totalSquares > 0 ? (filledSquares / totalSquares) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="text-white/80">Setup Progress</span>
        <span className="text-white font-semibold">
          {filledSquares} / {totalSquares}
        </span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function InteractiveCube({
  cubeState,
  onCubeStateChange,
  onSolve,
  onScramble,
  onReset,
}) {
  const [currentFace, setCurrentFace] = useState(FACES.FRONT);
  const [selectedColor, setSelectedColor] = useState(COLORS.front);
  const [isComplete, setIsComplete] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const handleSquareClick = useCallback(
    (index) => {
      if (index === 4) {
        return;
      }
      if (!selectedColor) {
        alert("Please select a color first.");
        return;
      }
      setValidationError(null);

      const newCubeState = { ...cubeState };
      if (!newCubeState[currentFace]) {
        newCubeState[currentFace] = Array(9).fill(null);
      }
      newCubeState[currentFace][index] = selectedColor;
      onCubeStateChange(newCubeState);
    },
    [currentFace, selectedColor, cubeState, onCubeStateChange]
  );

  const handleColorSelect = useCallback((color) => {
    setSelectedColor(color);
  }, []);

  const handleRotate = useCallback(
    (direction) => {
      const nextFace = NAVIGATION[currentFace][direction];
      setCurrentFace(nextFace);
    },
    [currentFace]
  );

  const validateCube = useCallback(() => {
    const colorCounts = {};
    Object.values(COLORS).forEach((color) => {
      colorCounts[color] = 0;
    });

    let totalSquares = 0;
    Object.values(cubeState).forEach((face) => {
      face.forEach((color) => {
        if (color) {
          colorCounts[color]++;
          totalSquares++;
        }
      });
    });

    const isValid =
      totalSquares === 54 &&
      Object.values(colorCounts).every((count) => count === 9);
    setIsComplete(isValid);
    return isValid;
  }, [cubeState]);

  const handleComplete = useCallback(() => {
    if (validateCube()) {
      onSolve(cubeState);
      setValidationError(null);
    } else {
      const colorCounts = {};
      Object.values(COLORS).forEach((color) => {
        colorCounts[color] = 0;
      });
      let total = 0;
      Object.values(cubeState).forEach((face) => {
        face.forEach((color) => {
          if (color) {
            colorCounts[color]++;
            total++;
          }
        });
      });

      if (total < 54) {
        setValidationError(`Please fill all ${54 - total} remaining squares.`);
        return;
      }

      const issues = [];
      Object.entries(colorCounts).forEach(([color, count]) => {
        if (count !== 9) {
          issues.push(`${COLOR_NAMES[color].split(" ")[0]}: ${count}/9`);
        }
      });

      setValidationError(`Invalid color counts. ${issues.join(", ")}`);
    }
  }, [validateCube, cubeState, onSolve]);

  useEffect(() => {
    validateCube();
  }, [cubeState, validateCube]);

  const filledSquares = Object.values(cubeState).flat().filter(Boolean).length;

  const handleResetClick = () => {
    setValidationError(null);
    onReset();
  };

  const handleScrambleClick = () => {
    setValidationError(null);
    onScramble();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-8">
      {/* Main layout: Cube/Nav on left, Picker on right */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12 w-full">
        {/* Left side: Cube Face and Navigation */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-[300px] h-[300px] md:w-[360px] md:h-[360px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFace}
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.4 }}
                className="absolute"
              >
                <CubeFace
                  colors={cubeState[currentFace]}
                  onSquareClick={handleSquareClick}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <NavigationControls
            currentFace={currentFace}
            onRotate={handleRotate}
          />
        </div>
        {/* Right side: Color Picker and Actions */}
        <div className="flex flex-col gap-6 w-full lg:w-auto">
          <ProgressIndicator faceColors={Object.values(cubeState).flat()} />
          <ColorPicker
            selectedColor={selectedColor}
            onColorSelect={handleColorSelect}
          />
          <div className="flex flex-col gap-4">
            <motion.button
              onClick={handleComplete}
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCheck />
              Solve Cube
            </motion.button>
            <AnimatePresence>
              {validationError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 text-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaExclamationTriangle />
                    <span>{validationError}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <motion.button
                onClick={handleScrambleClick}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors duration-300 font-semibold border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Scramble Cube"
              >
                <FaRandom />
                Random Scramble
              </motion.button>
              <motion.button
                onClick={handleResetClick}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors duration-300 font-semibold border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Start Fresh"
              >
                <IoReload strokeWidth={70} />
                Start Fresh
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
