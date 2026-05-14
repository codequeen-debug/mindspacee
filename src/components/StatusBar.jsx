export default function StatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <div className="status-icons">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <rect x="0" y="4" width="3" height="8" rx="1" opacity="0.4"/>
          <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" opacity="0.6"/>
          <rect x="9" y="1" width="3" height="11" rx="1" opacity="0.8"/>
          <rect x="13.5" y="0" width="3" height="12" rx="1"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 2.4C10.5 2.4 12.7 3.4 14.2 5.1L15.5 3.7C13.6 1.6 11 0.4 8 0.4C5 0.4 2.4 1.6 0.5 3.7L1.8 5.1C3.3 3.4 5.5 2.4 8 2.4Z" opacity="0.4"/>
          <path d="M8 5.2C9.8 5.2 11.4 5.9 12.6 7.1L13.9 5.7C12.3 4.2 10.3 3.2 8 3.2C5.7 3.2 3.7 4.2 2.1 5.7L3.4 7.1C4.6 5.9 6.2 5.2 8 5.2Z" opacity="0.7"/>
          <path d="M8 8C9.1 8 10.1 8.4 10.8 9.1L12.1 7.7C11 6.7 9.6 6 8 6C6.4 6 5 6.7 3.9 7.7L5.2 9.1C5.9 8.4 6.9 8 8 8Z"/>
          <circle cx="8" cy="11" r="1.2"/>
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
          <rect x="0" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.35"/>
          <rect x="22" y="3.5" width="2" height="5" rx="1" opacity="0.4"/>
          <rect x="1.5" y="2" width="18" height="8" rx="2" fill="currentColor"/>
        </svg>
      </div>
    </div>
  )
}
