# 🧩 Rubik's Cube Solver

An interactive 3D Rubik's Cube solver built with React, Three.js, and modern web technologies.

## ✨ Features

- **Welcome Animation**: Beautiful intro with spinning 3D cube
- **Interactive 3D Cube**: Click on any square to set colors with floating palette
- **Real-time 3D Rendering**: Fully interactive cube using React Three Fiber
- **Animated Solving**: Watch the cube solve itself step by step in 3D
- **Step-by-Step Animation**: Each move is animated with proper rotations
- **Speed Controls**: Adjust solving speed (0.5x to 4x)
- **Modern UI**: Beautiful interface built with Tailwind CSS and Framer Motion
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd rubiks-cube-solver
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **Frontend**: React 19
- **3D Graphics**: Three.js + React Three Fiber
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: React Icons
- **Animations**: Framer Motion

## 📁 Project Structure

```
src/
├── components/
│   ├── RubiksCube.jsx      # 3D cube rendering component
│   └── ControlPanel.jsx    # UI controls for cube operations
├── utils/
│   └── cubeState.js        # Cube state management and algorithms
├── App.jsx                 # Main application component
└── index.css              # Global styles with Tailwind
```

## 🎯 Current Status

### ✅ Completed

- Basic 3D cube rendering
- Interactive controls (rotate, zoom, pan)
- UI control panel
- Project structure and setup
- Tailwind CSS integration

### 🚧 In Progress / Next Steps

1. **Cube State Management**

   - Implement proper cube state representation
   - Add move validation and application
   - Create cube state persistence

2. **Solving Algorithm**

   - Implement Kociemba algorithm or similar
   - Add step-by-step solving visualization
   - Optimize for speed and efficiency

3. **Enhanced 3D Features**

   - Individual cube piece selection
   - Face rotation animations
   - Better lighting and materials
   - Cube piece highlighting

4. **Advanced Features**
   - Move history and undo/redo
   - Timer and statistics
   - Multiple cube sizes (2x2, 4x4, etc.)
   - Save/load cube states
   - Tutorial mode

## 🎮 How to Use

1. **Welcome**: Enjoy the beautiful intro animation
2. **Set Colors**: Click on any square of the 3D cube to open the color palette
3. **Choose Colors**: Select from 6 standard Rubik's cube colors
4. **Inspect**: Rotate, zoom, and pan the cube to see all sides
5. **Solve**: Click "🧩 Solve Cube" to watch the magic happen
6. **Watch Animation**: See each move animated in real-time 3D
7. **Control Speed**: Adjust solving speed or pause/resume the animation
8. **Start Over**: Reset to begin with a new cube state

## 🔧 Development

### Adding New Features

1. **Cube Operations**: Extend `src/utils/cubeState.js` with new move functions
2. **UI Components**: Create new components in `src/components/`
3. **3D Enhancements**: Modify `src/components/RubiksCube.jsx` for visual improvements

### Key Files to Modify

- `src/utils/cubeState.js` - Core cube logic and algorithms
- `src/components/RubiksCube.jsx` - 3D rendering and interactions
- `src/components/ControlPanel.jsx` - User interface controls
- `src/App.jsx` - Main application state and layout

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Three.js community for 3D graphics
- React Three Fiber for React integration
- Tailwind CSS for styling
- The Rubik's cube community for algorithms and inspiration

---

**Happy Solving! 🧩✨**
