import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';

function App() {
  const [input, setInput] = useState('');
  
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('chat_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => {
    const savedId = localStorage.getItem('current_session_id');
    return savedId ? JSON.parse(savedId) : null;
  });

  useEffect(() => {
    localStorage.setItem('chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('current_session_id', JSON.stringify(currentSessionId));
  }, [currentSessionId]);

  const createNewChat = () => {
    const newSession = {
      id: Date.now(),
      title: 'New Chat',
      messages: []
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const activeSession = sessions.find((s) => s.id === currentSessionId);
  const currentMessages = activeSession ? activeSession.messages : [];

  const sendMessage = async () => {
    if (!input.trim()) return;

    let activeId = currentSessionId;

    if (!activeId) {
      const newSession = {
        id: Date.now(),
        title: input.slice(0, 20) + '...',
        messages: []
      };
      setSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      activeId = newSession.id;
    }

    const userMsg = { sender: 'user', text: input };
    const currentInput = input;
    setInput('');

    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === activeId) {
          const isFirstMessage = session.messages.length === 0;
          return {
            ...session,
            title: isFirstMessage ? currentInput.slice(0, 20) + '...' : session.title,
            messages: [...session.messages, userMsg]
          };
        }
        return session;
      })
    );

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await res.json();
      const botMsg = { sender: 'bot', text: data.reply };

      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === activeId
            ? { ...session, messages: [...session.messages, botMsg] }
            : session
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSession = (id, e) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    if (currentSessionId === id) {
      setCurrentSessionId(updated.length > 0 ? updated[0].id : null);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <Sidebar 
        sessions={sessions}
        currentSessionId={currentSessionId}
        setCurrentSessionId={setCurrentSessionId}
        createNewChat={createNewChat}
        deleteSession={deleteSession}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#343541', color: 'white' }}>
        <ChatArea currentMessages={currentMessages} />
        <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default App;