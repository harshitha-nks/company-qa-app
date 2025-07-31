import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface HistoryItem {
  id: number;
  domain: string;
  question: string;
  answer: string;
  createdAt: string;
}

function App() {
  const [domain, setDomain] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3000/ask/history')
      .then((res) => setHistory(res.data))
      .catch((err) => console.error('Failed to fetch history:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnswer('');

    try {
      const res = await axios.post('http://localhost:3000/ask', {
        domain,
        question
      });

      setAnswer(res.data.answer);
      const updatedHistory = await axios.get('http://localhost:3000/ask/history');
      setHistory(updatedHistory.data);
    } catch (err) {
      setAnswer('Error getting response. See console.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Company QA Tool</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter domain (e.g. redcar.io)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </form>

      {answer && (
        <div className="answer">
          <strong>Answer:</strong> {answer}
        </div>
      )}

      <h2>Question History</h2>
      <div className="history">
        {history.length === 0 && <p>No history yet.</p>}
        {history.map((item) => (
          <div key={item.id} className="history-item">
            <p><strong>Domain:</strong> {item.domain}</p>
            <p><strong>Q:</strong> {item.question}</p>
            <p><strong>A:</strong> {item.answer}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
