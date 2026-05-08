import { useStore } from './store/store'
import StatusBar from './components/StatusBar'
import BottomNav from './components/BottomNav'
import HomeScreen from './pages/HomeScreen'
import PlannerScreen from './pages/PlannerScreen'
import FocusScreen from './pages/FocusScreen'
import JournalScreen from './pages/JournalScreen'

function Screen() {
  const { state } = useStore()
  switch (state.activeTab) {
    case 'home': return <HomeScreen />
    case 'planner': return <PlannerScreen />
    case 'focus': return <FocusScreen />
    case 'journal': return <JournalScreen />
    default: return <HomeScreen />
  }
}

export default function App() {
  return (
    <div className="phone-shell">
      <StatusBar />
      <div className="screen">
        <Screen />
      </div>
      <BottomNav />
    </div>
  )
}
