function ChatInput({ input, setInput, sendMessage }) {
  return (
    <div style={{ padding: '20px', backgroundColor: '#343541', display: 'flex', gap: '10px' }}>
      <input
        style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #565869', backgroundColor: '#40414f', color: 'white' }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Send a message..."
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button 
        onClick={sendMessage} 
        style={{ padding: '12px 20px', backgroundColor: '#10a37f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Send
      </button>
    </div>
  );
}

export default ChatInput;