import Markdown from 'react-markdown';

function ChatArea({ currentMessages }) {
  return (
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      {currentMessages.length === 0 ? (
        <h2 style={{ textAlign: 'center', marginTop: '100px', color: '#8e8ea0' }}>How can I help you today?</h2>
      ) : (
        currentMessages.map((msg, i) => (
          <div key={i} style={{ margin: '15px 0', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '10px 15px', 
              borderRadius: '10px', 
              backgroundColor: msg.sender === 'user' ? '#10a37f' : '#444654',
              maxWidth: '80%',
              textAlign: 'left'
            }}>
              <strong>{msg.sender === 'user' ? 'You:' : 'Gemini:'}</strong>
              
              {msg.sender === 'bot' ? (
                <div style={{ marginTop: '5px', lineHeight: '1.5' }}>
                  <Markdown>{msg.text}</Markdown>
                </div>
              ) : (
                <p style={{ margin: '5px 0 0 0' }}>{msg.text}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ChatArea;