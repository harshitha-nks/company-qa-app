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
    axios
      .get('https://company-qa-app-production.up.railway.app/ask/history')
      .then((res) => setHistory(res.data))
      .catch((err) => console.error('Failed to fetch history:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnswer('');

    try {
      const response = await fetch('https://company-qa-app-production.up.railway.app/ask/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, domain }),
      });

      if (!response.body) {
        throw new Error('No response body received.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let resultText = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk
          .split('\n')
          .filter((line) => line.startsWith('data:'));

        for (const line of lines) {
          const token = line.replace(/^data:\s*/, '');
          resultText += token;
          setAnswer((prev) => prev + token + ' ');
        }
      }

      const updatedHistory = await axios.get('https://company-qa-app-production.up.railway.app/ask/history');
      setHistory(updatedHistory.data);
    } catch (err) {
      console.error('Streaming error:', err);
      setAnswer('Error streaming response. Check console.');
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
