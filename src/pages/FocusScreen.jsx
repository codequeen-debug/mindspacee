import { useStore } from '../store/store'

function DotsIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
}

export default function FocusScreen() {
  const { state, dispatch } = useStore()
  const { focus } = state

  const allDone = focus.savers.every(s => s.done)
  const doneCount = focus.savers.filter(s => s.done).length

  return (
    <div className="focus-screen screen-enter">
      {/* Header */}
      <div className="back-header">
        <button className="icon-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <button className="icon-btn">
          <DotsIcon />
        </button>
      </div>

      <h1 className="focus-title">Morning Focus<br/>Checklist</h1>
      <p className="savers-label">S.A.V.E.R.S</p>
      <p className="savers-sub">To Do List: {doneCount}/{focus.savers.length} complete</p>

      {/* Progress bar */}
      <div style={{ margin: '0 16px 16px', height: 4, background: 'rgba(255,255,255,0.25)', borderRadius: 2 }}>
        <div style={{
          width: `${(doneCount / focus.savers.length) * 100}%`,
          height: '100%',
          background: 'white',
          borderRadius: 2,
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* SAVERS items */}
      {focus.savers.map((saver) => (
        <div
          key={saver.id}
          className="saver-item"
          style={{ cursor: 'pointer', opacity: saver.done ? 0.65 : 1, transition: 'opacity 0.2s' }}
          onClick={() => dispatch({ type: 'TOGGLE_SAVER', id: saver.id })}
        >
          <div className="saver-letter" style={saver.done ? { background: '#5a9a5a' } : {}}>
            {saver.done
              ? <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
              : saver.letter
            }
          </div>
          <div className="saver-content">
            <h3 style={saver.done ? { textDecoration: 'line-through' } : {}}>{saver.title}</h3>
            <p>{saver.desc}</p>
          </div>
        </div>
      ))}

      {/* Completion modal */}
      {focus.showCompletion && (
        <div className="overlay" onClick={() => dispatch({ type: 'FOCUS_CLOSE_COMPLETION' })}>
          <div style={{ margin: '0 16px', marginBottom: 100 }} onClick={e => e.stopPropagation()}>
            <div className="completion-banner">
              <h2>ALL set for today! 🌟</h2>
              <p style={{ fontFamily: 'var(--font-body)', color: '#3a6a3a', marginBottom: 20, fontSize: 14 }}>
                You've completed your morning S.A.V.E.R.S. routine. Amazing work!
              </p>
              <button className="close-btn" onClick={() => dispatch({ type: 'FOCUS_CLOSE_COMPLETION' })}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
