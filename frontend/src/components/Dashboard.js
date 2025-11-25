"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const navigate = useNavigate()
  const [userRole] = useState("Logged in Account")
  const [userName] = useState(() => localStorage.getItem("userName") || "User")
  const [stats] = useState({
    totalLessons: 12,
    completedLessons: 8,
    averageWPM: 45,
    accuracy: 92,
    totalStudents: 25,
    totalTeachers: 5,
  })

  const recentActivities = [
    { id: 1, title: "Basic Typing Fundamentals", date: "2024-01-15", status: "completed" },
    { id: 2, title: "Speed Test Challenge", date: "2024-01-14", status: "in-progress" },
    { id: 3, title: "Advanced Key Combinations", date: "2024-01-13", status: "pending" },
  ]

  const handleNavigation = (path) => navigate(path)

  const styles = {
    container: {
      padding: 24,
      backgroundColor: "#f9fafb",
      minHeight: "100vh",
      fontFamily: "Segoe UI, sans-serif",
    },
    card: {
      background: "#fff",
      padding: 20,
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 700,
      marginBottom: 6,
      color: "#1e293b",
    },
    subtitle: {
      color: "#6b7280",
      fontSize: 14,
      textTransform: "capitalize",
    },
    grid: {
      display: "grid",
      gap: 20,
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      marginBottom: 32,
    },
    statCard: (color) => ({
      ...styles.card,
      padding: 16,
      textAlign: "center",
      borderLeft: `6px solid ${color}`,
    }),
    statValue: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#111827",
    },
    statLabel: {
      fontSize: 13,
      color: "#6b7280",
      textTransform: "uppercase",
      marginTop: 4,
    },
    button: (bgColor = "#3b82f6") => ({
      backgroundColor: bgColor,
      color: "#fff",
      padding: "12px 16px",
      borderRadius: 8,
      fontWeight: 600,
      fontSize: 14,
      border: "none",
      cursor: "pointer",
    }),
    sectionTitle: {
      fontSize: 18,
      fontWeight: 600,
      marginBottom: 16,
      color: "#1e293b",
    },
    activityItem: {
      display: "flex",
      justifyContent: "space-between",
      borderBottom: "1px solid #e5e7eb",
      padding: "10px 0",
    },
    badge: (status) => {
      const base = {
        padding: "4px 10px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        textTransform: "uppercase",
      }
      switch (status) {
        case "completed":
          return { ...base, backgroundColor: "#dcfce7", color: "#166534" }
        case "in-progress":
          return { ...base, backgroundColor: "#fef3c7", color: "#92400e" }
        case "pending":
          return { ...base, backgroundColor: "#fee2e2", color: "#991b1b" }
        default:
          return base
      }
    },
  }

  const getStatsForRole = () => {
    switch (userRole) {
      case "ADMIN":
        return [
          { label: "Total Users", value: stats.totalStudents + stats.totalTeachers, color: "#3b82f6" },
          { label: "Total Students", value: stats.totalStudents, color: "#10b981" },
          { label: "Total Teachers", value: stats.totalTeachers, color: "#f59e0b" },
          { label: "Total Lessons", value: stats.totalLessons, color: "#8b5cf6" },
        ]
      case "TEACHER":
        return [
          { label: "My Students", value: stats.totalStudents, color: "#3b82f6" },
          { label: "Lessons Created", value: stats.totalLessons, color: "#10b981" },
          { label: "Average WPM", value: stats.averageWPM, color: "#f59e0b" },
          { label: "Class Accuracy", value: `${stats.accuracy}%`, color: "#8b5cf6" },
        ]
      default:
        return [
          { label: "Lessons Completed", value: `${stats.completedLessons}/${stats.totalLessons}`, color: "#3b82f6" },
          { label: "Average WPM", value: stats.averageWPM, color: "#10b981" },
          { label: "Accuracy Rate", value: `${stats.accuracy}%`, color: "#f59e0b" },
          {
            label: "Progress",
            value: `${Math.round((stats.completedLessons / stats.totalLessons) * 100)}%`,
            color: "#8b5cf6",
          },
        ]
    }
  }

  const getQuickActions = () => {
    const actions = [
      { label: "Take Typing Test", path: "/typingtest", color: "#3b82f6" },
      { label: "Falling Typing Test", path: "/fallingtypingtest", color: "#10b981" },
      { label: "View All Lessons", path: "/lessons/all", color: "#f59e0b" },
    ]

    const roleExtras = {
      STUDENT: [{ label: "Update Profile", path: "/student-details-form", color: "#6366f1" }],
      TEACHER: [
        { label: "Instructor Module", path: "/instructor", color: "#3b82f6" },
        { label: "Create Lesson", path: "/lesson", color: "#10b981" },
        { label: "Manage Challenges", path: "/challenges", color: "#f59e0b" },
        { label: "Update Profile", path: "/teacher-details-form", color: "#6366f1" },
      ],
      ADMIN: [
        { label: "Manage Users", path: "/admin/users", color: "#ef4444" },
        { label: "Instructor Module", path: "/instructor", color: "#3b82f6" },
        { label: "Create Lesson", path: "/lesson", color: "#10b981" },
        { label: "Manage Challenges", path: "/challenges", color: "#f59e0b" },
      ],
    }

    return [...actions, ...(roleExtras[userRole] || [])]
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome back, {userName}!</h1>
        <p style={styles.subtitle}>{userRole} Dashboard</p>
      </div>

      {/* Stats */}
      <div style={styles.grid}>
        {getStatsForRole().map((stat, idx) => (
          <div key={idx} style={styles.statCard(stat.color)}>
            <div style={styles.statValue}>{stat.value}</div>
            <div style={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={styles.grid}>
        {getQuickActions().map((action, idx) => (
          <button
            key={idx}
            style={styles.button(action.color)}
            onClick={() => handleNavigation(action.path)}
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Recent Activities */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Recent Activities</h3>
        {recentActivities.map((activity) => (
          <div key={activity.id} style={styles.activityItem}>
            <div>
              <div style={{ fontWeight: 600 }}>{activity.title}</div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>{activity.date}</div>
            </div>
            <span style={styles.badge(activity.status)}>{activity.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
