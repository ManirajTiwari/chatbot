import { useState, useEffect } from 'react';

function App() {
  const [input, setInput] = useState('');
  
  // 1. स्टेट शुरू होते ही LocalStorage से पुरानी बातचीत लोड करें
  const [chat, setChat] = useState(() => {
    const savedChat = localStorage.getItem('gemini_chat_history');
    return savedChat ? JSON.parse(savedChat) : [];
  });

  // 2. जब भी 'chat' एरे में नया मैसेज जुड़ेगा, यह LocalStorage में अपडेट कर देगा
  useEffect(() => {
    localStorage.setItem('gemini_chat_history', JSON.stringify(chat));
  }, [chat]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setChat((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await res.json();
      setChat((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      console.error(err);
    }
  };

  // चैट क्लियर/डिलीट करने का फंक्शन
  const clearChat = () => {
    localStorage.removeItem('gemini_chat_history');
    setChat([]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gemini Chatbot</h2>
      
      {/* Clear Chat बटन */}
      <button onClick={clearChat} style={{ marginBottom: '10px', backgroundColor: '#ff4d4d', color: 'white' }}>
        Clear Chat
      </button>

      <div style={{ minHeight: '200px', border: '1px solid #ccc', padding: '10px' }}>
        {chat.map((msg, i) => (
          <p key={i}><strong>{msg.sender}:</strong> {msg.text}</p>
        ))}
      </div>

      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Type a message..." 
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;