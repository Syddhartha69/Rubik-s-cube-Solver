import React, { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaPause,
  FaRedo,
} from "react-icons/fa";

const MOVE_DESCRIPTIONS = {
  R: "Right face clockwise",
  "R'": "Right face counter-clockwise",
  R2: "Right face 180 degrees",
  L: "Left face clockwise",
  "L'": "Left face counter-clockwise",
  L2: "Left face 180 degrees",
  U: "Up face clockwise",
  "U'": "Up face counter-clockwise",
  U2: "Up face 180 degrees",
  D: "Down face clockwise",
  "D'": "Down face counter-clockwise",
  D2: "Down face 180 degrees",
  F: "Front face clockwise",
  "F'": "Front face counter-clockwise",
  F2: "Front face 180 degrees",
  B: "Back face clockwise",
  "B'": "Back face counter-clockwise",
  B2: "Back face 180 degrees",
};

const STEP_DESCRIPTIONS = {
  cross: "Create a white cross on the top face",
  corners: "Solve the white corners",
  middle: "Solve the middle layer edges",
  oll: "Orient the last layer (OLL)",
  pll: "Permute the last layer (PLL)",
};

export default function SolvingGuide({ solution, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(2000); // 2 seconds

  // Generate a sample solution if none provided
  const defaultSolution = {
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
      {
        name: "middle",
        description: "Solve the middle layer edges",
        moves: ["U", "R", "U'", "R'", "U'", "F'", "U", "F"],
      },
      {
        name: "oll",
        description: "Orient the last layer (OLL)",
        moves: ["F", "R", "U", "R'", "U'", "F'"],
      },
      {
        name: "pll",
        description: "Permute the last layer (PLL)",
        moves: ["R", "U", "R'", "U'", "R", "U", "R'", "U'"],
      },
    ],
  };

  const solutionData = solution || defaultSolution;
  const currentStepData = solutionData.steps[currentStep];
  const currentMoveIndex = 0; // This would be managed by auto-play

  const handleNextStep = () => {
    if (currentStep < solutionData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Step-by-Step Solution
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {solutionData.steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(
                ((currentStep + 1) / solutionData.steps.length) * 100
              )}
              % Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentStep + 1) / solutionData.steps.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Current Step */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Step {currentStep + 1}: {currentStepData.name.toUpperCase()}
            </h3>
            <p className="text-gray-600 mb-4">{currentStepData.description}</p>

            {/* Visual representation of the step */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-2 w-24 h-24 mx-auto">
                {Array(9)
                  .fill(null)
                  .map((_, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 border border-gray-300 rounded-sm ${
                        index === 4 ? "bg-blue-200" : "bg-gray-200"
                      }`}
                    ></div>
                  ))}
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                Focus on the highlighted center piece
              </p>
            </div>
          </div>

          {/* Moves */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">
              Moves for this step:
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentStepData.moves.map((move, index) => (
                <div
                  key={index}
                  className={`
                    px-3 py-2 rounded-lg font-mono text-sm font-bold transition-all
                    ${
                      index === currentMoveIndex
                        ? "bg-blue-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  {move}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {MOVE_DESCRIPTIONS[currentStepData.moves[currentMoveIndex]] ||
                "Move description"}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Hold the cube with the white face on top</li>
              <li>• Follow the moves in order from left to right</li>
              <li>• Each move should be performed as a 90-degree turn</li>
              <li>• Prime moves (') are counter-clockwise</li>
              <li>• 2 moves are 180-degree turns</li>
            </ul>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaChevronLeft />
                Previous
              </button>

              <button
                onClick={handleAutoPlay}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
                {isPlaying ? "Pause" : "Auto-play"}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <FaRedo />
                Reset
              </button>
            </div>

            <button
              onClick={handleNextStep}
              disabled={currentStep === solutionData.steps.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
