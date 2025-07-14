import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WelcomeAnimation from "./components/WelcomeAnimation";
import InteractiveCube from "./components/InteractiveCube";
import AnimatedSolver from "./components/AnimatedSolver";
import {
  createEmptyCube,
  generateSolution,
  generateScrambledCube,
} from "./utils/cubeState";
import "./App.css";
import { FaGithub } from "react-icons/fa";

function App() {
  const [appState, setAppState] = useState("welcome"); // 'welcome', 'input', 'solving'
  const [cubeState, setCubeState] = useState(createEmptyCube());
  const [currentSolution, setCurrentSolution] = useState(null);
  const [isSolving, setIsSolving] = useState(false);

  const handleWelcomeComplete = useCallback(() => {
    setAppState("input");
  }, []);

  const handleCubeStateChange = useCallback((newCubeState) => {
    setCubeState(newCubeState);
  }, []);

  const handleScramble = useCallback(() => {
    const scrambledCube = generateScrambledCube();
    setCubeState(scrambledCube);
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
    setCubeState(createEmptyCube());
    setCurrentSolution(null);
    setIsSolving(false);
    setAppState("input");
  }, []);

  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white">
      <AnimatePresence mode="wait">
        {/* Welcome Animation */}
        {appState === "welcome" && (
          <WelcomeAnimation key="welcome" onComplete={handleWelcomeComplete} />
        )}

        {/* Main App Interface */}
        {appState === "input" && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen flex flex-col"
          >
            <header className="py-6 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                  Rubik's Cube Solver
                </h1>
                <motion.a
                  href="https://github.com/your-repo" // Replace with your repo link
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="text-white/70 hover:text-white"
                >
                  <FaGithub size={24} />
                </motion.a>
              </div>
            </header>

            <main className="flex-grow">
              <div className="text-center px-4">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">
                  Solve Any Cube
                </h2>
                <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                  Use the interactive 3D cube below to input your scramble, or
                  generate a random one.
                </p>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                  <InteractiveCube
                    cubeState={cubeState}
                    onCubeStateChange={handleCubeStateChange}
                    onSolve={handleSolve}
                    onScramble={handleScramble}
                    onReset={handleReset}
                  />
                </div>
              </div>
            </main>

            <footer className="bg-black/20 border-t border-white/10 mt-auto">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-white/50 text-sm">
                <p>
                  &copy; {new Date().getFullYear()} Rubik's Cube Solver. Built
                  with love and logic.
                </p>
              </div>
            </footer>
          </motion.div>
        )}

        {/* Animated Solving */}
        {appState === "solving" && currentSolution && (
          <motion.div
            key="solving"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <AnimatedSolver
              solution={currentSolution}
              onComplete={handleSolvingComplete}
              initialCubeState={cubeState}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
