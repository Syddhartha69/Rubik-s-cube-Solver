import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const FACES = {
  FRONT: "front",
  BACK: "back",
  TOP: "top",
  BOTTOM: "bottom",
  LEFT: "left",
  RIGHT: "right",
};

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

export default function CubeInput({ onCubeStateChange, onSolve }) {
  const [cubeState, setCubeState] = useState(() => {
    const initialState = {};
    Object.values(FACES).forEach((face) => {
      initialState[face] = Array(9).fill(COLORS.WHITE);
    });
    return initialState;
  });

  const [selectedFace, setSelectedFace] = useState(FACES.FRONT);
  const [selectedPosition, setSelectedPosition] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleColorSelect = (color) => {
    const newCubeState = { ...cubeState };
    newCubeState[selectedFace][selectedPosition] = color;
    setCubeState(newCubeState);
    onCubeStateChange(newCubeState);
  };

  const handleSolve = () => {
    onSolve(cubeState);
  };

  const renderFaceGrid = (face) => {
    return (
      <div className="grid grid-cols-3 gap-1 w-32 h-32">
        {cubeState[face].map((color, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedFace(face);
              setSelectedPosition(index);
            }}
            className={`
              w-10 h-10 border-2 rounded-sm transition-all
              ${
                selectedFace === face && selectedPosition === index
                  ? "border-yellow-400 border-4"
                  : "border-gray-300"
              }
            `}
            style={{ backgroundColor: color }}
            title={`${COLOR_NAMES[color]} - Click to select`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Enter Your Cube State
        </h2>
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {showInstructions ? <FaEyeSlash /> : <FaEye />}
          {showInstructions ? "Hide" : "Show"} Instructions
        </button>
      </div>

      {showInstructions && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Click on any square to select it (highlighted in yellow)</li>
            <li>• Choose a color from the palette below</li>
            <li>• Repeat for all faces until your cube state is complete</li>
            <li>• Click "Solve Cube" to get step-by-step instructions</li>
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {Object.entries(FACES).map(([key, face]) => (
          <div key={face} className="text-center">
            <h3 className="font-semibold text-gray-700 mb-2 capitalize">
              {face} Face
            </h3>
            {renderFaceGrid(face)}
          </div>
        ))}
      </div>

      {/* Color Palette */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Color Palette</h3>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(COLORS).map(([name, color]) => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              className="flex items-center gap-2 px-3 py-2 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              style={{ backgroundColor: color }}
            >
              <div
                className="w-4 h-4 rounded border border-gray-400"
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-sm font-medium text-gray-800">
                {COLOR_NAMES[color]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Position Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-700">
          <span className="font-semibold">Selected:</span> {selectedFace} face,
          position {selectedPosition + 1}
          <span className="ml-2">
            (Color: {COLOR_NAMES[cubeState[selectedFace][selectedPosition]]})
          </span>
        </p>
      </div>

      {/* Solve Button */}
      <div className="text-center">
        <button
          onClick={handleSolve}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
        >
          🧩 Solve Cube
        </button>
      </div>
    </div>
  );
}
