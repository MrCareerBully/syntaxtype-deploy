import React, { useState, useEffect, useRef } from "react";
import '../css/FallingTypingTest.css';

const GAME_AREA_HEIGHT = 500;

const FallingTypingTest = () => {
  const [gameDuration, setGameDuration] = useState(60); // fallback duration first
  const [timeLeft, setTimeLeft] = useState(60); // initialize with 60; will sync with gameDuration later
  const [availableWords, setAvailableWords] = useState([]);
  const [fallingWords, setFallingWords] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [activeWordId, setActiveWordId] = useState(null);
  const [score, setScore] = useState(0);
    const latestScoreRef = useRef(score);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lives, setLives] = useState(null);
  const [useLives, setUseLives] = useState(false);
  const [speed, setSpeed] = useState(1);

  const wordIdCounter = useRef(0);
  const fallingWordsRef = useRef([]);

  const fetchChallengeById = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/challenges/falling/${id}`);
      const challenge = await res.json();
      if (challenge && challenge.words?.length > 0) {
        setAvailableWords(challenge.words.map(w => w.trim()));
  
        setGameDuration(challenge.testTimer || challenge.duration || 60);
        setTimeLeft(challenge.testTimer || challenge.duration || 60);
        setSpeed(challenge.speed || 1);
  
        if (challenge.maxLives && challenge.maxLives > 0) {
          setUseLives(true);
          setLives(challenge.maxLives);
        } else {
          setUseLives(false);
          setLives(null);
        }
      }
    } catch (err) {
      console.error(`Failed to fetch challenge with ID ${id}:`, err);
    }
  };

  // Load challenge from sessionStorage on mount
  useEffect(() => {
    const challenge = JSON.parse(sessionStorage.getItem("fallingChallenge"));
    if (challenge) {
       fetchChallengeById(challenge.challengeId);
    } else {
      // fallback fetch from API
    }
  }, []);
useEffect(() => {
  latestScoreRef.current = score;            
      }, [score]);
  // Timer countdown
  useEffect(() => {
  if (isGameOver) {
    // Submit score to backend
    fetch("http://localhost:8080/api/scores/falling", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score,
        timeInSeconds: gameDuration,
        challengeType: "falling",
      }),
    })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to save falling score");
      console.log("✅ Falling score submitted!");
    })
    .catch((err) => {
      console.error("❌ Error submitting falling score:", err);
    });
  }
},  [isGameOver, score, gameDuration]);
useEffect(() => {
  if (isGameOver || timeLeft <= 0) return;

  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(timer);
        setIsGameOver(true);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [timeLeft, isGameOver]);

  // Spawning and falling logic
  useEffect(() => {
    if (availableWords.length === 0 || isGameOver) return;

    const spawnInterval = setInterval(() => {
      const word = availableWords[Math.floor(Math.random() * availableWords.length)];
      const newWord = {
        id: wordIdCounter.current++,
        text: word,
        y: 0,
        x: Math.random() * 80,
      };
      setFallingWords(prev => {
        const updated = [...prev, newWord];
        fallingWordsRef.current = updated;
        return updated;
      });
    }, 2000 / speed); // speed affects spawn rate

    const fallInterval = setInterval(() => {
      let lostWordsCount = 0;

      const updatedWords = fallingWordsRef.current.reduce((acc, word) => {
        const newY = word.y + 5 * speed; // speed affects fall rate
        if (newY > GAME_AREA_HEIGHT) {
          if (useLives) lostWordsCount += 1;
          return acc; // remove word lost
        }
        acc.push({ ...word, y: newY });
        return acc;
      }, []);

      setFallingWords(updatedWords);
      fallingWordsRef.current = updatedWords;

      if (lostWordsCount > 0 && useLives) {
        setLives(prevLives => {
          const updatedLives = prevLives - lostWordsCount;
          if (updatedLives <= 0) {
            setIsGameOver(true);
            return 0;
          }
          return updatedLives;
        });
      }
    }, 200);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(fallInterval);
    };
  }, [availableWords, isGameOver, useLives, speed]);

  const handleRestart = () => {
    const challenge = JSON.parse(sessionStorage.getItem("fallingChallenge"));
    setFallingWords([]);
    fallingWordsRef.current = [];
    setCurrentInput("");
    setActiveWordId(null);
    setScore(0);
    setIsGameOver(false);
    wordIdCounter.current = 0;
  
    if (challenge?.challengeId) {
      fetchChallengeById(challenge.challengeId);
    } else {
      setAvailableWords([]);
      setGameDuration(60);
      setTimeLeft(60);
      setSpeed(1);
      setUseLives(false);
      setLives(null);
    }
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setCurrentInput(value);

    if (value === "") {
      setActiveWordId(null);
      return;
    }

    const match = fallingWordsRef.current.find(word => word.text.startsWith(value));

    if (match) {
      setActiveWordId(match.id);
      if (value === match.text) {
        setFallingWords(prev => {
          const updated = prev.filter(word => word.id !== match.id);
          fallingWordsRef.current = updated;
          return updated;
        });
        setScore(prev => prev + 1);
        setCurrentInput("");
        setActiveWordId(null);
      }
    } else {
      setActiveWordId(null);
    }
  };

  const renderWord = (word) => {
 if (word.id !== activeWordId) return word.text;
    return[...word.text].map((char, i) => (
  <span key={i} style={{ color: currentInput[i] === char ? "lime" : "red" }}>
    {char}
  </span>
))
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Falling Typing Test</h2>
      <p>Score: {score} | Time Left: {timeLeft}s {useLives && `| Lives: ${lives}`}</p>

      <div
        className="game-area"
        style={{
          backgroundImage: "url('/images/background.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: 'relative',
          height: `${GAME_AREA_HEIGHT}px`,
          overflow: 'hidden',
          border: '2px solid #ccc'
        }}
      >
        {fallingWords.map(word => (
          <div
            key={word.id}
            className="falling-word"
            style={{
              position: 'absolute',
              top: `${word.y}px`,
              left: `${word.x}%`,
              color: 'yellow',
              fontSize: '18px'
            }}
          >
            {renderWord(word)}
          </div>
        ))}

        {isGameOver && (
          <div
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0,0,0,0.7)',
              padding: '20px',
              borderRadius: '10px',
              color: 'white',
              fontSize: '24px',
              textAlign: 'center'
            }}
          >
            <p>Game Over!</p>
            <p>Final Score: {score}</p>
            <button onClick={handleRestart} style={{ padding: '10px 20px', fontSize: '16px' }}>
              Restart
            </button>
          </div>
        )}
      </div>

      {!isGameOver && (
        <input
          type="text"
          placeholder="Start typing..."
          value={currentInput}
          onChange={handleInputChange}
          style={{ width: "100%", marginTop: "1rem", padding: "10px", fontSize: "16px" }}
          autoFocus
        />
      )}
    </div>
  );
};

export default FallingTypingTest;
