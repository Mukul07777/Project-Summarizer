<div align="center">
  <h1>🌃 Project Summarizer & Cityscape Visualizer</h1>
  <p><strong>Transform any local codebase into an interactive, glowing 3D city with AI-powered architectural insights.</strong></p>
  
  <p>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://threejs.org/"><img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini AI" /></a>
  </p>
  <p>
    <a href="#-features">Features</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-enabling-ai-features">AI Integration</a> •
    <a href="#-tech-stack">Tech Stack</a>
  </p>
</div>

<br />

Project Summarizer (formerly Cityscape Visualizer) is a local-first, privacy-focused web application that maps your software architecture into an interactive 3D environment. Understand the scale, structure, and purpose of your codebase entirely within your browser—no backend required.

---

## ✨ Features

### 🌆 Procedural 3D Cities
- **Folders** become expansive districts. 
- **Files** become glowing skyscrapers. Height indicates file size, and color denotes the file extension (e.g., Yellow for JS, Blue for TS).
- **📂 Local File Parsing:** Uses the native File System Access API to securely read local directories. **Your code never leaves your machine.**

### 🤖 AI-Powered Summaries
Plug in a free Google Gemini API key to unlock the true "Summarizer" capabilities:
- **Project Overviews:** Automatically generates a high-level summary of the entire repository based on its root configuration files (like `package.json` or `README.md`).
- **File Introspection:** Click on any building to generate a plain-English, deep-dive explanation of exactly what that file does and how it is used.

### 🛠️ Real-World Developer Tools
- **📡 Global Search (The "Sonar"):** Type a filename in the search bar and watch the city react. Matching files glow bright neon green while unrelated code dims into the shadows.
- **🛣️ Dependency Graphing (The "Highways"):** Click on a JavaScript or TypeScript file to instantly see glowing, curved laser arcs connecting it to every other file it imports. Visually trace dependencies across your entire architecture!
- **🔍 Structural Introspection:** Instantly parses and lists all internal functions, classes, and components inside a clicked file.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mukul07777/Project-Summarizer.git
   cd Project-Summarizer
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

---

## 🧠 Enabling AI Features

To unlock the intelligent code summarization features:
1. Claim a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Open Project Summarizer in your browser.
3. Click the **Gear (Settings) Icon** in the top right corner.
4. Paste your API key and click Save. 
*(Your key is stored securely in your browser's local storage and is only used to communicate directly with the Gemini API).*

---

## 💻 Tech Stack

- **Frontend Framework:** React (Vite)
- **3D Rendering Engine:** `three.js`, `@react-three/fiber`, `@react-three/drei`
- **Styling & UI:** Vanilla CSS Modules, Glassmorphism, `lucide-react` icons
- **AI Integration:** Google Gemini REST API

---
<div align="center">
  <i>Built with ❤️ for developers who love beautiful architecture.</i>
</div>
