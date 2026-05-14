import { createContext, useContext, useReducer } from 'react'

const today = new Date()

const initialState = {
  activeTab: 'home',

  planner: {
    tasks: [
      { id: 1, title: 'Go to Classes', duration: null, done: false },
      { id: 2, title: 'Study Session', duration: '2hrs', done: false },
      { id: 3, title: 'Take a walk', duration: '20 mins', done: false },
      { id: 4, title: 'Do some self-care & EAT', duration: '1-2 hrs', done: false },
      { id: 5, title: 'Go to Gym', duration: '1 hr', done: false },
    ],
    selectedDate: today,
    currentMonth: today.getMonth(),
    currentYear: today.getFullYear(),
    sortBy: 'Entry Date',
    showMenu: false,
    showAddTask: false,
  },

  focus: {
    savers: [
      { id: 's', letter: 'S', title: 'Silence', desc: '1–2 minutes of stillness or breathing.', done: false },
      { id: 'a', letter: 'A', title: 'Affirmations', desc: 'Repeat 1 positive intention for today.', done: false },
      { id: 'v', letter: 'V', title: 'Visualization', desc: 'Picture your ideal outcome for the day.', done: false },
      { id: 'e', letter: 'E', title: 'Exercise', desc: 'Move your body for at least 2 minutes.', done: false },
      { id: 'r', letter: 'R', title: 'Reading', desc: 'Read 1 page or reflection prompt.', done: false },
      { id: 'sc', letter: 'S', title: 'Scribing', desc: 'Write a quick thought or gratitude.', done: false },
    ],
    showCompletion: false,
  },

  journal: {
    entries: [
      {
        id: 1,
        date: 'Nov 12, 2025',
        text: 'Today was a good day. I felt really productive and managed to complete most of my tasks.',
      },
      {
        id: 2,
        date: 'Nov 11, 2025',
        text: 'Had a rough morning but turned it around by going for a walk in the afternoon.',
      },
    ],
    currentText: '',
    sortBy: 'Entry Date',
    showMenu: false,
    locked: false,
  },
}

function reducer(state, action) {
  switch (action.type) {

    // ✅ NAVIGATION FIX (CRITICAL)
    case 'SET_TAB':
      return {
        ...state,
        activeTab: action.tab,
      }

    // ================= PLANNER =================
    case 'TOGGLE_TASK':
      return {
        ...state,
        planner: {
          ...state.planner,
          tasks: state.planner.tasks.map((t) =>
            t.id === action.id ? { ...t, done: !t.done } : t
          ),
        },
      }

    case 'ADD_TASK':
      return {
        ...state,
        planner: {
          ...state.planner,
          tasks: [
            ...state.planner.tasks,
            {
              id: Date.now(),
              title: action.title,
              duration: action.duration || null,
              done: false,
            },
          ],
          showAddTask: false,
        },
      }

    case 'DELETE_TASK':
      return {
        ...state,
        planner: {
          ...state.planner,
          tasks: state.planner.tasks.filter((t) => t.id !== action.id),
          showMenu: false,
        },
      }

    case 'PLANNER_PREV_MONTH': {
      let m = state.planner.currentMonth - 1
      let y = state.planner.currentYear
      if (m < 0) {
        m = 11
        y--
      }
      return {
        ...state,
        planner: { ...state.planner, currentMonth: m, currentYear: y },
      }
    }

    case 'PLANNER_NEXT_MONTH': {
      let m = state.planner.currentMonth + 1
      let y = state.planner.currentYear
      if (m > 11) {
        m = 0
        y++
      }
      return {
        ...state,
        planner: { ...state.planner, currentMonth: m, currentYear: y },
      }
    }

    case 'PLANNER_SELECT_DATE':
      return {
        ...state,
        planner: { ...state.planner, selectedDate: action.date },
      }

    case 'PLANNER_SHOW_MENU':
      return {
        ...state,
        planner: { ...state.planner, showMenu: action.val },
      }

    case 'PLANNER_SHOW_ADD':
      return {
        ...state,
        planner: { ...state.planner, showAddTask: action.val },
      }

    case 'PLANNER_SET_SORT':
      return {
        ...state,
        planner: {
          ...state.planner,
          sortBy: action.val,
          showMenu: false,
        },
      }

    // ================= FOCUS =================
    case 'UPDATE_SAVERS':
      return {
        ...state,
        focus: {
          ...state.focus,
          savers: action.savers,
        },
      }

    case 'TOGGLE_SAVER': {
      const savers = state.focus.savers.map((s) =>
        s.id === action.id ? { ...s, done: !s.done } : s
      )

      return {
        ...state,
        focus: {
          ...state.focus,
          savers,
          showCompletion: savers.every((s) => s.done),
        },
      }
    }

    case 'FOCUS_CLOSE_COMPLETION':
      return {
        ...state,
        focus: {
          ...state.focus,
          showCompletion: false,
        },
      }

    // ================= JOURNAL (SAFE + COMPLETE) =================
    case 'JOURNAL_SET_TEXT':
      return {
        ...state,
        journal: {
          ...state.journal,
          currentText: action.text || '',
        },
      }

    case 'JOURNAL_SAVE': {
      if (!state.journal?.currentText?.trim()) return state

      const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        text: state.journal.currentText,
      }

      return {
        ...state,
        journal: {
          ...state.journal,
          entries: [entry, ...state.journal.entries],
          currentText: '',
        },
      }
    }

    case 'JOURNAL_DELETE_ENTRY':
      return {
        ...state,
        journal: {
          ...state.journal,
          entries: state.journal.entries.filter((e) => e.id !== action.id),
          showMenu: false,
        },
      }

    case 'JOURNAL_SHOW_MENU':
      return {
        ...state,
        journal: {
          ...state.journal,
          showMenu: action.val,
        },
      }

    case 'JOURNAL_SET_SORT':
      return {
        ...state,
        journal: {
          ...state.journal,
          sortBy: action.val,
          showMenu: false,
        },
      }

    case 'JOURNAL_TOGGLE_LOCK':
      return {
        ...state,
        journal: {
          ...state.journal,
          locked: !state.journal.locked,
          showMenu: false,
        },
      }

    default:
      return state
  }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}