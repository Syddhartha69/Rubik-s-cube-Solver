import React, { useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

function SpinningCube() {
  const meshRef = React.useRef();

  useFrame((state) => {
    meshRef.current.rotation.x += 0.008;
    meshRef.current.rotation.y += 0.008;
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
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const steps = [
      { text: "Welcome to", delay: 1200 },
      { text: "Rubik's Cube Solver", delay: 1800 },
      { text: "Let's solve together!", delay: 1500 },
    ];

    const stepTimer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
    }, steps[currentStep]?.delay || 1200);

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
        <motion.div
          className="w-64 h-64 mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <Canvas camera={{ position: [3, 3, 3], fov: 75 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.2} />
            <SpinningCube />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
            />
          </Canvas>
        </motion.div>

        {/* Text Animation */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentStep}
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
          >
            {steps[currentStep]}
          </motion.h1>
        </AnimatePresence>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center items-center gap-2"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-3 h-3 bg-white rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.2,
              ease: "easeInOut",
            }}
            className="w-3 h-3 bg-white rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.4,
              ease: "easeInOut",
            }}
            className="w-3 h-3 bg-white rounded-full"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
