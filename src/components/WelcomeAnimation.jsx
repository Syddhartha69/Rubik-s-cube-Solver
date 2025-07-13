import React, { useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

function SpinningCube() {
  const meshRef = React.useRef();

  useFrame((state) => {
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <Box ref={meshRef} args={[2, 2, 2]}>
      <meshStandardMaterial color="#4f46e5" wireframe />
    </Box>
  );
}

export default function WelcomeAnimation({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const steps = [
      { text: "Welcome to", delay: 1000 },
      { text: "Rubik's Cube Solver", delay: 1500 },
      { text: "Let's solve together!", delay: 2000 },
    ];

    const stepTimer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }, steps[currentStep]?.delay || 1000);

    return () => clearTimeout(stepTimer);
  }, [currentStep, onComplete]);

  const steps = ["Welcome to", "Rubik's Cube Solver", "Let's solve together!"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center z-50"
    >
      <div className="text-center">
        {/* 3D Cube */}
        <div className="w-64 h-64 mb-8">
          <Canvas camera={{ position: [3, 3, 3], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <SpinningCube />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>

        {/* Text Animation */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            {steps[currentStep]}
          </motion.h1>
        </AnimatePresence>

        {/* Loading Dots */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white text-lg"
        >
          Loading...
        </motion.div>
      </div>
    </motion.div>
  );
}
