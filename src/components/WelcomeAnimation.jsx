"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { motion as motion3d } from "framer-motion-3d";
import * as THREE from "three";

const EnergyRings = () => {
  const rings = useMemo(
    () => [
      { radius: 6, speed: 0.3, axis: "z", color: "#ff0844", opacity: 0.4 },
      { radius: 8, speed: -0.2, axis: "x", color: "#00ff88", opacity: 0.3 },
      { radius: 10, speed: 0.15, axis: "y", color: "#0099ff", opacity: 0.25 },
      { radius: 12, speed: -0.25, axis: "z", color: "#ff00ff", opacity: 0.2 },
    ],
    []
  );

  return (
    <motion3d.group
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
    >
      {rings.map((ring, i) => (
        <Ring key={i} {...ring} />
      ))}
    </motion3d.group>
  );
};

const Ring = ({ radius, speed, axis, color, opacity }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation[axis] = state.clock.elapsedTime * speed;
    }
  });

  const variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: opacity,
      transition: { duration: 1.5, ease: "elasticOut" },
    },
  };

  return (
    <motion3d.mesh
      ref={ref}
      rotation-x={axis === "y" ? Math.PI / 2 : 0}
      rotation-y={axis === "x" ? Math.PI / 2 : 0}
      variants={variants}
    >
      <torusGeometry args={[radius, 0.05, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </motion3d.mesh>
  );
};

const FloatingShape = ({ position, rotation, scale, color, speed }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x += speed * 0.01;
      ref.current.rotation.y += speed * 0.015;
      ref.current.position.y +=
        Math.sin(state.clock.elapsedTime * speed) * 0.01;
    }
  });

  const variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: scale,
      opacity: 1,
      transition: { duration: 1, ease: "backOut" },
    },
  };

  return (
    <motion3d.mesh
      ref={ref}
      position={position}
      initialRotation={rotation}
      variants={variants}
    >
      <torusKnotGeometry args={[1, 0.4, 128, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        roughness={0.1}
        metalness={0.4}
      />
    </motion3d.mesh>
  );
};

const FloatingShapes = () => {
  const shapes = useMemo(() => {
    const shapeData = [];
    for (let i = 0; i < 15; i++) {
      shapeData.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: Math.random() * 0.3 + 0.1,
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
        speed: Math.random() * 0.1 + 0.05,
      });
    }
    return shapeData;
  }, []);

  return (
    <motion3d.group
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {shapes.map((shape) => (
        <FloatingShape key={shape.id} {...shape} />
      ))}
    </motion3d.group>
  );
};

const AnimatingCubie = ({ position, color, randomSeed }) => {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime;
      // Add individual rotation to each cubie
      ref.current.rotation.x = time * (0.2 + randomSeed * 0.5);
      ref.current.rotation.y = time * (0.3 + randomSeed * 0.4);

      // Add a pulsating/breathing effect to the position
      const pulse = Math.sin(time * 0.8 + randomSeed * Math.PI) * 0.05;
      ref.current.position.set(
        position[0] * (1 + pulse),
        position[1] * (1 + pulse),
        position[2] * (1 + pulse)
      );
    }
  });

  const variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "backOut" },
    },
  };

  return (
    <motion3d.mesh ref={ref} variants={variants}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.1}
        roughness={0.2}
      />
    </motion3d.mesh>
  );
};

const AnimatedCube = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Keep the overall group rotation
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  const cubies = useMemo(() => {
    const data = [];
    const colors = [
      "#ff0844",
      "#00ff88",
      "#0099ff",
      "#ff6600",
      "#ffff00",
      "#ff00ff",
    ];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          data.push({
            id: `${x}-${y}-${z}`,
            position: [x, y, z],
            color: colors[Math.floor(Math.random() * colors.length)],
            randomSeed: Math.random(),
          });
        }
      }
    }
    return data;
  }, []);

  return (
    <motion3d.group
      ref={groupRef}
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
    >
      {cubies.map((cubie) => (
        <AnimatingCubie key={cubie.id} {...cubie} />
      ))}
    </motion3d.group>
  );
};

export default function WelcomeAnimation({ onComplete }) {
  const [currentText, setCurrentText] = useState("Rendering your 3D model...");

  useEffect(() => {
    const t1 = setTimeout(
      () => setCurrentText("Brainstorming cube logic..."),
      1500
    );
    const t2 = setTimeout(() => setCurrentText("Ready to solve!"), 3000);
    const t3 = setTimeout(() => onComplete(), 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.3,
      },
    },
    exit: { opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900 flex flex-col items-center justify-center z-50 overflow-hidden"
    >
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="absolute inset-0 w-full h-full">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Environment preset="night" />
          <AnimatedCube />
          <FloatingShapes />
          <EnergyRings />
        </Canvas>
      </div>

      <motion.div className="text-center z-10" variants={containerVariants}>
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
          variants={itemVariants}
        >
          Rubik's Cube Solver
        </motion.h1>
        <AnimatePresence mode="wait">
          <motion.p
            key={currentText}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-xl md:text-2xl text-white/90 font-light"
          >
            {currentText}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-white/10 rounded-tl-lg" />
      <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-white/10 rounded-tr-lg" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-white/10 rounded-bl-lg" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-white/10 rounded-br-lg" />
    </motion.div>
  );
}
