import React, { useState, useEffect, useMemo } from "react";
import { FaPalette, FaRandom, FaSync, FaCheck } from "react-icons/fa";
import styles from "./CubeInput.module.css";

const FACES = ["front", "back", "top", "bottom", "left", "right"];
const COLORS = {
  white: "#ffffff",
  yellow: "#ffff00",
  red: "#ff0000",
  orange: "#ff8c00",
  green: "#00ff00",
  blue: "#0000ff",
};
const DEFAULT_COLOR = "#333333";

const FACE_NAVIGATION = {
  front: { up: "top", down: "bottom", left: "left", right: "right" },
  back: { up: "top", down: "bottom", left: "right", right: "left" },
  top: { up: "back", down: "front", left: "left", right: "right" },
  bottom: { up: "front", down: "back", left: "left", right: "right" },
  left: { up: "top", down: "bottom", left: "back", right: "front" },
  right: { up: "top", down: "bottom", left: "front", right: "back" },
};

const initialCubeState = () => {
  const state = {};
  FACES.forEach((face) => {
    state[face] = Array(9).fill(DEFAULT_COLOR);
    // You can add logic here to pre-fill center pieces if desired
  });
  state.front[4] = COLORS.red; // Start with red center on front
  return state;
};

export default function CubeInput({ onSolve, onScramble, onReset }) {
  const [cubeState, setCubeState] = useState(initialCubeState);
  const [selectedFace, setSelectedFace] = useState("front");
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [selectedColor, setSelectedColor] = useState(COLORS.red);

  const filledSquares = useMemo(() => {
    return Object.values(cubeState)
      .flat()
      .filter((color) => color !== DEFAULT_COLOR).length;
  }, [cubeState]);

  const progress = useMemo(() => (filledSquares / 54) * 100, [filledSquares]);

  const handleSquareClick = (index) => {
    setSelectedSquare(index);
    const newCubeState = { ...cubeState };
    newCubeState[selectedFace][index] = selectedColor;
    setCubeState(newCubeState);
  };

  const handleNav = (direction) => {
    const nextFace = FACE_NAVIGATION[selectedFace][direction];
    if (nextFace) {
      setSelectedFace(nextFace);
      setSelectedSquare(null); // Deselect square when changing face
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const directionMap = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      if (directionMap[e.key]) {
        e.preventDefault();
        handleNav(directionMap[e.key]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedFace]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftPanel}>
        <div className={styles.faceGrid}>
          {cubeState[selectedFace].map((color, index) => (
            <div
              key={index}
              className={`${styles.gridSquare} ${
                selectedSquare === index ? styles.gridSquareSelected : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleSquareClick(index)}
            />
          ))}
        </div>
        <div className={styles.navWidget}>
          <div
            className={`${styles.navOval} ${styles.navOvalVertical} ${styles.navOvalUp}`}
            onClick={() => handleNav("up")}
          ></div>
          <div
            className={`${styles.navOval} ${styles.navOvalVertical} ${styles.navOvalDown}`}
            onClick={() => handleNav("down")}
          ></div>
          <div
            className={`${styles.navOval} ${styles.navOvalHorizontal} ${styles.navOvalLeft}`}
            onClick={() => handleNav("left")}
          ></div>
          <div
            className={`${styles.navOval} ${styles.navOvalHorizontal} ${styles.navOvalRight}`}
            onClick={() => handleNav("right")}
          ></div>
          <div className={styles.navCenter}>
            <div className={styles.navCenterDot}></div>
            <span>
              {selectedFace.charAt(0).toUpperCase() + selectedFace.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.progressContainer}>
          <div className={styles.progressLabel}>
            <span>Setup Progress</span>
            <span>{filledSquares}/54</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressBarInner}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className={styles.colorSelector}>
          <div className={styles.selectorHeader}>
            <FaPalette />
            <span>Select a Color</span>
          </div>
          <div className={styles.colorGrid}>
            {Object.values(COLORS).map((color) => (
              <button
                key={color}
                className={`${styles.colorButton} ${
                  selectedColor === color ? styles.colorButtonSelected : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        <div className={styles.mainActions}>
          <button
            className={styles.solveButton}
            onClick={() => onSolve(cubeState)}
          >
            <FaCheck /> Solve Cube
          </button>
        </div>

        <div className={styles.secondaryActions}>
          <button className={styles.secondaryButton} onClick={onScramble}>
            <FaRandom /> Random Scramble
          </button>
          <button className={styles.secondaryButton} onClick={onReset}>
            <FaSync /> Start Fresh
          </button>
        </div>
      </div>
    </div>
  );
}
