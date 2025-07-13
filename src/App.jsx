import React, { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import WelcomeAnimation from "./components/WelcomeAnimation";
import InteractiveCube from "./components/InteractiveCube";
import AnimatedSolver from "./components/AnimatedSolver";
import { createSolvedCube, generateSolution } from "./utils/cubeState";
import "./App.css";

function App() {
  const [appState, setAppState] = useState("welcome"); // 'welcome', 'input', 'solving'
  const [cubeState, setCubeState] = useState(createSolvedCube());
  const [currentSolution, setCurrentSolution] = useState(null);
  const [isSolving, setIsSolving] = useState(false);

  const handleWelcomeComplete = useCallback(() => {
    setAppState("input");
  }, []);

  const handleCubeStateChange = useCallback((newCubeState) => {
    setCubeState(newCubeState);
  }, []);

  const handleSolve = useCallback((cubeState) => {
    setIsSolving(true);
    setAppState("solving");

    // Generate solution based on the current cube state
    const solution = generateSolution(cubeState);
    setCurrentSolution(solution);
  }, []);

  const handleSolvingComplete = useCallback(() => {
    setIsSolving(false);
    setAppState("input");
  }, []);

  const handleReset = useCallback(() => {
    setCubeState(createSolvedCube());
    setCurrentSolution(null);
    setIsSolving(false);
    setAppState("input");
  }, []);

  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AnimatePresence mode="wait">
        {/* Welcome Animation */}
        {appState === "welcome" && (
          <WelcomeAnimation key="welcome" onComplete={handleWelcomeComplete} />
        )}

        {/* Main App Interface */}
        {appState === "input" && (
          <div key="main">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-4xl mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold text-gray-800 text-center">
                  🧩 Rubik's Cube Solver
                </h1>
                <p className="text-center text-gray-600 mt-2">
                  Click on the cube squares to set colors, then watch it solve!
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
              <InteractiveCube
                cubeState={cubeState}
                onCubeStateChange={handleCubeStateChange}
                onSolve={handleSolve}
                isSolving={isSolving}
              />
            </div>

            {/* Reset Button */}
            <div className="text-center mt-8">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                🔄 Start Over
              </button>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 mt-16">
              <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="text-center text-gray-600 text-sm">
                  <p>Built with React, Three.js, and modern web technologies</p>
                  <p className="mt-1">Watch the magic happen in 3D!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Animated Solving */}
        {appState === "solving" && currentSolution && (
          <AnimatedSolver
            key="solving"
            solution={currentSolution}
            onComplete={handleSolvingComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
