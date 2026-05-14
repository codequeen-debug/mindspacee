import { useState, useEffect } from 'react'
import { useStore } from '../store/store'

function DotsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  )
}

export default function FocusScreen() {
  const { state, dispatch } = useStore()
  const { focus } = state

  const [showEditor, setShowEditor] = useState(false)
  const [editedSavers, setEditedSavers] = useState([])

  const doneCount = focus.savers.filter((s) => s.done).length

  // sync editor when opened
  useEffect(() => {
    if (showEditor) {
      setEditedSavers(focus.savers.map((s) => ({ ...s })))
    }
  }, [showEditor, focus.savers])

  // BACK BUTTON (FIXED)
  const handleBack = () => {
    dispatch({
      type: 'SET_TAB',
      tab: 'home',
    })
  }

  // EDIT UPDATES
  const updateSaver = (id, field, value) => {
    setEditedSavers((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    )
  }

  // SAVE TO STORE
  const saveChanges = () => {
    dispatch({
      type: 'UPDATE_SAVERS',
      savers: editedSavers,
    })
    setShowEditor(false)
  }

  return (
    <div className="focus-screen screen-enter">

      {/* HEADER */}
      <div className="back-header">
        <button className="icon-btn" onClick={handleBack}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="22"
            height="22"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>

        <button className="icon-btn" onClick={() => setShowEditor(true)}>
          <DotsIcon />
        </button>
      </div>

      {/* TITLE */}
      <h1 className="focus-title">
        Morning Focus
        <br />
        Checklist
      </h1>

      <p className="savers-label">S.A.V.E.R.S</p>

      <p className="savers-sub">
        To Do List: {doneCount}/{focus.savers.length} complete
      </p>

      {/* PROGRESS BAR */}
      <div
        style={{
          margin: '0 16px 16px',
          height: 4,
          background: 'rgba(255,255,255,0.25)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${(doneCount / focus.savers.length) * 100}%`,
            height: '100%',
            background: 'white',
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* SAVERS */}
      {focus.savers.map((saver) => (
        <div
          key={saver.id}
          className="saver-item"
          onClick={() =>
            dispatch({
              type: 'TOGGLE_SAVER',
              id: saver.id,
            })
          }
          style={{
            cursor: 'pointer',
            opacity: saver.done ? 0.65 : 1,
            transition: 'all 0.2s ease',
          }}
        >
          <div
            className="saver-letter"
            style={
              saver.done
                ? { background: '#5a9a5a' }
                : {}
            }
          >
            {saver.done ? '✓' : saver.letter}
          </div>

          <div className="saver-content">
            <h3
              style={
                saver.done
                  ? { textDecoration: 'line-through' }
                  : {}
              }
            >
              {saver.title}
            </h3>
            <p>{saver.desc}</p>
          </div>
        </div>
      ))}

      {/* ================= EDIT OVERLAY (IMPROVED UI) ================= */}
      {showEditor && (
        <div
          className="overlay"
          style={{
            backdropFilter: 'blur(8px)',
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setShowEditor(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 420,
              maxHeight: '85vh',
              overflowY: 'auto',
              borderRadius: 24,
              padding: 20,

              background:
                'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(18px)',
              color: 'white',
            }}
          >
            <h2 style={{ marginBottom: 18 }}>Edit SAVERS</h2>

            {editedSavers.map((saver) => (
              <div
                key={saver.id}
                style={{
                  marginBottom: 18,
                  paddingBottom: 16,
                  borderBottom: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <label style={{ fontSize: 12, opacity: 0.8 }}>
                  Title
                </label>

                <input
                  value={saver.title}
                  onChange={(e) =>
                    updateSaver(
                      saver.id,
                      'title',
                      e.target.value
                    )
                  }
                  style={{
                    width: '100%',
                    padding: 10,
                    marginTop: 6,
                    marginBottom: 10,
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.08)',
                    color: 'white',
                  }}
                />

                <label style={{ fontSize: 12, opacity: 0.8 }}>
                  Description
                </label>

                <textarea
                  value={saver.desc}
                  onChange={(e) =>
                    updateSaver(
                      saver.id,
                      'desc',
                      e.target.value
                    )
                  }
                  rows={3}
                  style={{
                    width: '100%',
                    padding: 10,
                    marginTop: 6,
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.08)',
                    color: 'white',
                    resize: 'none',
                  }}
                />
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowEditor(false)}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 14,
                  border: 'none',
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                }}
              >
                Cancel
              </button>

              <button
                onClick={saveChanges}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 14,
                  border: 'none',
                  background: 'white',
                  color: 'black',
                  fontWeight: 600,
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPLETION MODAL (UNCHANGED STYLE) */}
      {focus.showCompletion && (
        <div
          className="overlay"
          onClick={() =>
            dispatch({ type: 'FOCUS_CLOSE_COMPLETION' })
          }
        >
          <div onClick={(e) => e.stopPropagation()}>
            <h2>ALL set for today! 🌟</h2>
            <button
              onClick={() =>
                dispatch({ type: 'FOCUS_CLOSE_COMPLETION' })
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}