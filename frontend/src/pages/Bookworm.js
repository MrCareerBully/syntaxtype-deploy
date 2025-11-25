// BookwormCombined.jsx
import React, { useEffect, useState } from "react";

/*
  Combined Bookworm game:
  - Weighted random letters
  - Seeds 3-5 words per scramble (horizontal/vertical)
  - Click-to-select letters (adjacency enforced; clicking a previous letter backtracks)
  - Submit removes tiles, gravity pulls letters down, top refills
  - Hint finds any dictionary word on the board
*/

const ROWS = 12; // change this to grow/shrink board
const COLS = 12;

const SAMPLE_DICTIONARY = new Set([
  "syntax","worm","data","variable","room","tree","object","bookworm",
  "code","react","grid","game","play","pick","code","line",
  "time","tone","abstract","home","house","virus","error","export",
  "python","java","ruby","dart","html","css","logic","bug",
  "compile","loop","debug","class","object","array","string",
  "node","stack","queue","index","click","score","hint"
]);

// Weighted English-like letter distribution (more vowels/frequent letters)
const LETTER_BAG = (
  "eeeeeeeeeeeeaaaaaaaaaooooooooiiiiiiiinnnnnssssrrttlldcugmbfywkpvzxjq"
).split("");

function randLetter() {
  return LETTER_BAG[Math.floor(Math.random() * LETTER_BAG.length)].toUpperCase();
}

function makeEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ""));
}

// place multiple words (3-5) into board (horizontal or vertical), avoid conflicting placements
function makeSeededBoard() {
  const board = makeEmptyBoard();

  // fill with weighted random letters
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      board[r][c] = randLetter();
    }
  }

  const words = Array.from(SAMPLE_DICTIONARY).filter(w => w.length >= 3 && w.length <= Math.max(ROWS, COLS));
  const numWords = Math.min(words.length, Math.floor(Math.random() * 3) + 3); // 3..5 (bounded by dictionary size)
  const placed = [];

  for (let i = 0; i < numWords; i++) {
    const word = words[Math.floor(Math.random() * words.length)].toUpperCase();

    for (let attempt = 0; attempt < 60; attempt++) {
      const horizontal = Math.random() < 0.5;
      const row = Math.floor(Math.random() * ROWS);
      const col = Math.floor(Math.random() * COLS);

      if ((horizontal && col + word.length > COLS) || (!horizontal && row + word.length > ROWS)) continue;

      // check conflicts: allow overlapping when letter matches
      let conflict = false;
      for (let j = 0; j < word.length; j++) {
        const r = horizontal ? row : row + j;
        const c = horizontal ? col + j : col;
        // if placed has different letter, conflict
        const existing = placed.find(p => p.r === r && p.c === c);
        if (existing && existing.letter !== word[j]) {
          conflict = true;
          break;
        }
      }
      if (conflict) continue;

      // place word
      for (let j = 0; j < word.length; j++) {
        const r = horizontal ? row : row + j;
        const c = horizontal ? col + j : col;
        board[r][c] = word[j];
        placed.push({ r, c, letter: word[j] });
      }
      break;
    }
  }

  return board;
}

function deepCopyBoard(board) {
  return board.map(row => row.slice());
}

// DFS-based finder used by the hint system (finds any word from dictionary)
function findAnyWordOnBoard(board, dictionaryArray) {
  const R = board.length;
  const C = board[0].length;
  const maxLen = 12;
  const boardLetters = board.map(r => r.map(ch => (ch || "").toLowerCase()));

  const prefixSet = new Set();
  const wordSet = new Set();
  for (const w of dictionaryArray) {
    wordSet.add(w.toLowerCase());
    for (let i = 1; i <= Math.min(w.length, maxLen); i++) prefixSet.add(w.slice(0, i).toLowerCase());
  }

  const visited = Array.from({ length: R }, () => Array(C).fill(false));

  function dfs(r, c, acc) {
    const s = acc + (boardLetters[r][c] || "");
    if (!prefixSet.has(s)) return null;
    if (wordSet.has(s)) return s;
    if (s.length >= maxLen) return null;
    visited[r][c] = true;
    const dr = [-1,-1,-1,0,0,1,1,1];
    const dc = [-1,0,1,-1,1,-1,0,1];
    for (let k = 0; k < 8; k++) {
      const nr = r + dr[k];
      const nc = c + dc[k];
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && !visited[nr][nc]) {
        const found = dfs(nr, nc, s);
        if (found) { visited[r][c] = false; return found; }
      }
    }
    visited[r][c] = false;
    return null;
  }

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      const found = dfs(r, c, "");
      if (found) return found;
    }
  }
  return null;
}

function isAdjacent(a,b) {
  const dr = Math.abs(a.r - b.r);
  const dc = Math.abs(a.c - b.c);
  return (dr === 0 && dc === 1) || (dr === 1 && dc === 0) || (dr === 1 && dc === 1);
}

// Main component
export default function BookwormCombined() {
  const [board, setBoard] = useState(() => makeSeededBoard());
  const [selected, setSelected] = useState([]); // array of {r,c}
  const [currentWord, setCurrentWord] = useState("");
  const [foundWords, setFoundWords] = useState(new Set());
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCurrentWord(selected.map(p => (board[p.r][p.c] || "")).join(""));
  }, [selected, board]);

  function handleCellClick(r,c) {
    // ignore clicks on empty tiles
    if (!board[r][c]) return;

    setSelected(prev => {
      const idx = prev.findIndex(p => p.r === r && p.c === c);
      if (idx !== -1) {
        // backtrack to this point
        return prev.slice(0, idx+1);
      }
      if (prev.length === 0) return [{r,c}];
      const last = prev[prev.length-1];
      if (!isAdjacent(last, {r,c})) {
        // in Bookworm the behavior is to start a new selection when clicking a non-adjacent tile
        return [{r,c}];
      }
      return [...prev, {r,c}];
    });
    setMessage("");
  }

  function clearSelection() {
    setSelected([]);
    setMessage("");
  }

  // gravity: collapse columns, top fill with new letters
function applyGravityAndRefill(b) {
  let newBoard = deepCopyBoard(b);

  // Step 1: Gravity - collapse columns down
  for (let c = 0; c < COLS; c++) {
    let write = ROWS - 1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (newBoard[r][c] && newBoard[r][c] !== null) {
        newBoard[write][c] = newBoard[r][c];
        if (write !== r) newBoard[r][c] = null;
        write--;
      }
    }
    // Fill empty slots at top with random letters
    for (let r = write; r >= 0; r--) {
      newBoard[r][c] = randLetter();
    }
  }

  // Step 2: Semi-smart adjustment — ensure at least 1–2 valid words exist
  const wordFound = findAnyWordOnBoard(newBoard, Array.from(SAMPLE_DICTIONARY));
  if (!wordFound) {
    // Try a few reshuffles of random tiles until we generate a playable board
    for (let attempts = 0; attempts < 25; attempts++) {
      // randomly pick some columns to re-randomize top few tiles
      const col = Math.floor(Math.random() * COLS);
      const count = Math.floor(Math.random() * 3) + 2; // random 2–4 tiles
      for (let r = 0; r < count; r++) {
        newBoard[r][col] = randLetter();
      }

      const playable = findAnyWordOnBoard(newBoard, Array.from(SAMPLE_DICTIONARY));
      if (playable) break;
    }
  }

  return newBoard;
}


  function submitSelectionAsWord() {
    const word = selected.map(p => board[p.r][p.c]).join("").toLowerCase();
    if (word.length < 3) {
      setMessage("Words must be at least 3 letters.");
      return;
    }
    if (!SAMPLE_DICTIONARY.has(word)) {
      setMessage(`"${word.toUpperCase()}" not in dictionary.`);
      return;
    }
    if (foundWords.has(word)) {
      setMessage(`You already found "${word.toUpperCase()}".`);
      return;
    }

    // Valid: remove tiles and apply gravity + refill
    setFoundWords(prev => { const s = new Set(prev); s.add(word); return s; });
    setScore(s => s + word.length * word.length);
    setMessage(`Found "${word.toUpperCase()}" +${word.length * word.length} pts`);

    // remove selected tiles
    const b = deepCopyBoard(board);
    selected.forEach(p => { b[p.r][p.c] = null; });

    const newB = applyGravityAndRefill(b);
    setBoard(newB);
    setSelected([]);
  }

  function scrambleBoard() {
    setBoard(makeSeededBoard());
    setSelected([]);
    setFoundWords(new Set());
    setScore(0);
    setMessage("Board scrambled — contains multiple seeded words.");
  }

  function giveHint() {
    const found = findAnyWordOnBoard(board, Array.from(SAMPLE_DICTIONARY));
    if (found) setMessage(`Hint: try "${found.toUpperCase()}"`);
    else setMessage("No dictionary words found — try scramble.");
  }

  // inline styles (kept inside component so single-file)
  const styles = {
    container: { fontFamily: "system-ui, Arial, sans-serif", padding: 20, display: "flex", justifyContent: "center" },
    panel: { width: "min(1100px, 96%)", display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 },
    boardWrap: { background: "#fff", padding: 16, borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" },
    colsContainer: { display: "flex", gap: 6, alignItems: "end", overflowX: "auto", padding: 6 },
    column: { display: "flex", flexDirection: "column-reverse", gap: 6 },
    tile: { width: 36, height: 36, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", userSelect: "none", position: "relative", fontWeight: 700 },
    tileDefault: { background: "#f3f4f6", color: "#111" },
    tileSelected: { background: "#16a34a", color: "#fff", boxShadow: "0 6px 12px rgba(16,185,129,0.2)" },
    controls: { display: "flex", gap: 8, marginTop: 12 },
    btn: { padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600 },
    statsPanel: { background: "#fff", padding: 16, borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.06)" },
    smallMuted: { fontSize: 13, color: "#6b7280" }
  };

  return (
    <div style={styles.container}>
      <div style={styles.panel}>
        <div style={styles.boardWrap}>
          <h2 style={{ margin: 0 }}>📚 Bookworm — Combined</h2>
          <p style={{ marginTop: 6, marginBottom: 12, color: "#374151" }}>
            Click adjacent letters to form words. Submit removes tiles and gravity pulls letters down.
          </p>

          <div style={styles.colsContainer}>
            {Array.from({ length: COLS }).map((_, c) => (
              <div key={c} style={styles.column}>
                {Array.from({ length: ROWS }).map((_, r) => {
                  const ch = board[r][c];
                  const isSel = selected.some(p => p.r === r && p.c === c);
                  const idx = selected.findIndex(p => p.r === r && p.c === c);
                  const tileStyle = {
                    ...styles.tile,
                    ...(isSel ? styles.tileSelected : styles.tileDefault)
                  };

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r,c)}
                      style={tileStyle}
                      title={ch || ""}
                      disabled={!ch}
                    >
                      <span>{ch || ""}</span>
                      {idx !== -1 && (
                        <span style={{ position: "absolute", bottom: 2, right: 4, fontSize: 11, opacity: 0.95 }}>
                          {idx + 1}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 16, fontFamily: "monospace" }}>Word: <strong>{currentWord || "—"}</strong></div>
              <div style={styles.controls}>
                <button onClick={submitSelectionAsWord} style={{ ...styles.btn, background: "#0ea5a0", color: "#fff" }} disabled={selected.length === 0}>Submit</button>
                <button onClick={clearSelection} style={{ ...styles.btn, background: "#e5e7eb" }}>Clear</button>
                <button onClick={giveHint} style={{ ...styles.btn, background: "#fde68a" }}>Hint</button>
                <button onClick={scrambleBoard} style={{ ...styles.btn, background: "#f87171", color: "#fff" }}>Scramble</button>
              </div>
            </div>
            <div style={styles.smallMuted}>{message}</div>
          </div>
        </div>

        <div style={styles.statsPanel}>
          <h3 style={{ marginTop: 0 }}>Stats</h3>
          <div style={{ marginTop: 8, marginBottom: 8 }}>
            <div>Score: <strong>{score}</strong></div>
            <div style={{ marginTop: 8 }}>Found words: {foundWords.size}</div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>Found list</div>
            <div style={{ maxHeight: 260, overflow: "auto" }}>
              {Array.from(foundWords).length === 0 ? (
                <div style={{ color: "#6b7280" }}>No words yet</div>
              ) : (
                <ul style={{ paddingLeft: 16, marginTop: 0 }}>
                  {Array.from(foundWords).map(w => (
                    <li key={w} style={{ fontFamily: "monospace" }}>{w.toUpperCase()} (+{w.length * w.length})</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div style={{ marginTop: 12, fontSize: 13, color: "#6b7280" }}>
            Tip: Click letters in order. Clicking a non-adjacent tile starts a new selection.
          </div>
        </div>
      </div>
    </div>
  );
}
