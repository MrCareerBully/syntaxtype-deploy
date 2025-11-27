import React, { useState, useEffect } from "react";
// import "./SyntaxSaverLesson.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { API_BASE } from '../utils/api';

export default function SyntaxSaverLesson({ quizId = 1, onBack }) {
  const [title, setTitle] = useState("");
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  // ======================================================
  // 🔹 FETCH QUIZ FROM BACKEND
  // ======================================================
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/quiz/${quizId}`);
        if (!res.ok) throw new Error("Failed to fetch quiz");
        const data = await res.json();

        console.log("🧩 Raw quiz data from backend:", data);

        setTitle(data.title || `Quiz ${quizId}`);

        // ✅ Parse each question safely
        const parsedItems = (data.items || []).map((item) => {
          let parsedData = {};
          try {
            if (typeof item.data === "string" && item.data.trim() !== "") {
             let cleaned = item.data;

// 1️⃣ Handle escaped backslashes (from DB or Java serialization)
cleaned = cleaned
  .replace(/\\{2,}/g, "\\") // turn \\\" → \"
  .replace(/"\s*\[\s*"/g, '["') // fix accidental extra quotes before arrays
  .replace(/"\s*\]\s*"/g, '"]'); // fix accidental extra quotes after arrays

// 2️⃣ Try multiple parsing attempts
try {
  parsedData = JSON.parse(cleaned);
} catch (err1) {
  try {
    parsedData = JSON.parse(cleaned.replace(/\\"/g, '"')); // fallback: unescape quotes
  } catch (err2) {
    console.warn(`⚠️ Still failed to parse item ${item.id}`, cleaned);
  }
}
            }
          } catch (err) {
            console.warn(`⚠️ Failed to parse item ${item.id}:`, item.data, err);
          }
          return { ...item, ...parsedData };
        });

        console.log("✅ Parsed quiz items:", parsedItems);
        setLessons(parsedItems);
      } catch (err) {
        console.error("❌ Error loading quiz:", err);
        setError("⚠️ Could not load quiz from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // ======================================================
  // 🔹 QUIZ NAVIGATION
  // ======================================================
  const handleNext = (points = 0) => {
    setScore((prev) => prev + points);
    setFeedback("");
    if (step < lessons.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      setFeedback("🎉 Lesson Complete! You mastered this quiz!");
    }
  };

  // ======================================================
  // 🔹 RENDER LOGIC
  // ======================================================
  if (loading) return <p>⏳ Loading quiz...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!lessons || lessons.length === 0)
    return <p>📭 No lessons found for this quiz.</p>;

  const current = lessons[step];
  console.log("🎯 Current question:", current);

  return (
    <div className="lesson-container">
      <h2>🧠 {title}</h2>
      <p>
        Step {step + 1} of {lessons.length}
      </p>

      {current.type === "match" && (
        <MatchQuestion
          data={current}
          onNext={handleNext}
          setFeedback={setFeedback}
        />
      )}

      {current.type === "reorder" && (
        <ReorderQuestion
          data={current}
          onNext={handleNext}
          setFeedback={setFeedback}
        />
      )}

      {current.type === "typing" && (
        <TypingChallenge
          data={current}
          onNext={handleNext}
          setFeedback={setFeedback}
        />
      )}

      <p className="feedback">{feedback}</p>
      <p className="score">⭐ Score: {score}</p>

      <button className="back-btn" onClick={onBack}>
        🔙 Back to Menu
      </button>
    </div>
  );
}

// ======================================================
// 🔹 MATCH QUESTION
// ======================================================
function MatchQuestion({ data, onNext, setFeedback }) {
  const options = Array.isArray(data.options)
    ? data.options.map((opt) => (typeof opt === "string" ? { label: opt } : opt))
    : [];

  if (options.length === 0) return <p>⚠️ No options for this question.</p>;

  const correctAnswer =
    data.correct ||
    data.correctAnswer ||
    data.answer ||
    data.correct_option ||
    "";

  const normalize = (s) => (s ?? "").toString().trim().toLowerCase();

  const handleClick = (opt) => {
    const chosen = normalize(opt.label || opt.value || opt);
    const correct = normalize(correctAnswer);

    if (chosen === correct) {
      setFeedback("✅ Correct!");
      onNext(10);
    } else {
      setFeedback("❌ Try again!");
    }
  };

  return (
    <div className="question">
      <h3>{data.question}</h3>
      <div className="options">
        {options.map((opt, i) => (
          <button key={i} className="option" onClick={() => handleClick(opt)}>
            {opt.icon ? <span className="icon">{opt.icon}</span> : null}{" "}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ======================================================
// 🔹 REORDER QUESTION
// ======================================================
function ReorderQuestion({ data, onNext, setFeedback }) {
  // Ensure `parts` is a clean array
  let parts = [];
  if (Array.isArray(data.parts)) {
    parts = data.parts;
  } else if (typeof data.parts === "string") {
    try {
      parts = JSON.parse(data.parts);
    } catch {
      parts = [];
    }
  }

  const [order, setOrder] = React.useState([...parts]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newOrder = Array.from(order);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);
    setOrder(newOrder);
  };

  const handleSubmit = () => {
    // Normalize correct order whether it’s strings or indexes
    let expected = [];
    if (Array.isArray(data.correctOrder)) {
      if (typeof data.correctOrder[0] === "number") {
        expected = data.correctOrder.map((i) => parts[i]);
      } else {
        expected = data.correctOrder;
      }
    }

    if (JSON.stringify(order) === JSON.stringify(expected)) {
      setFeedback("✅ Nice! That's the correct syntax.");
      onNext(15);
    } else {
      setFeedback("❌ Not quite. Try rearranging again.");
    }
  };

  return (
    <div className="question">
      <h3>{data.question}</h3>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="parts" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="reorder-area"
            >
              {order.map((part, index) => (
                <Draggable
                  key={part + index}
                  draggableId={part + index}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`part ${
                        snapshot.isDragging ? "dragging" : ""
                      }`}
                      style={{
                        userSelect: "none",
                        padding: "10px 14px",
                        background: "#7EE081",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        backgroundColor: snapshot.isDragging
                          ? "#e0f7fa"
                          : "#fafafa",
                        boxShadow: snapshot.isDragging
                          ? "0 2px 6px rgba(0,0,0,0.2)"
                          : "none",
                        ...provided.draggableProps.style,
                      }}
                    >
                      {part}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button className="submit-btn" onClick={handleSubmit}>
        Check Order
      </button>
    </div>
  );
}


// ======================================================
// 🔹 TYPING QUESTION
// ======================================================
function TypingChallenge({ data, onNext, setFeedback }) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    const normalize = (s) => s.replace(/\s+/g, "").trim();
    if (normalize(input) === normalize(data.correctCode)) {
      setFeedback("✅ Correct! Syntax fixed!");
      onNext(20);
    } else {
      setFeedback("❌ Check your syntax again.");
    }
  };

  return (
    <div className="question">
      <h3>{data.question}</h3>
      {data.buggyCode && <pre className="code-block">{data.buggyCode}</pre>}
      <textarea
        rows="6"
        className="code-input"
        placeholder="Type your corrected code here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
