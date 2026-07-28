<div align="center">
  <h1>🌃 Cityscape Visualizer</h1>
  <p><strong>Transform any local codebase into an interactive, glowing 3D city.</strong></p>
  
  <p>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://threejs.org/"><img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini AI" /></a>
  </p>
</div>

<br />

Cityscape Visualizer is a local-first, privacy-focused web application that maps your software architecture into an interactive 3D environment. Understand the scale, structure, and purpose of your codebase entirely within your browser—no backend required.

## ✨ Features

- **📂 Local File Parsing:** Uses the native File System Access API to securely read local directories without uploading your code anywhere.
- **🌆 Procedural 3D Cities:** Folders become districts. Files become glowing buildings. Height indicates file size, and color indicates file type.
- **🤖 AI-Powered Summaries (Optional):** Plug in a free Google Gemini API key to unlock intelligent insights:
  - **Project Summaries:** Automatically generates a high-level overview of the entire repository based on its configuration files.
  - **File Introspection:** Click on any building to see a generated plain-English summary of what that specific file does and how it is used.
- **🔍 Structural Introspection:** Click any file to see an instantly parsed list of all functions, classes, and components inside it.
- **💅 Premium UI:** Built with a sleek, dark-mode glassmorphic interface and smooth micro-animations.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mukul07777/Cityscape-Visualizer.git
   cd Cityscape-Visualizer
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## 🧠 Enabling AI Features

To unlock the intelligent code summarization features:
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Open Cityscape Visualizer in your browser.
3. Click the **Gear (Settings) Icon** in the top right corner.
4. Paste your API key and click Save. 
*(Your key is stored securely in your browser's local storage and is only used to query the Gemini API directly).*

## 🛠️ Tech Stack

- **Frontend Framework:** React (Vite)
- **3D Rendering:** `three.js`, `@react-three/fiber`, `@react-three/drei`
- **Styling:** Vanilla CSS Modules with Glassmorphism
- **Icons:** `lucide-react`
- **AI Integration:** Google Gemini REST API

---
<div align="center">
  <i>Built for developers who love beautiful architecture.</i>
</div>
