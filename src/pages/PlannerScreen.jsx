import { useState } from 'react'
import { useStore } from '../store/store'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Sun','Mon','Tues','Wed','Thu','Fri','Sat']
const today = new Date()

function buildCalendarDays(month, year) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()
  const days = []

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrev - i, currentMonth: false, date: new Date(year, month - 1, daysInPrev - i) })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, currentMonth: true, date: new Date(year, month, d) })
  }
  const remaining = 42 - days.length
  for (let d = 1; d <= remaining; d++) {
    days.push({ day: d, currentMonth: false, date: new Date(year, month + 1, d) })
  }
  return days
}

function isToday(date) {
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
}

function ChevronLeft() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M15 18l-6-6 6-6"/></svg>
}
function ChevronRight() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M9 18l6-6-6-6"/></svg>
}
function DotsIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
}
function SortIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
}
function CalIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
}
function TrashIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
}
function CheckIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
}

export default function PlannerScreen() {
  const { state, dispatch } = useStore()
  const { planner } = state
  const [newTitle, setNewTitle] = useState('')
  const [newDuration, setNewDuration] = useState('')
  const [menuTarget, setMenuTarget] = useState(null)

  const days = buildCalendarDays(planner.currentMonth, planner.currentYear)

  function handleTaskRightClick(e, taskId) {
    e.preventDefault()
    setMenuTarget(taskId)
    dispatch({ type: 'PLANNER_SHOW_MENU', val: true })
  }

  function handleAddTask() {
    if (!newTitle.trim()) return
    dispatch({ type: 'ADD_TASK', title: newTitle.trim(), duration: newDuration.trim() })
    setNewTitle('')
    setNewDuration('')
  }

  return (
    <div className="planner-screen screen-enter">
      {/* Header */}
      <div className="page-header">
        <h1>Daily Planner</h1>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => dispatch({ type: 'PLANNER_SHOW_MENU', val: true })}>
            <DotsIcon />
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="calendar-card">
        <div className="calendar-nav">
          <button className="cal-nav-btn" onClick={() => dispatch({ type: 'PLANNER_PREV_MONTH' })}>
            <ChevronLeft />
          </button>
          <div className="calendar-month">
            {MONTHS[planner.currentMonth]}
            <span className="calendar-year">{planner.currentYear}</span>
          </div>
          <button className="cal-nav-btn" onClick={() => dispatch({ type: 'PLANNER_NEXT_MONTH' })}>
            <ChevronRight />
          </button>
        </div>
        <div className="calendar-grid">
          {DAYS.map(d => <div key={d} className="cal-day-header">{d}</div>)}
          {days.map((d, i) => (
            <div
              key={i}
              className={`cal-day ${!d.currentMonth ? 'other-month' : ''} ${isToday(d.date) ? 'today' : ''}`}
              onClick={() => dispatch({ type: 'PLANNER_SELECT_DATE', date: d.date })}
            >
              {d.day}
            </div>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="tasks-section">
        {planner.tasks.map(task => (
          <div
            key={task.id}
            className="task-item"
            onContextMenu={(e) => handleTaskRightClick(e, task.id)}
          >
            <div
              className={`task-checkbox ${task.done ? 'checked' : ''}`}
              onClick={() => dispatch({ type: 'TOGGLE_TASK', id: task.id })}
            />
            <div className="task-content">
              <span className="task-title" style={task.done ? { textDecoration: 'line-through', opacity: 0.5 } : {}}>
                {task.title}
              </span>
              {task.duration && <span className="task-duration">{task.duration}</span>}
            </div>
          </div>
        ))}

        {/* Add task */}
        <div className="add-task-bar" onClick={() => dispatch({ type: 'PLANNER_SHOW_ADD', val: true })}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add a task
        </div>
      </div>

      {/* Context Menu */}
      {planner.showMenu && (
        <div className="overlay" onClick={() => dispatch({ type: 'PLANNER_SHOW_MENU', val: false })}>
          <div className="context-menu" onClick={e => e.stopPropagation()}>
            {/* Sort */}
            <button className="context-item expandable">
              <div className="context-item-label-wrap">
                <span className="context-item-label">Sort By</span>
                <span className="context-sublabel">{planner.sortBy}</span>
              </div>
              <SortIcon />
            </button>
            <button className="context-item" style={{ paddingLeft: 32 }} onClick={() => dispatch({ type: 'PLANNER_SET_SORT', val: 'Entry Date' })}>
              <div className="sort-option">
                <div className="sort-check">{planner.sortBy === 'Entry Date' && <CheckIcon />}</div>
                <span className="context-item-label" style={{ fontSize: 15 }}>Entry Date</span>
              </div>
            </button>
            <button className="context-item" style={{ paddingLeft: 32 }} onClick={() => dispatch({ type: 'PLANNER_SET_SORT', val: 'Moment Date' })}>
              <div className="sort-option">
                <div className="sort-check">{planner.sortBy === 'Moment Date' && <CheckIcon />}</div>
                <span className="context-item-label" style={{ fontSize: 15 }}>Moment Date</span>
              </div>
            </button>
            {/* Edit */}
            <button className="context-item">
              <span className="context-item-label">Edit Tasks</span>
              <CalIcon />
            </button>
            {/* Delete */}
            <button className="context-item danger" onClick={() => {
              if (menuTarget) dispatch({ type: 'DELETE_TASK', id: menuTarget })
              else if (planner.tasks.length > 0) dispatch({ type: 'DELETE_TASK', id: planner.tasks[planner.tasks.length - 1].id })
            }}>
              <span className="context-item-label">Delete Task</span>
              <TrashIcon />
            </button>
          </div>
        </div>
      )}

      {/* Add Task Sheet */}
      {planner.showAddTask && (
        <div className="add-modal" onClick={() => dispatch({ type: 'PLANNER_SHOW_ADD', val: false })}>
          <div className="add-modal-sheet" onClick={e => e.stopPropagation()}>
            <h3>New Task</h3>
            <input
              className="modal-input"
              placeholder="Task name"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleAddTask()}
            />
            <input
              className="modal-input"
              placeholder="Duration (optional, e.g. 30 mins)"
              value={newDuration}
              onChange={e => setNewDuration(e.target.value)}
            />
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => dispatch({ type: 'PLANNER_SHOW_ADD', val: false })}>
                Cancel
              </button>
              <button className="modal-btn confirm" onClick={handleAddTask}>
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
