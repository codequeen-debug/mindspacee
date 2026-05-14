import { useStore } from '../store/store'

function DotsIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
}
function SunIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/></svg>
}
function SortIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
}
function LockIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
}
function TrashIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
}
function CheckIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
}

export default function JournalScreen() {
  const { state, dispatch } = useStore()
  const { journal } = state

  return (
    <div className="journal-screen screen-enter">
      {/* Header */}
      <div className="back-header">
        <button className="icon-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <button className="icon-btn" onClick={() => dispatch({ type: 'JOURNAL_SHOW_MENU', val: true })}>
          <DotsIcon />
        </button>
      </div>

      <h1 className="journal-title">Reflection<br/>Journal</h1>

      <div className="journal-prompt">
        <span>How are you feeling today?</span>
        <SunIcon />
      </div>

      {/* Textarea */}
      <textarea
        className="journal-textarea"
        placeholder="Type here"
        value={journal.currentText}
        onChange={e => dispatch({ type: 'JOURNAL_SET_TEXT', text: e.target.value })}
        disabled={journal.locked}
      />

      {/* Save button */}
      {journal.currentText.trim().length > 0 && (
        <div style={{ padding: '10px 16px 0' }}>
          <button
            style={{
              width: '100%',
              padding: '13px',
              background: 'var(--accent-calendar)',
              color: 'white',
              border: 'none',
              borderRadius: 14,
              fontFamily: 'var(--font-display)',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.15s',
            }}
            onClick={() => dispatch({ type: 'JOURNAL_SAVE' })}
          >
            Save Entry
          </button>
        </div>
      )}

      {/* Break banner */}
      <div className="break-banner">
        <span className="moon-icon">🌙</span>
        <span className="break-text">Remember to take breaks</span>
        <span className="moon-icon">🌙</span>
      </div>

      {/* Past entries */}
      {journal.entries.length > 0 && (
        <div className="journal-entries">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>
            Past Entries
          </p>
          {journal.entries.map(entry => (
            <div key={entry.id} className="journal-entry-card">
              <div className="entry-date">{entry.date}</div>
              <div className="entry-preview">{entry.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* Context menu */}
      {journal.showMenu && (
        <div className="overlay" onClick={() => dispatch({ type: 'JOURNAL_SHOW_MENU', val: false })}>
          <div className="context-menu" onClick={e => e.stopPropagation()}>
            {/* Sort */}
            <button className="context-item expandable">
              <div className="context-item-label-wrap">
                <span className="context-item-label">Sort By</span>
                <span className="context-sublabel">{journal.sortBy}</span>
              </div>
              <SortIcon />
            </button>
            <button className="context-item" style={{ paddingLeft: 32 }} onClick={() => dispatch({ type: 'JOURNAL_SET_SORT', val: 'Entry Date' })}>
              <div className="sort-option">
                <div className="sort-check">{journal.sortBy === 'Entry Date' && <CheckIcon />}</div>
                <span className="context-item-label" style={{ fontSize: 15 }}>Entry Date</span>
              </div>
            </button>
            <button className="context-item" style={{ paddingLeft: 32 }} onClick={() => dispatch({ type: 'JOURNAL_SET_SORT', val: 'Moment Date' })}>
              <div className="sort-option">
                <div className="sort-check">{journal.sortBy === 'Moment Date' && <CheckIcon />}</div>
                <span className="context-item-label" style={{ fontSize: 15 }}>Moment Date</span>
              </div>
            </button>
            {/* Lock */}
            <button className="context-item" onClick={() => dispatch({ type: 'JOURNAL_TOGGLE_LOCK' })}>
              <span className="context-item-label">{journal.locked ? 'Unlock Journal' : 'Lock Journal'}</span>
              <LockIcon />
            </button>
            {/* Delete */}
            <button className="context-item danger" onClick={() => {
              if (journal.entries.length > 0) {
                dispatch({ type: 'JOURNAL_DELETE_ENTRY', id: journal.entries[0].id })
              } else {
                dispatch({ type: 'JOURNAL_SHOW_MENU', val: false })
              }
            }}>
              <span className="context-item-label">Delete An Entry</span>
              <TrashIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
