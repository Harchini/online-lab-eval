import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Solve = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('// Write your JavaScript solution here\n\n');
  const [runOutput, setRunOutput] = useState(null);
  const [runError, setRunError] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => {
    axios.get(`/api/questions/${id}`, { headers }).then(({ data }) => setQuestion(data));
  }, [id]);

  const handleRun = async () => {
    setRunOutput(null); setResult(null);
    try {
      // Use first test case as default input for "Run Code"
      const defaultInput = question.testCases.length > 0 ? question.testCases[0].input : '';
      const { data } = await axios.post('/api/submissions/run', { code, input: defaultInput }, { headers });
      setRunOutput(data.output || data.error || 'No output');
      setRunError(!data.success);
    } catch (err) {
      setRunOutput(err.response?.data?.message || 'Execution failed');
      setRunError(true);
    }
  };

  const handleSubmit = async () => {
    setLoading(true); setResult(null); setRunOutput(null);
    try {
      const { data } = await axios.post('/api/submissions/submit', { questionId: id, code }, { headers });
      setResult(data);
    } catch (err) {
      setRunOutput(err.response?.data?.message || 'Submission failed');
      setRunError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!question) return <div className="page" style={{ color: '#94a3b8' }}>Loading question...</div>;

  return (
    <div className="editor-page">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
        <button className="btn-back" onClick={() => navigate('/questions')}>← Back</button>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{question.title}</h2>
      </div>

      <div className="editor-layout">
        {/* Left: Question Detail */}
        <div className="q-detail glass">
          <h3>Problem Description</h3>
          <p>{question.description}</p>

          <div className="testcase-preview">
            <h4>Sample Test Cases</h4>
            {question.testCases.slice(0, 2).map((tc, i) => (
              <div key={i} style={{ marginBottom: '0.8rem' }}>
                <div className="tc-box"><b>Input:</b> {tc.input}</div>
                <div className="tc-box" style={{ marginTop: '0.3rem' }}><b>Output:</b> {tc.output}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>Marks: {tc.marks}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className="code-panel">
          <textarea
            spellCheck="false"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your JavaScript code here..."
          />

          <div className="action-btns">
            <button className="btn-run" onClick={handleRun}>▶ Run Code</button>
            <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : '✔ Submit'}
            </button>
          </div>

          {/* Run Output Panel */}
          {runOutput !== null && (
            <div className={`output-panel ${runError ? 'error' : ''}`}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                {runError ? '❌ Error Output' : '✅ Run Output'}
              </div>
              <pre>{runOutput}</pre>
            </div>
          )}

          {/* Result Panel */}
          {result && (
            <div className={`result-card ${result.isFullCorrect ? 'full' : 'partial'}`}>
              <div className="result-score">{result.marksObtained}/{result.totalMarks}</div>
              <div style={{ fontWeight: 700, marginTop: '0.4rem' }}>
                {result.isFullCorrect ? '🎉 Full Marks! Perfect Solution!' : '🌟 Partial Marks Awarded'}
              </div>
              <div className="tc-result-list">
                {result.executionLogs.map((log, i) => (
                  <div key={i} className={`tc-result-item ${log.passed ? 'pass' : 'fail'}`}>
                    {log.passed ? '✓' : '✗'} Test Case {i + 1}: {log.passed ? 'Passed' : log.errorMsg}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Solve;
