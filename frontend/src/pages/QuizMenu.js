import React, { useState, useEffect } from "react";
import SyntaxSaverLesson from "./SyntaxSaverLesson";
// import "./SyntaxSaverLesson.css";
import { API_BASE } from '../utils/api';

export default function QuizMenu() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch quizzes from Spring Boot backend
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/quiz`);
        if (!response.ok) throw new Error("Failed to load quizzes");
        const data = await response.json();
        setQuizzes(data);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("⚠️ Could not load quizzes from the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  // If user selected a quiz, show the quiz player
  if (selectedQuiz) {
    return (
      <SyntaxSaverLesson
        quizId={selectedQuiz}
        onBack={() => setSelectedQuiz(null)}
      />
    );
  }

  return (
    <div className="quiz-menu">
      <h2>🧠 Syntax Saver Quizzes</h2>
      <p>Select a quiz to begin your coding journey!</p>

      {loading ? (
        <p>⏳ Loading quizzes...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="quiz-list">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <button
                key={quiz.id}
                className="quiz-item"
                onClick={() => setSelectedQuiz(quiz.id)}
              >
                {quiz.title}
              </button>
            ))
          ) : (
            <p>No quizzes available yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
