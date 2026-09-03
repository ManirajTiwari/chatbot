import { useRef, useEffect } from 'react';

function ChatInput({ input, setInput, sendMessage }) {
  const textareaRef = useRef(null);

  // Auto-resize textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    // Send message on Enter key (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isInputEmpty = !input.trim();

  return (
    <div
      style={{
        padding: '16px 20px',
        backgroundColor: '#343541',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          maxWidth: '768px',
          width: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#40414f',
          borderRadius: '12px',
          border: '1px solid rgba(32,33,35,0.5)',
          boxShadow: '0 0 15px rgba(0,0,0,0.1)',
          padding: '10px 14px'
        }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message..."
          rows={1}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            color: '#ffffff',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: '15px',
            lineHeight: '1.5',
            maxHeight: '200px',
            fontFamily: 'inherit',
            paddingRight: '40px',
            boxSizing: 'border-box'
          }}
        />

        <button
          onClick={sendMessage}
          disabled={isInputEmpty}
          title="Send message"
          style={{
            position: 'absolute',
            right: '12px',
            bottom: '10px',
            backgroundColor: isInputEmpty ? 'transparent' : '#19c37d',
            color: isInputEmpty ? '#8e8ea0' : '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px',
            cursor: isInputEmpty ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease, color 0.2s ease'
          }}
        >
          {/* Paper Plane Send Icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ChatInput;