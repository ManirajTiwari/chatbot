import { useState } from 'react';

function Sidebar({ sessions, currentSessionId, setCurrentSessionId, createNewChat, deleteSession }) {
  const [hoveredId, setHoveredId] = useState(null);

  const handleDelete = (sessionId, e) => {
    e.stopPropagation(); // Prevents selecting the session when clicking delete
    deleteSession(sessionId, e);
  };

  return (
    <aside 
      style={{ 
        width: '260px', 
        height: '100%',
        backgroundColor: '#202123', 
        color: '#ffffff', 
        padding: '10px', 
        display: 'flex', 
        flexDirection: 'column',
        boxSizing: 'border-box',
        userSelect: 'none',
        flexShrink: 0
      }}
    >
      {/* New Chat Button */}
      <button 
        onClick={createNewChat} 
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px', 
          backgroundColor: '#202123', 
          color: '#ffffff', 
          border: '1px solid #4d4d4f', 
          borderRadius: '6px', 
          cursor: 'pointer', 
          marginBottom: '15px',
          fontSize: '14px',
          fontWeight: 500,
          transition: 'background-color 0.2s ease, border-color 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2b32'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#202123'}
      >
        <span style={{ fontSize: '18px', lineHeight: '1' }}>+</span>
        New chat
      </button>

      {/* Session List */}
      <div 
        style={{ 
          flex: 1, 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          paddingRight: '2px'
        }}
      >
        {sessions.map((session) => {
          const isActive = session.id === currentSessionId;
          const isHovered = hoveredId === session.id;

          return (
            <div
              key={session.id}
              onClick={() => setCurrentSessionId(session.id)}
              onMouseEnter={() => setHoveredId(session.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                backgroundColor: isActive ? '#343541' : isHovered ? '#2a2b32' : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                justifycontent: 'space-between',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px',
                color: isActive ? '#ffffff' : '#c5c5d2',
                transition: 'background-color 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                {/* Chat Bubble Icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                
                <span 
                  style={{ 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    fontWeight: isActive ? 500 : 400
                  }}
                >
                  {session.title || 'New Chat'}
                </span>
              </div>

              {/* Delete Button (visible on hover or active state) */}
              {(isActive || isHovered) && (
                <button 
                  onClick={(e) => handleDelete(session.id, e)}
                  title="Delete chat"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#8e8ea0', 
                    cursor: 'pointer',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#8e8ea0'}
                >
                  {/* Trash Icon */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidebar;