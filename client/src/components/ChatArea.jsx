import { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';

function ChatArea({ currentMessages }) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#343541',
        width: '100%'
      }}
    >
      {currentMessages.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#c5c5d2',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <h1 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '12px', color: '#ffffff' }}>
            How can I help you today?
          </h1>
        </div>
      ) : (
        <div style={{ width: '100%', paddingBottom: '20px' }}>
          {currentMessages.map((msg, i) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '20px 16px',
                  backgroundColor: isUser ? '#343541' : '#444654',
                  borderBottom: '1px solid rgba(0,0,0,0.1)',
                  color: '#d1d5db'
                }}
              >
                <div
                  style={{
                    maxWidth: '768px',
                    width: '100%',
                    display: 'flex',
                    gap: '16px'
                  }}
                >
                  {/* Avatar Icon */}
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '4px',
                      backgroundColor: isUser ? '#5436da' : '#10a37f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}
                  >
                    {isUser ? 'U' : 'G'}
                  </div>

                  {/* Message Content */}
                  <div
                    style={{
                      flex: 1,
                      lineHeight: '1.6',
                      fontSize: '15px',
                      overflowX: 'auto'
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: '4px', color: '#ffffff' }}>
                      {isUser ? 'You' : 'Gemini'}
                    </div>

                    {isUser ? (
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                    ) : (
                      <div
                        className="markdown-content"
                        style={{
                          wordBreak: 'break-word'
                        }}
                      >
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}

export default ChatArea;