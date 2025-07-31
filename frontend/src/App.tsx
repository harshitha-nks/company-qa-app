import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [domain, setDomain] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnswer('');

    try {
      const response = await axios.post('http://localhost:3000/ask', {
        domain,
        question,
      });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Axios error:', error);
      setAnswer('Error fetching answer. Check console.');
      console.error(error);
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
          placeholder="Enter company domain (e.g. redcar.io)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Ask your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </form>
      {answer && <div className="answer"><strong>Answer:</strong> {answer}</div>}
    </div>
  );
}

export default App;
