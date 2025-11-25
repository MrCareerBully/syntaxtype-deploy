import React, { useState } from "react";
import "./GridGame.css";
import { runCCode } from "./judge0";
 
const GRID_ROWS = 10;
const GRID_COLS = 10;
 
function getRandomPos() {
  const r = Math.floor(Math.random() * GRID_ROWS);
  const c = Math.floor(Math.random() * GRID_COLS);
  return { row: r, col: c };
}
 
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
 
export default function GridGameSimulator() {
  // =======================
  // Difficulty Levels
  // =======================
  const [difficulty, setDifficulty] = useState("Normal");
 
  const getObstacleCount = () => {
    switch (difficulty) {
      case "Easy":
        return 0;
      case "Normal":
        return 10;
      case "Hard":
        return 20;
      default:
        return 10;
    }
  };
 
  // =======================
  // Initial Setup
  // =======================
  const [playerPos, setPlayerPos] = useState(getRandomPos);
  const [pokemonPos, setPokemonPos] = useState(() => {
    let pos;
    do {
      pos = getRandomPos();
    } while (pos.row === playerPos.row && pos.col === playerPos.col);
    return pos;
  });
 
  const generateObstacles = () => {
    const obstacles = [];
    const OBSTACLE_COUNT = getObstacleCount();
    while (obstacles.length < OBSTACLE_COUNT) {
      const pos = getRandomPos();
      const occupied =
        (pos.row === playerPos.row && pos.col === playerPos.col) ||
        (pos.row === pokemonPos.row && pos.col === pokemonPos.col) ||
        obstacles.some((o) => o.row === pos.row && o.col === pos.col);
      if (!occupied) obstacles.push(pos);
    }
    return obstacles;
  };
 
  const [obstacles, setObstacles] = useState(generateObstacles);
  const [message, setMessage] = useState("🎮 Reach the Pokémon using rook-like moves!");
  const [showWhileEditor, setShowWhileEditor] = useState(false);
 
  // =======================
  // Code Templates
  // =======================
  const getForLoopCode = (startRow, startCol) => `#include <stdio.h>
int main() {
    int r = ${startRow};
    int c = ${startCol};
 
    // Use loops to reach the Pokémon step by step
    for (int i = 0; i < 5; i++) {
        MOVE(r, c); // Move one step at a time (rook-like)
        // increment r or c here
    }
 
    return 0;
}`;
 
  const getWhileLoopCode = (startRow, startCol) => `#include <stdio.h>
int main() {
    int r = ${startRow};
    int c = ${startCol};
 
    int i = 0;
    while (i < 5) {
        MOVE(r, c); // Move one step at a time (rook-like)
        // increment r or c here
        i++;
    }
 
    return 0;
}`;
 
  const [codeInput, setCodeInput] = useState(getForLoopCode(playerPos.row, playerPos.col));
  const [whileCode, setWhileCode] = useState(getWhileLoopCode(playerPos.row, playerPos.col));
 
  // =======================
  // Game Logic
  // =======================
  async function runCode(customCode) {
    setMessage("⏳ Running your C code...");
 
    const instrumentedCode = `#include <stdio.h>
#define MOVE(r, c) printf("ROW=%d COL=%d\\n", (r), (c));
${customCode}`;
 
    const result = await runCCode(instrumentedCode);
    if (result.error) {
      setMessage("⚠️ Error contacting Judge0");
      return;
    }
    if (result.compile_output) {
      setMessage("❌ Compilation Error:\n" + result.compile_output);
      return;
    }
    if (result.stderr) {
      setMessage("❌ Runtime Error:\n" + result.stderr);
      return;
    }
 
    const moves = (result.stdout || "")
      .trim()
      .split("\n")
      .map((line) => {
        const match = line.match(/ROW=(\d+)\s+COL=(\d+)/);
        if (match) return { row: parseInt(match[1]), col: parseInt(match[2]) };
        return null;
      })
      .filter(Boolean);
 
    if (moves.length === 0) {
      setMessage("⚠️ No moves detected. Use MOVE(r, c) for each step!");
      return;
    }
 
    let currentPos = playerPos;
 
    for (let pos of moves) {
      const rowDiff = Math.abs(pos.row - currentPos.row);
      const colDiff = Math.abs(pos.col - currentPos.col);
      if (!((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1))) {
        setMessage("❌ Invalid move! You can only move like a rook by 1 cell per step.");
        return;
      }
 
      if (pos.row >= GRID_ROWS || pos.col >= GRID_COLS || pos.row < 0 || pos.col < 0) {
        setMessage("❌ Out of bounds!");
        return;
      }
 
      currentPos = pos;
      setPlayerPos(currentPos);
      await sleep(300);
 
      const hitObstacle = obstacles.some(o => o.row === currentPos.row && o.col === currentPos.col);
      if (hitObstacle) {
        setMessage("💀 Game Over! You hit an obstacle!");
        return;
      }
 
      if (currentPos.row === pokemonPos.row && currentPos.col === pokemonPos.col) {
        setMessage("🎉 You found the Pokémon! 🎊 Keep playing or press New Game.");
        return;
      }
    }
 
    setMessage("⏳ Keep moving! Adjust your loops to reach the Pokémon.");
  }
 
  // =======================
  // New Game
  // =======================
  function newGame() {
    let newPlayer, newPokemon;
    do {
      newPlayer = getRandomPos();
      newPokemon = getRandomPos();
    } while (newPlayer.row === newPokemon.row && newPlayer.col === newPokemon.col);
 
    setPlayerPos(newPlayer);
    setPokemonPos(newPokemon);
    setObstacles(generateObstacles());
    setCodeInput(getForLoopCode(newPlayer.row, newPlayer.col));
    setWhileCode(getWhileLoopCode(newPlayer.row, newPlayer.col));
    setMessage(`🎲 New ${difficulty} game! Avoid obstacles and reach the Pokémon!`);
  }
 
  // =======================
  // UI Rendering
  // =======================
  const difficultyButtonStyle = (level) => ({
    padding: "10px 20px",
    margin: "0 8px",
    borderRadius: "8px",
    border: "2px solid #333",
    backgroundColor:
      difficulty === level
        ? level === "Easy"
          ? "#81C784"
          : level === "Normal"
          ? "#FFD54F"
          : "#E57373"
        : "#f0f0f0",
    color: difficulty === level ? "#000" : "#555",
    fontWeight: difficulty === level ? "bold" : "normal",
    boxShadow: difficulty === level ? "0 0 10px rgba(0,0,0,0.4)" : "none",
    cursor: "pointer",
    transition: "0.2s ease",
  });
 
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2>Pokémon Hunting Grid ({difficulty} Mode)</h2>
 
      {/* Difficulty Buttons */}
      <div style={{ marginBottom: "20px" }}>
        {["Easy", "Normal", "Hard"].map((level) => (
          <button
            key={level}
            onClick={() => {
              setDifficulty(level);
              setMessage(`🎮 Difficulty set to ${level}. Press New Game to start.`);
              setObstacles([]); // clear old obstacles until new game starts
            }}
            style={difficultyButtonStyle(level)}
          >
            {level}
          </button>
        ))}
      </div>
 
      {/* Grid */}
      <div className="grid" style={{ marginBottom: "20px" }}>
        {Array.from({ length: GRID_ROWS }).map((_, r) => (
          <div key={r} className="row">
            {Array.from({ length: GRID_COLS }).map((_, c) => {
              let cellContent = "";
              if (r === playerPos.row && c === playerPos.col) cellContent = "🧍";
              else if (r === pokemonPos.row && c === pokemonPos.col)
                cellContent = <img src="/images/pokeball.png" alt="Pokemon" style={{ width: "28px", height: "28px" }} />;
              else if (obstacles.some(o => o.row === r && o.col === c))
                cellContent = "🪨";
 
              return (
                <div key={c} className="cell">{cellContent}</div>
              );
            })}
          </div>
        ))}
      </div>
 
      {/* Controls */}
      <button style={{ marginBottom: "10px" }} onClick={() => setShowWhileEditor(!showWhileEditor)}>
        {showWhileEditor ? "Hide While Loop Editor" : "Show While Loop Editor"}
      </button>
 
      <textarea
        rows={12}
        cols={60}
        style={{ marginBottom: "10px", width: "100%" }}
        value={codeInput}
        onChange={(e) => setCodeInput(e.target.value)}
      />
      {showWhileEditor && (
        <textarea
          rows={12}
          cols={60}
          style={{ marginBottom: "10px", width: "100%" }}
          value={whileCode}
          onChange={(e) => setWhileCode(e.target.value)}
        />
      )}
 
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => runCode(codeInput)}>Run For Loop Code</button>
        <button onClick={() => runCode(whileCode)}>Run While Loop Code</button>
        <button onClick={newGame}>New Game</button>
      </div>
 
      <pre style={{ marginTop: 12, textAlign: "center" }}>{message}</pre>
    </div>
  );
}