import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';

function App() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Initialize state safely from LocalStorage
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('chat_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => {
    try {
      const savedId = localStorage.getItem('current_session_id');
      return savedId ? JSON.parse(savedId) : null;
    } catch {
      return null;
    }
  });

  // Sync session state to LocalStorage
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
    const trimmedInput = input.trim();
    if (!trimmedInput || isTyping) return;

    let targetSessionId = currentSessionId;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user', text: trimmedInput, timestamp };
    const truncatedTitle = trimmedInput.length > 24 ? `${trimmedInput.slice(0, 24)}...` : trimmedInput;

    setInput('');
    setIsTyping(true);

    // Atomically handle new session creation or updating existing session
    setSessions((prevSessions) => {
      if (!targetSessionId) {
        targetSessionId = Date.now();
        setCurrentSessionId(targetSessionId);
        return [{
          id: targetSessionId,
          title: truncatedTitle,
          messages: [userMsg]
        }, ...prevSessions];
      }

      return prevSessions.map((session) => {
        if (session.id === targetSessionId) {
          const isFirstMessage = session.messages.length === 0;
          return {
            ...session,
            title: isFirstMessage ? truncatedTitle : session.title,
            messages: [...session.messages, userMsg]
          };
        }
        return session;
      });
    });

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedInput }),
      });

      if (!res.ok) throw new Error('Failed to fetch response');

      const data = await res.json();
      const botMsg = { 
        sender: 'bot', 
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === targetSessionId
            ? { ...session, messages: [...session.messages, botMsg] }
            : session
        )
      );
    } catch (err) {
      console.error(err);
      const errorMsg = { 
        sender: 'bot', 
        text: 'Unable to reach the server. Please verify your connection.', 
        isError: true 
      };
      
      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === targetSessionId
            ? { ...session, messages: [...session.messages, errorMsg] }
            : session
        )
      );
    } finally {
      setIsTyping(false);
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
    <div style={styles.appContainer}>
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        setCurrentSessionId={setCurrentSessionId}
        createNewChat={createNewChat}
        deleteSession={deleteSession}
      />

      <main style={styles.chatWrapper}>
        <header style={styles.header}>
          <div style={styles.headerTitle}>
            {activeSession ? activeSession.title : 'New Conversation'}
          </div>
          <div style={styles.statusBadge}>
            <span style={styles.statusDot} />
            Ready
          </div>
        </header>

        <div style={styles.chatAreaContainer}>
          <ChatArea currentMessages={currentMessages} isTyping={isTyping} />
        </div>

        <footer style={styles.inputContainer}>
          <ChatInput 
            input={input} 
            setInput={setInput} 
            sendMessage={sendMessage} 
            isTyping={isTyping} 
          />
        </footer>
      </main>
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    backgroundColor: '#0b0c10',
    color: '#e1e3ed',
    overflow: 'hidden',
  },
  chatWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#13141c',
    position: 'relative',
  },
  header: {
    height: '56px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    backgroundColor: '#13141c',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#ffffff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    color: '#94a3b8',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '4px 8px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
  },
  chatAreaContainer: {
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
  },
  inputContainer: {
    padding: '16px 20px',
    backgroundColor: '#13141c',
  }
};

export default App;