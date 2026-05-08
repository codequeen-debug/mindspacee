import { useStore } from '../store/store'

function BookIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 10 C32 10 18 8 10 14 L10 54 C18 48 32 50 32 50"/>
      <path d="M32 10 C32 10 46 8 54 14 L54 54 C46 48 32 50 32 50"/>
      <line x1="32" y1="10" x2="32" y2="50"/>
    </svg>
  )
}

export default function HomeScreen() {
  const { dispatch } = useStore()

  return (
    <div className="home-screen screen-enter">
      <div className="home-logo-icon">
        <BookIcon />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h2 className="home-title">Start Your Mindfulness Journey</h2>
        <p className="home-subtitle" style={{ marginTop: 8 }}>Tap the plus sign to get started</p>
      </div>
      <button
        className="plus-btn"
        onClick={() => dispatch({ type: 'SET_TAB', tab: 'planner' })}
        aria-label="Get started"
      >
        <svg viewBox="0 0 42 42" fill="none" stroke="#1a2530" strokeWidth="2.5" strokeLinecap="round">
          <line x1="21" y1="8" x2="21" y2="34"/>
          <line x1="8" y1="21" x2="34" y2="21"/>
        </svg>
      </button>
    </div>
  )
}
