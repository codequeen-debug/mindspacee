import { useStore } from '../store/store'

function PlannerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}

function FocusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
    </svg>
  )
}

function JournalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

export default function BottomNav() {
  const { state, dispatch } = useStore()
  const setTab = (tab) => dispatch({ type: 'SET_TAB', tab })

  const tabs = [
    { id: 'planner', label: 'Planner', Icon: PlannerIcon },
    { id: 'focus', label: 'Focus', Icon: FocusIcon },
    { id: 'journal', label: 'Journal', Icon: JournalIcon },
  ]

  return (
    <nav className="bottom-nav">
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`nav-item ${state.activeTab === id || (state.activeTab === 'home' && id === 'planner') ? 'active' : ''}`}
          onClick={() => setTab(id)}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
      <div className="home-indicator" />
    </nav>
  )
}
