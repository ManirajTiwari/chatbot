function Sidebar({ sessions, currentSessionId, setCurrentSessionId, createNewChat, deleteSession }) {
  return (
    <div style={{ width: '260px', backgroundColor: '#202123', color: 'white', padding: '15px', display: 'flex', flexDirection: 'column' }}>
      <button 
        onClick={createNewChat} 
        style={{ padding: '10px', backgroundColor: '#343541', color: 'white', border: '1px solid #565869', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
        New Chat
      </button>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => setCurrentSessionId(session.id)}
            style={{
              padding: '10px',
              margin: '5px 0',
              borderRadius: '5px',
              backgroundColor: session.id === currentSessionId ? '#343541' : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>
              {session.title}
            </span>
            <button 
              onClick={(e) => deleteSession(session.id, e)}
              style={{ background: 'none', border: 'none', color: '#8e8ea0', cursor: 'pointer' }}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;