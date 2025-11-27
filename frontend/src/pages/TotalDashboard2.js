import React, { useEffect, useState } from "react";
import '../css/TotalDashboard.css'; // Make sure this CSS file includes the styles you shared
import { API_BASE } from '../utils/api';

const TotalDashboard2 = () => {
  const [fallingScores, setFallingScores] = useState([]);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    fetch(`${API_BASE}/api/scores`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch falling scores");
        return res.json();
      })
      .then((data) => {
        setFallingScores(data);
      })
      .catch((err) => {
        setError("Error loading scores: " + err.message);
      });
  }, []);

  // Stats summary
  const totalScores = fallingScores.length;
  const highestScore = Math.max(...fallingScores.map(s => s.score), 0);
  const averageScore = totalScores > 0
    ? Math.round(fallingScores.reduce((sum, s) => sum + s.score, 0) / totalScores)
    : 0;

  const lastScore = totalScores > 0 ? fallingScores[fallingScores.length - 1].score : 0;

  return (
    <div className="dashboard-container">
      <h2>Falling Typing Test Dashboard</h2>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {/* Top Summary Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Games</h3>
          <p>{totalScores}</p>
        </div>
        <div className="stat-card">
          <h3>Highest Score</h3>
          <p>{highestScore}</p>
        </div>
        <div className="stat-card">
          <h3>Average Score</h3>
          <p>{averageScore}</p>
        </div>
        <div className="stat-card">
          <h3>Last Score</h3>
          <p>{lastScore}</p>
        </div>
      </div>

      {/* Score Distribution Grid */}
      <h2 style={{ marginTop: "60px", textAlign: "center" }}>Score History</h2>
      <div className="distribution-grid">
        {fallingScores.map((entry, index) => (
          <div key={index} className="distribution-card">
            <h4>#{index + 1}</h4>
            <p>{entry.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalDashboard2;
