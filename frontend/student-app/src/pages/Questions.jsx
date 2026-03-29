import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get('/api/questions', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setQuestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [user]);

  return (
    <div className="page">
      <div className="page-header">
        <h2>📚 Available Questions</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Welcome, {user?.regNo}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading questions...</p>
      ) : questions.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '4rem' }}>
          <div style={{ fontSize: '3rem' }}>🕐</div>
          <p style={{ marginTop: '1rem' }}>No questions assigned yet. Please wait for your staff.</p>
        </div>
      ) : (
        <div className="question-grid">
          {questions.map((q) => (
            <div key={q._id} className="q-card glass" onClick={() => navigate(`/solve/${q._id}`)}>
              <h3>{q.title}</h3>
              <p>{q.description?.substring(0, 80)}...</p>
              <div className="q-marks">✦ {q.totalMarks} Marks</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Questions;
