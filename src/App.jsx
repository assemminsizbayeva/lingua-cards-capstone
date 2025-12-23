import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./styles/global.css";

// Simple components
const Login = () => (
  <div className="main-content">
    <div className="card">
      <h1 className="text-center">Login</h1>
      <form>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Sign In
        </button>
      </form>
      <p className="text-center mt-2">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  </div>
);

const Dashboard = () => (
  <div className="main-content">
    <h1>Welcome to LinguaCards!</h1>
    <p>Your language learning flashcard system</p>
    
    <div className="grid grid-3 mt-3">
      <div className="card">
        <h3>📚 Total Cards</h3>
        <p style={{ fontSize: "2rem", fontWeight: "bold" }}>0</p>
      </div>
      <div className="card">
        <h3>✅ Learned</h3>
        <p style={{ fontSize: "2rem", fontWeight: "bold" }}>0</p>
      </div>
      <div className="card">
        <h3>⏰ Due Today</h3>
        <p style={{ fontSize: "2rem", fontWeight: "bold" }}>0</p>
      </div>
    </div>
    
    <div className="card mt-3">
      <h3>Quick Actions</h3>
      <div className="grid grid-2 mt-2">
        <Link to="/upload" className="btn btn-primary">
          📤 Upload Excel/CSV
        </Link>
        <Link to="/cards" className="btn btn-outline">
          🗂️ View All Cards
        </Link>
      </div>
    </div>
  </div>
);

const Upload = () => (
  <div className="main-content">
    <div className="card">
      <h1 className="text-center">📤 Bulk Upload</h1>
      <p>Upload Excel/CSV files with your vocabulary lists</p>
      
      <div style={{
        border: "2px dashed #4361ee",
        borderRadius: "12px",
        padding: "3rem",
        textAlign: "center",
        margin: "2rem 0",
        backgroundColor: "#f8f9fa"
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📄</div>
        <h3>Drag & Drop Files Here</h3>
        <p>or click to select files</p>
        <p style={{ color: "#6c757d", fontSize: "0.875rem" }}>
          Supports: .csv, .xlsx, .xls (Max 5MB)
        </p>
      </div>
      
      <div className="form-group">
        <label>Or enter data manually:</label>
        <textarea 
          rows="5" 
          placeholder="word,translation,language,type,example
libro,book,Spanish,noun,Estoy leyendo un libro.
correr,to run,Spanish,verb,Me gusta correr."
          style={{ width: "100%" }}
        ></textarea>
      </div>
      
      <button className="btn btn-primary w-100">Upload Flashcards</button>
    </div>
  </div>
);

// Navbar Component
const Navbar = () => (
  <nav>
    <div className="nav-container">
      <div className="nav-brand">
        <span style={{ fontSize: "1.5rem" }}>🗣️</span>
        <span>LinguaCards</span>
      </div>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/cards">Cards</Link>
        <Link to="/review">Review</Link>
        <Link to="/login" className="btn btn-outline" style={{ color: "white", borderColor: "white" }}>
          Login
        </Link>
      </div>
    </div>
  </nav>
);

// Simple pages
const Cards = () => (
  <div className="main-content">
    <div className="card">
      <h1>My Flashcards</h1>
      <p>All your vocabulary cards will appear here</p>
      <div className="text-center p-3" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
        <p>No cards yet. <Link to="/upload">Upload some vocabulary</Link> to get started!</p>
      </div>
    </div>
  </div>
);

const Review = () => (
  <div className="main-content">
    <div className="card">
      <h1>Review Queue</h1>
      <p>Cards due for review based on spaced repetition</p>
      <div className="text-center p-3" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
        <p>🎉 No cards due for review! You're all caught up.</p>
      </div>
    </div>
  </div>
);

const Register = () => (
  <div className="main-content">
    <div className="card">
      <h1 className="text-center">Create Account</h1>
      <form>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Sign Up
        </button>
      </form>
      <p className="text-center mt-2">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  </div>
);

// Main App Component
function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/review" element={<Review />} />
        </Routes>
        <footer style={{
          background: "#f8f9fa",
          padding: "var(--spacing-md)",
          textAlign: "center",
          borderTop: "1px solid #dee2e6",
          marginTop: "auto"
        }}>
          <p>COMP 2081 Capstone Project - Language Learning Flashcard App</p>
          <p style={{ fontSize: "0.875rem", color: "#6c757d" }}>
            Features: Excel/CSV Upload • Spaced Repetition • Interactive Flashcards
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
