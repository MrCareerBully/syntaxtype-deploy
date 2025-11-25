import React, { useEffect, useState } from "react";
 
const ROWS = 15;
const COLS = 15;
 
const SAMPLE_DICTIONARY = [
  { word: "syntax", clue: "The rules that define the structure of code" },
  { word: "worm", clue: "A self-replicating computer program" },
  { word: "data", clue: "Information processed or stored by a computer" },
  { word: "variable", clue: "A container for storing data values" },
  { word: "tree", clue: "A hierarchical data structure" },
  { word: "object", clue: "An instance of a class in programming" },
  { word: "bookworm", clue: "Someone who loves reading" },
  { word: "code", clue: "Instructions written for a computer" },
  { word: "react", clue: "A popular JavaScript UI library" },
  { word: "grid", clue: "A structure of rows and columns" },
  { word: "game", clue: "Interactive entertainment software" },
  { word: "time", clue: "What clocks measure" },
  { word: "home", clue: "Where you live" },
  { word: "virus", clue: "Malicious software that replicates itself" },
  { word: "python", clue: "A popular programming language named after a comedy group" },
  { word: "java", clue: "A programming language that runs on the JVM" },
  { word: "ruby", clue: "A precious gemstone and programming language" },
  { word: "dart", clue: "Programming language for Flutter apps" },
  { word: "html", clue: "Markup language for creating web pages" },
  { word: "css", clue: "Language used for styling HTML" },
  { word: "logic", clue: "Reasoning or principles of correct thinking" },
  { word: "bug", clue: "An error or flaw in a program" },
  { word: "debug", clue: "To identify and remove errors in code" },
  { word: "class", clue: "A blueprint for creating objects" },
  { word: "array", clue: "A data structure that holds elements in sequence" },
  { word: "stack", clue: "LIFO data structure" },
  { word: "queue", clue: "FIFO data structure" },
  { word: "index", clue: "A numerical position in an array" },
  { word: "click", clue: "Mouse action to select an element" },
  { word: "score", clue: "Points earned in a game" },
  { word: "hint", clue: "A small piece of help or clue" }
];
 
// --- Helpers
function makeFilledGrid(char = "#") {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => char)
  );
}
 
function getRandomWords(n) {
  const shuffled = [...SAMPLE_DICTIONARY].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
 
function buildCrossword(words) {
  // grid initially all '#' (black)
  const grid = makeFilledGrid("#");
  const placements = [];
 
  // place first word horizontally in the middle
  const first = words[0];
  const startCol = Math.floor((COLS - first.word.length) / 2);
  const midRow = Math.floor(ROWS / 2);
 
  for (let i = 0; i < first.word.length; i++) {
    grid[midRow][startCol + i] = first.word[i].toUpperCase();
  }
  placements.push({ ...first, row: midRow, col: startCol, dir: "ACROSS" });
 
  // try to attach other words (mostly vertical or across depending)
  for (let i = 1; i < words.length; i++) {
    const w = words[i].word.toUpperCase();
    let placed = false;
 
    for (const p of placements) {
      for (let a = 0; a < p.word.length; a++) {
        for (let b = 0; b < w.length; b++) {
          if (p.word[a].toUpperCase() === w[b]) {
            let row = p.row;
            let col = p.col;
 
            if (p.dir === "ACROSS") {
              row = row - b;
              col = col + a;
              if (row >= 0 && row + w.length <= ROWS) {
                // check vertical placement
                let valid = true;
                for (let k = 0; k < w.length; k++) {
                  const ch = grid[row + k][col];
                  if (ch !== "#" && ch !== w[k]) valid = false;
                }
                if (valid) {
                  for (let k = 0; k < w.length; k++) {
                    grid[row + k][col] = w[k];
                  }
                  placements.push({ ...words[i], row, col, dir: "DOWN" });
                  placed = true;
                }
              }
            } else {
              // p.dir === "DOWN"
              row = row + a;
              col = col - b;
              if (col >= 0 && col + w.length <= COLS) {
                // check horizontal placement
                let valid = true;
                for (let k = 0; k < w.length; k++) {
                  const ch = grid[row][col + k];
                  if (ch !== "#" && ch !== w[k]) valid = false;
                }
                if (valid) {
                  for (let k = 0; k < w.length; k++) {
                    grid[row][col + k] = w[k];
                  }
                  placements.push({ ...words[i], row, col, dir: "ACROSS" });
                  placed = true;
                }
              }
            }
            if (placed) break;
          }
        }
        if (placed) break;
      }
      if (placed) break;
    }
  }
 
  // number placements
  placements.forEach((p, i) => {
    p.number = i + 1;
    p.word = p.word.toUpperCase();
  });
 
  return { grid, placements };
}
 
// create an answers grid consistent with the puzzle grid
function makeEmptyAnswersFromGrid(grid) {
  return grid.map(row => row.map(cell => (cell === "#" ? null : "")));
}
 
// create locked grid (null for black, false for playable)
function makeLockedFromGrid(grid) {
  return grid.map(row => row.map(cell => (cell === "#" ? null : false)));
}
 
// find a placement (word) that contains the cell r,c
function findPlacementForCell(placements, r, c) {
  return placements.find(p => {
    if (p.dir === "ACROSS") {
      return r === p.row && c >= p.col && c < p.col + p.word.length;
    } else {
      return c === p.col && r >= p.row && r < p.row + p.word.length;
    }
  });
}
 
// --- Main component
export default function CrosswordGame() {
  const [puzzle, setPuzzle] = useState(() => {
    const words = getRandomWords(10);
    return buildCrossword(words);
  });
 
  const [answers, setAnswers] = useState(() =>
    makeEmptyAnswersFromGrid(puzzle.grid)
  );
  const [locked, setLocked] = useState(() => makeLockedFromGrid(puzzle.grid));
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState("");
  const [activeRow, setActiveRow] = useState(null);
  const [activeCol, setActiveCol] = useState(null);
 
  const { grid, placements } = puzzle;
 
  // whenever the puzzle changes (newPuzzle), reset answers/locked/revealed
  useEffect(() => {
    setAnswers(makeEmptyAnswersFromGrid(grid));
    setLocked(makeLockedFromGrid(grid));
    setRevealed(false);
    setMessage("");
    setActiveRow(null);
    setActiveCol(null);
  }, [puzzle]);
 
  // handle single-cell change; compute nextAnswers and then check the relevant word
  function handleChange(r, c, val) {
    if (locked[r][c] || revealed) return;
 
    const letter = val.toUpperCase().slice(-1);
    const next = answers.map(row => row.slice());
    next[r][c] = letter;
 
    setAnswers(next);
 
    if (letter !== "") {
      checkWordAt(r, c, next);
    }
  }
 
  // Check single word containing (r,c) using ansGrid (so it doesn't rely on async state)
  function checkWordAt(r, c, ansGrid = answers) {
    const p = findPlacementForCell(placements, r, c);
    if (!p) return;
 
    const { row, col, dir, word } = p;
    let userWord = "";
 
    if (dir === "ACROSS") {
      for (let j = 0; j < word.length; j++) {
        const ch = ansGrid[row][col + j];
        if (!ch) return; // not fully filled
        userWord += ch.toUpperCase();
      }
    } else {
      for (let j = 0; j < word.length; j++) {
        const ch = ansGrid[row + j][col];
        if (!ch) return; // not fully filled
        userWord += ch.toUpperCase();
      }
    }
 
    if (userWord === word.toUpperCase()) {
      // lock those cells
      setLocked(prev => {
        const copy = prev.map(rw => rw.slice());
        if (dir === "ACROSS") {
          for (let j = 0; j < word.length; j++) copy[row][col + j] = true;
        } else {
          for (let j = 0; j < word.length; j++) copy[row + j][col] = true;
        }
        return copy;
      });
      setMessage(`✅ Correct: ${word.toUpperCase()}`);
    } else {
      // wrong -> clear those cells (but not the ones locked by other words)
      setAnswers(prev => {
        const copy = prev.map(rw => rw.slice());
        if (dir === "ACROSS") {
          for (let j = 0; j < word.length; j++) {
            // only clear if that cell isn't locked already
            if (!locked[row][col + j]) copy[row][col + j] = "";
          }
        } else {
          for (let j = 0; j < word.length; j++) {
            if (!locked[row + j][col]) copy[row + j][col] = "";
          }
        }
        return copy;
      });
      setMessage(`❌ Incorrect. Try again.`);
    }
  }
 
  // Check button: check the active cell's word
  function checkActiveWord() {
    if (activeRow === null || activeCol === null) {
      setMessage("Click a cell first to check its word.");
      return;
    }
    checkWordAt(activeRow, activeCol, answers);
  }
 
  function revealAll() {
    setRevealed(true);
    setMessage("All answers revealed!");
  }
 
  function newPuzzle() {
    const words = getRandomWords(10);
    setPuzzle(buildCrossword(words));
  }
 
  // for UI: is cell part of active word?
  function isInActiveWord(r, c) {
    if (activeRow === null || activeCol === null) return false;
    const p = findPlacementForCell(placements, activeRow, activeCol);
    if (!p) return false;
    if (p.dir === "ACROSS") {
      return r === p.row && c >= p.col && c < p.col + p.word.length;
    } else {
      return c === p.col && r >= p.row && r < p.row + p.word.length;
    }
  }
 
  // styling
  const styles = {
    container: {
      fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      padding: 20,
      display: "flex",
      justifyContent: "center"
    },
    gridWrap: {
      background: "#fff",
      padding: 18,
      borderRadius: 12,
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      maxWidth: 900
    },
    grid: {
      display: "grid",
      gridTemplateColumns: `repeat(${COLS}, 34px)`,
      gap: 4,
      marginTop: 10,
      justifyContent: "center"
    },
    cellInput: {
      width: 34,
      height: 34,
      lineHeight: "34px",
      boxSizing: "border-box",
      textAlign: "center",
      border: "1px solid #d1d5db",
      fontWeight: 700,
      fontSize: 16,
      textTransform: "uppercase",
      background: "#fff",
      outline: "none",
      padding: 0,
      userSelect: "none"
    },
    black: {
      width: 34,
      height: 34,
      background: "#111827",
      borderRadius: 4
    },
    number: {
      position: "absolute",
      top: 2,
      left: 4,
      fontSize: 9,
      color: "#6b7280",
      fontWeight: 700
    },
    cellWrap: {
      position: "relative",
      width: 34,
      height: 34
    },
    lockedCell: {
      background: "#bbf7d0"
    },
    activeHighlight: {
      background: "#f0f9ff"
    },
    controls: {
      marginTop: 14,
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexWrap: "wrap"
    },
    btn: {
      padding: "8px 12px",
      borderRadius: 8,
      border: "none",
      cursor: "pointer",
      fontWeight: 600
    }
  };
 
  return (
    <div style={styles.container}>
      <div style={styles.gridWrap}>
        <h2 style={{ margin: 0 }}>🧩 Crossword Puzzle</h2>
        <p style={{ marginTop: 6, marginBottom: 8 }}>
          Fill in the crossword. Type letters, or click a cell and press <strong>Check</strong> to validate the current word.
        </p>
 
        <div style={styles.grid}>
          {grid.map((rowArr, r) =>
            rowArr.map((cell, c) => {
              // black square
              if (cell === "#") {
                return <div key={`${r}-${c}`} style={styles.black} />;
              }
 
              // playable square
              const isLocked = !!locked[r][c];
              const isActive = isInActiveWord(r, c);
              const showLetter = revealed || isLocked;
              const value = showLetter ? grid[r][c] : (answers[r][c] || "");
 
              const inputStyle = {
                ...styles.cellInput,
                background: isLocked ? styles.lockedCell.background : styles.cellInput.background,
                ...(isActive && !isLocked ? styles.activeHighlight : {}),
                borderRadius: 4,
                caretColor: isLocked ? "transparent" : undefined
              };
 
              // find if this cell is start of a placement to show number
              const placementStart = placements.find(p => p.row === r && p.col === c);
 
              return (
                <div key={`${r}-${c}`} style={styles.cellWrap}>
                  {placementStart && (
                    <div style={styles.number}>{placementStart.number}</div>
                  )}
                  <input
                    style={inputStyle}
                    value={value}
                    maxLength={1}
                    disabled={isLocked || revealed}
                    onChange={(e) => handleChange(r, c, e.target.value)}
                    onFocus={() => {
                      setActiveRow(r);
                      setActiveCol(c);
                    }}
                    onKeyDown={(e) => {
                      // quick navigation with arrows
                      if (e.key === "ArrowRight") {
                        e.preventDefault();
                        // find next column that's not black
                        for (let nc = c + 1; nc < COLS; nc++) {
                          if (grid[r][nc] !== "#") {
                            const el = document.querySelector(`input[data-pos='${r}-${nc}']`);
                            if (el) el.focus();
                            break;
                          }
                        }
                      } else if (e.key === "ArrowLeft") {
                        e.preventDefault();
                        for (let nc = c - 1; nc >= 0; nc--) {
                          if (grid[r][nc] !== "#") {
                            const el = document.querySelector(`input[data-pos='${r}-${nc}']`);
                            if (el) el.focus();
                            break;
                          }
                        }
                      } else if (e.key === "ArrowDown") {
                        e.preventDefault();
                        for (let nr = r + 1; nr < ROWS; nr++) {
                          if (grid[nr][c] !== "#") {
                            const el = document.querySelector(`input[data-pos='${nr}-${c}']`);
                            if (el) el.focus();
                            break;
                          }
                        }
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        for (let nr = r - 1; nr >= 0; nr--) {
                          if (grid[nr][c] !== "#") {
                            const el = document.querySelector(`input[data-pos='${nr}-${c}']`);
                            if (el) el.focus();
                            break;
                          }
                        }
                      }
                    }}
                    data-pos={`${r}-${c}`}
                  />
                </div>
              );
            })
          )}
        </div>
 
        <div style={styles.controls}>
      {/*}   <button onClick={checkActiveWord} style={{ ...styles.btn, background: "#0ea5a0", color: "#fff" }}>
            Check
          </button> */}
          <button onClick={revealAll} style={{ ...styles.btn, background: "#fde68a" }}>
            Reveal
          </button>
          <button onClick={newPuzzle} style={{ ...styles.btn, background: "#f87171", color: "#fff" }}>
            New
          </button>
 
          <div style={{ marginLeft: "auto", color: "#374151", fontSize: 14 }}>
            {message}
          </div>
        </div>
 
        <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700 }}>Clues</div>
        <ul style={{ fontSize: 14, color: "#111", marginTop: 6, columns: 2 }}>
          {placements.map((p, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              <strong>{p.number}. {p.dir}</strong> – {p.clue}
            </li>
          ))}
        </ul>
 
        <div style={{ marginTop: 10, fontSize: 13, color: "#6b7280" }}>
          Tip: Use arrow keys to navigate cells. When a word is completed it will be validated automatically.
        </div>
      </div>
    </div>
  );
}