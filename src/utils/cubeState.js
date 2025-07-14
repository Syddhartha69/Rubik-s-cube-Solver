// Rubik's Cube State Management

// Define the six faces
export const FACES = {
  FRONT: "front",
  BACK: "back",
  TOP: "top",
  BOTTOM: "bottom",
  LEFT: "left",
  RIGHT: "right",
};

// Define colors for each face
export const COLORS = {
  top: "#ffffff", // white
  bottom: "#ffff00", // yellow
  front: "#ff0000", // red
  back: "#ffA500", // orange
  left: "#00ff00", // green
  right: "#0000ff", // blue
};

// Helper to rotate a face (a 3x3 array of colors)
const rotateFace = (face, clockwise = true) => {
  const newFace = Array(9);
  const mapping = clockwise
    ? [6, 3, 0, 7, 4, 1, 8, 5, 2] // Clockwise
    : [2, 5, 8, 1, 4, 7, 0, 3, 6]; // Counter-clockwise
  for (let i = 0; i < 9; i++) {
    newFace[i] = face[mapping[i]];
  }
  return newFace;
};

// Initialize a solved cube state
export function createSolvedCube() {
  const cube = {};

  Object.values(FACES).forEach((face) => {
    cube[face] = Array(9).fill(COLORS[face]);
  });

  return cube;
}

// Initialize an empty cube with center pieces
export function createEmptyCube() {
  const cube = {};

  Object.values(FACES).forEach((face) => {
    const faceArray = Array(9).fill(null);
    faceArray[4] = COLORS[face]; // Center piece
    cube[face] = faceArray;
  });

  return cube;
}

// Generate a random scramble
export function generateScramble(moves = 20) {
  const possibleMoves = ["U", "D", "L", "R", "F", "B"];
  const modifiers = ["", "'", "2"];
  const scramble = [];

  for (let i = 0; i < moves; i++) {
    const move =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(move + modifier);
  }

  return scramble;
}

// Apply a move to the cube state
export function applyMove(state, move) {
  let newState = JSON.parse(JSON.stringify(state));
  const { front, back, top, bottom, left, right } = newState;

  const moveType = move.replace(/['2]/g, "");
  const isPrime = move.includes("'");
  const isDouble = move.includes("2");
  const turns = isDouble ? 2 : 1;

  for (let i = 0; i < turns; i++) {
    const clockwise = !isPrime;

    switch (moveType) {
      case "U": {
        newState.top = rotateFace(newState.top, clockwise);
        const temp = [...newState.front.slice(0, 3)];
        if (clockwise) {
          newState.front.splice(0, 3, ...newState.right.slice(0, 3));
          newState.right.splice(0, 3, ...newState.back.slice(0, 3));
          newState.back.splice(0, 3, ...newState.left.slice(0, 3));
          newState.left.splice(0, 3, ...temp);
        } else {
          newState.front.splice(0, 3, ...newState.left.slice(0, 3));
          newState.left.splice(0, 3, ...newState.back.slice(0, 3));
          newState.back.splice(0, 3, ...newState.right.slice(0, 3));
          newState.right.splice(0, 3, ...temp);
        }
        break;
      }
      case "D": {
        newState.bottom = rotateFace(newState.bottom, clockwise);
        const temp = [...newState.front.slice(6, 9)];
        if (clockwise) {
          newState.front.splice(6, 3, ...newState.left.slice(6, 9));
          newState.left.splice(6, 9, ...newState.back.slice(6, 9));
          newState.back.splice(6, 9, ...newState.right.slice(6, 9));
          newState.right.splice(6, 9, ...temp);
        } else {
          newState.front.splice(6, 3, ...newState.right.slice(6, 9));
          newState.right.splice(6, 9, ...newState.back.slice(6, 9));
          newState.back.splice(6, 9, ...newState.left.slice(6, 9));
          newState.left.splice(6, 9, ...temp);
        }
        break;
      }
      case "L": {
        newState.left = rotateFace(newState.left, clockwise);
        const temp = [newState.top[0], newState.top[3], newState.top[6]];
        if (clockwise) {
          newState.top[0] = newState.back[8];
          newState.top[3] = newState.back[5];
          newState.top[6] = newState.back[2];
          newState.back[2] = newState.bottom[6];
          newState.back[5] = newState.bottom[3];
          newState.back[8] = newState.bottom[0];
          newState.bottom[0] = newState.front[0];
          newState.bottom[3] = newState.front[3];
          newState.bottom[6] = newState.front[6];
          newState.front[0] = temp[0];
          newState.front[3] = temp[1];
          newState.front[6] = temp[2];
        } else {
          newState.top[0] = newState.front[0];
          newState.top[3] = newState.front[3];
          newState.top[6] = newState.front[6];
          newState.front[0] = newState.bottom[0];
          newState.front[3] = newState.bottom[3];
          newState.front[6] = newState.bottom[6];
          newState.bottom[0] = newState.back[8];
          newState.bottom[3] = newState.back[5];
          newState.bottom[6] = newState.back[2];
          newState.back[2] = temp[2];
          newState.back[5] = temp[1];
          newState.back[8] = temp[0];
        }
        break;
      }
      case "R": {
        newState.right = rotateFace(newState.right, clockwise);
        const temp = [newState.top[2], newState.top[5], newState.top[8]];
        if (clockwise) {
          newState.top[2] = newState.front[2];
          newState.top[5] = newState.front[5];
          newState.top[8] = newState.front[8];
          newState.front[2] = newState.bottom[2];
          newState.front[5] = newState.bottom[5];
          newState.front[8] = newState.bottom[8];
          newState.bottom[2] = newState.back[6];
          newState.bottom[5] = newState.back[3];
          newState.bottom[8] = newState.back[0];
          newState.back[0] = temp[2];
          newState.back[3] = temp[1];
          newState.back[6] = temp[0];
        } else {
          newState.top[2] = newState.back[6];
          newState.top[5] = newState.back[3];
          newState.top[8] = newState.back[0];
          newState.back[0] = newState.bottom[8];
          newState.back[3] = newState.bottom[5];
          newState.back[6] = newState.bottom[2];
          newState.bottom[2] = newState.front[2];
          newState.bottom[5] = newState.front[5];
          newState.bottom[8] = newState.front[8];
          newState.front[2] = temp[0];
          newState.front[5] = temp[1];
          newState.front[8] = temp[2];
        }
        break;
      }
      case "F": {
        newState.front = rotateFace(newState.front, clockwise);
        const temp = [newState.top[6], newState.top[7], newState.top[8]];
        if (clockwise) {
          newState.top[6] = newState.left[8];
          newState.top[7] = newState.left[5];
          newState.top[8] = newState.left[2];
          newState.left[2] = newState.bottom[0];
          newState.left[5] = newState.bottom[1];
          newState.left[8] = newState.bottom[2];
          newState.bottom[0] = newState.right[6];
          newState.bottom[1] = newState.right[3];
          newState.bottom[2] = newState.right[0];
          newState.right[0] = temp[0];
          newState.right[3] = temp[1];
          newState.right[6] = temp[2];
        } else {
          newState.top[6] = newState.right[0];
          newState.top[7] = newState.right[3];
          newState.top[8] = newState.right[6];
          newState.right[0] = newState.bottom[2];
          newState.right[3] = newState.bottom[1];
          newState.right[6] = newState.bottom[0];
          newState.bottom[0] = newState.left[2];
          newState.bottom[1] = newState.left[5];
          newState.bottom[2] = newState.left[8];
          newState.left[2] = temp[2];
          newState.left[5] = temp[1];
          newState.left[8] = temp[0];
        }
        break;
      }
      case "B": {
        newState.back = rotateFace(newState.back, clockwise);
        const temp = [newState.top[0], newState.top[1], newState.top[2]];
        if (clockwise) {
          newState.top[0] = newState.right[2];
          newState.top[1] = newState.right[5];
          newState.top[2] = newState.right[8];
          newState.right[2] = newState.bottom[8];
          newState.right[5] = newState.bottom[7];
          newState.right[8] = newState.bottom[6];
          newState.bottom[6] = newState.left[0];
          newState.bottom[7] = newState.left[3];
          newState.bottom[8] = newState.left[6];
          newState.left[0] = temp[2];
          newState.left[3] = temp[1];
          newState.left[6] = temp[0];
        } else {
          newState.top[0] = newState.left[6];
          newState.top[1] = newState.left[3];
          newState.top[2] = newState.left[0];
          newState.left[0] = newState.bottom[6];
          newState.left[3] = newState.bottom[7];
          newState.left[6] = newState.bottom[8];
          newState.bottom[6] = newState.right[8];
          newState.bottom[7] = newState.right[5];
          newState.bottom[8] = newState.right[2];
          newState.right[2] = temp[0];
          newState.right[5] = temp[1];
          newState.right[8] = temp[2];
        }
        break;
      }
    }
  }

  return newState;
}

export function generateScrambledCube() {
  let cube = createSolvedCube();
  const scramble = generateScramble(20); // 20 random moves
  for (const move of scramble) {
    cube = applyMove(cube, move);
  }
  return cube;
}

// Check if the cube is solved
export function isSolved(cubeState) {
  return Object.values(FACES).every((face) => {
    const faceColors = cubeState[face];
    const firstColor = faceColors[0];
    return faceColors.every((color) => color === firstColor);
  });
}

// Get the current state as a visual representation
export function getCubeVisualState(cubeState) {
  return {
    front: cubeState[FACES.FRONT],
    back: cubeState[FACES.BACK],
    top: cubeState[FACES.TOP],
    bottom: cubeState[FACES.BOTTOM],
    left: cubeState[FACES.LEFT],
    right: cubeState[FACES.RIGHT],
  };
}

// Analyze cube state and generate solving steps
export function analyzeCubeState(cubeState) {
  const analysis = {
    whiteCross: checkWhiteCross(cubeState),
    whiteCorners: checkWhiteCorners(cubeState),
    middleLayer: checkMiddleLayer(cubeState),
    lastLayer: checkLastLayer(cubeState),
  };

  return analysis;
}

// Check if white cross is solved
function checkWhiteCross(cubeState) {
  const topFace = cubeState[FACES.TOP];
  const centerColor = topFace[4]; // Center piece

  // Check if center and edges are white
  const edgePositions = [1, 3, 5, 7]; // Top, right, bottom, left edges
  return edgePositions.every((pos) => topFace[pos] === centerColor);
}

// Check if white corners are solved
function checkWhiteCorners(cubeState) {
  const topFace = cubeState[FACES.TOP];
  const centerColor = topFace[4];

  // Check if corners are white
  const cornerPositions = [0, 2, 6, 8]; // Top-left, top-right, bottom-left, bottom-right
  return cornerPositions.every((pos) => topFace[pos] === centerColor);
}

// Check if middle layer is solved
function checkMiddleLayer(cubeState) {
  // This is a simplified check - in reality you'd check all middle layer edges
  return false; // Placeholder
}

// Check if last layer is solved
function checkLastLayer(cubeState) {
  // This is a simplified check - in reality you'd check OLL and PLL
  return false; // Placeholder
}

// Generate solving solution based on cube state
export function generateSolution(cubeState) {
  const analysis = analyzeCubeState(cubeState);

  const solution = {
    steps: [],
  };

  // Add steps based on what needs to be solved
  if (!analysis.whiteCross) {
    solution.steps.push({
      name: "cross",
      description: "Create a white cross on the top face",
      moves: ["F", "R", "U", "R'", "U'", "F'"],
    });
  }

  if (!analysis.whiteCorners) {
    solution.steps.push({
      name: "corners",
      description: "Solve the white corners",
      moves: ["R", "U", "R'", "U", "R", "U2", "R'"],
    });
  }

  if (!analysis.middleLayer) {
    solution.steps.push({
      name: "middle",
      description: "Solve the middle layer edges",
      moves: ["U", "R", "U'", "R'", "U'", "F'", "U", "F"],
    });
  }

  if (!analysis.lastLayer) {
    solution.steps.push({
      name: "oll",
      description: "Orient the last layer (OLL)",
      moves: ["F", "R", "U", "R'", "U'", "F'"],
    });

    solution.steps.push({
      name: "pll",
      description: "Permute the last layer (PLL)",
      moves: ["R", "U", "R'", "U'", "R", "U", "R'", "U'"],
    });
  }

  // If no specific issues found, provide a general solution
  if (solution.steps.length === 0) {
    solution.steps = [
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
    ];
  }

  return solution;
}

// Simple solving algorithm (placeholder)
export function solveCube(cubeState) {
  // This is where you'd implement the actual solving algorithm
  // For now, we'll return the solved state
  return createSolvedCube();
}
