import React from "react";
import {
  FaPlay,
  FaPause,
  FaUndo,
  FaRedo,
  FaRandom,
  FaMagic,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

export default function ControlPanel({
  onSolve,
  onScramble,
  onReset,
  onRotateLeft,
  onRotateRight,
  isSolving = false,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {/* Main Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSolve}
              disabled={isSolving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaMagic className="w-4 h-4" />
              {isSolving ? "Solving..." : "Solve Cube"}
            </button>

            <button
              onClick={onScramble}
              disabled={isSolving}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaRandom className="w-4 h-4" />
              Scramble
            </button>
          </div>

          {/* Rotation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRotateLeft}
              disabled={isSolving}
              className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              Rotate Left
            </button>

            <button
              onClick={onRotateRight}
              disabled={isSolving}
              className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaArrowRight className="w-4 h-4" />
              Rotate Right
            </button>
          </div>

          {/* Reset Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              disabled={isSolving}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaUndo className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-3 text-center text-sm text-gray-600">
          <p>
            Use mouse to rotate the cube • Scroll to zoom • Right-click to pan
          </p>
        </div>
      </div>
    </div>
  );
}
