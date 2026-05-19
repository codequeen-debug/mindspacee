import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useStore } from '../store/store'

// ─────────────────────────────────────────────────────────────
// OpenRouter API Key
// ─────────────────────────────────────────────────────────────

const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

console.log('OpenRouter Key Loaded:', !!OPENROUTER_KEY)

// ─────────────────────────────────────────────────────────────
// AI System Prompt
// ─────────────────────────────────────────────────────────────

const THERAPIST_SYSTEM = `
You are Sage, a warm and compassionate AI wellness companion.

Guidelines:
- Respond with empathy and emotional support
- Keep responses concise (2-4 sentences)
- Ask gentle follow-up questions
- Never diagnose medical conditions
- Encourage professional support for serious mental health concerns
- Sound calm, supportive, and natural
`

// ─────────────────────────────────────────────────────────────
// Default Greeting
// ─────────────────────────────────────────────────────────────

const createGreeting = () => ({
  role: 'sage',
  text: "Hi there 🌿 I'm Sage, your wellness companion. How are you feeling today? I'm here to listen.",
  time: new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }),
})

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
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
  )
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function ChatScreen() {
  const { currentUser } = useAuth()
  const { dispatch } = useStore()

  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef(null)

  // ───────────────────────────────────────────────────────────
  // User Storage Key
  // ───────────────────────────────────────────────────────────

  const storageKey = currentUser?.uid
    ? `sage_chat_${currentUser.uid}`
    : null

  // ───────────────────────────────────────────────────────────
  // Load Saved Chat
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!storageKey) return

    try {
      const savedChat =
        localStorage.getItem(storageKey)

      if (savedChat) {
        const parsed = JSON.parse(savedChat)

        if (
          Array.isArray(parsed) &&
          parsed.length > 0
        ) {
          setMessages(parsed)
          return
        }
      }

      setMessages([createGreeting()])
    } catch (err) {
      console.error(
        'Failed loading saved chat:',
        err
      )

      setMessages([createGreeting()])
    }
  }, [storageKey])

  // ───────────────────────────────────────────────────────────
  // Save Chat Automatically
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!storageKey) return

    if (!messages.length) return

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(messages)
      )

      console.log(
        'Chat saved:',
        storageKey
      )
    } catch (err) {
      console.error(
        'Failed saving chat:',
        err
      )
    }
  }, [messages, storageKey])

  // ───────────────────────────────────────────────────────────
  // Auto Scroll
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, loading])

  // ───────────────────────────────────────────────────────────
  // Clear Chat
  // ───────────────────────────────────────────────────────────

  function clearChat() {
    if (!storageKey) return

    localStorage.removeItem(storageKey)

    setMessages([
      {
        role: 'sage',
        text:
          "Your chat has been cleared 🌿 I'm here whenever you'd like to talk again.",
        time: new Date().toLocaleTimeString(
          'en-US',
          {
            hour: '2-digit',
            minute: '2-digit',
          }
        ),
      },
    ])
  }

  // ───────────────────────────────────────────────────────────
  // Send Message
  // ───────────────────────────────────────────────────────────

  async function handleSend() {
    if (!text.trim() || loading) return

    if (!OPENROUTER_KEY) {
      alert(
        'Missing OpenRouter API key.'
      )
      return
    }

    const userText = text.trim()

    const userMessage = {
      role: 'user',
      text: userText,
      time: new Date().toLocaleTimeString(
        'en-US',
        {
          hour: '2-digit',
          minute: '2-digit',
        }
      ),
    }

    const updatedMessages = [
      ...messages,
      userMessage,
    ]

    setMessages(updatedMessages)

    setText('')
    setLoading(true)

    try {
      // Convert UI messages into AI messages
      const apiMessages = [
        {
          role: 'system',
          content: THERAPIST_SYSTEM,
        },

        ...updatedMessages.map(msg => ({
          role:
            msg.role === 'sage'
              ? 'assistant'
              : 'user',

          content: msg.text,
        })),
      ]

      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',

          headers: {
            Authorization: `Bearer ${OPENROUTER_KEY}`,
            'Content-Type':
              'application/json',

            'HTTP-Referer':
              window.location.origin,

            'X-Title':
              'MindSpace Wellness App',
          },

          body: JSON.stringify({
            model:
              'openai/gpt-3.5-turbo',

            messages: apiMessages,

            temperature: 0.7,

            max_tokens: 150,
          }),
        }
      )

      const data = await response.json()

      console.log(
        'OpenRouter Response:',
        data
      )

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            'Failed to connect to Sage.'
        )
      }

      const reply =
        data?.choices?.[0]?.message
          ?.content

      if (!reply) {
        throw new Error(
          'No response received.'
        )
      }

      const sageMessage = {
        role: 'sage',
        text: reply.trim(),
        time: new Date().toLocaleTimeString(
          'en-US',
          {
            hour: '2-digit',
            minute: '2-digit',
          }
        ),
      }

      setMessages(prev => [
        ...prev,
        sageMessage,
      ])
    } catch (err) {
      console.error('Chat Error:', err)

      const errorMessage = {
        role: 'sage',
        text:
          err.message ||
          'Something went wrong connecting to Sage.',
        time: new Date().toLocaleTimeString(
          'en-US',
          {
            hour: '2-digit',
            minute: '2-digit',
          }
        ),
      }

      setMessages(prev => [
        ...prev,
        errorMessage,
      ])
    } finally {
      setLoading(false)
    }
  }

  // ───────────────────────────────────────────────────────────
  // UI
  // ───────────────────────────────────────────────────────────

  return (
    <div className="chat-screen screen-enter">
      <style>{`
        .chat-screen {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 16px 14px 0;
          background: linear-gradient(160deg, #e8f4ff 0%, #f4f9ff 100%);
        }

        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4px 14px;
        }

        .chat-header-center {
          text-align: center;
        }

        .chat-title {
          font-size: 22px;
          font-weight: 800;
          line-height: 1.1;
          color: #1a4d7a;
        }

        .chat-subtitle {
          color: rgba(13, 45, 69, 0.75);
          font-size: 13px;
          margin-top: 4px;
        }

        .chat-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .clear-btn {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          border: none;
          background: rgba(255,255,255,0.8);
          color: #1a4d7a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .chat-sage-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(200,225,245,0.6);
          border-radius: 16px;
          padding: 10px 14px;
          margin-bottom: 14px;
        }

        .chat-sage-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #5ba8d4, #2a6fa8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .chat-sage-name {
          font-size: 14px;
          font-weight: 800;
          color: #1a4d7a;
        }

        .chat-sage-status {
          font-size: 11px;
          color: #5a94c0;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .chat-sage-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4caf7d;
          display: inline-block;
        }

        .chat-box {
          flex: 1;
          overflow-y: auto;
          padding-right: 4px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .chat-bubble-wrap {
          display: flex;
          flex-direction: column;
        }

        .chat-bubble-wrap.user {
          align-items: flex-end;
        }

        .chat-bubble-wrap.sage {
          align-items: flex-start;
        }

        .chat-role-tag {
          font-size: 10px;
          font-weight: 700;
          color: #5a94c0;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0 4px;
          margin-bottom: 3px;
        }

        .chat-bubble {
          max-width: 80%;
          padding: 10px 14px;
          font-size: 13.5px;
          line-height: 1.5;
          border-radius: 18px;
          word-break: break-word;
        }

        .chat-bubble.user {
          background: linear-gradient(135deg, #2a6fa8, #1a4d7a);
          color: white;
          border-bottom-right-radius: 5px;
        }

        .chat-bubble.sage {
          background: rgba(255,255,255,0.92);
          color: #1a3d5c;
          border-bottom-left-radius: 5px;
          border: 1px solid rgba(200,225,245,0.7);
        }

        .chat-time {
          font-size: 10px;
          color: #8ab4cc;
          margin-top: 3px;
          padding: 0 4px;
        }

        .chat-typing {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(200,225,245,0.7);
          border-radius: 18px;
          border-bottom-left-radius: 5px;
          width: fit-content;
        }

        .chat-typing span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #5a94c0;
          display: inline-block;
          animation: typing-bounce 1.2s infinite;
        }

        .chat-typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .chat-typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing-bounce {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }

          30% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }

        .chat-input-row {
          display: flex;
          gap: 10px;
          align-items: center;
          padding: 12px 0 24px;
        }

        .chat-input {
          flex: 1;
          border: 1.5px solid rgba(200,225,245,0.8);
          border-radius: 22px;
          padding: 12px 16px;
          font-size: 14px;
          outline: none;
          background: rgba(255,255,255,0.9);
          color: #1a3d5c;
          font-family: inherit;
        }

        .chat-send {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #2a6fa8, #1a4d7a);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .chat-send:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
      `}</style>

      {/* Header */}
      <div className="chat-header">
        <button
          className="icon-btn"
          onClick={() =>
            dispatch({
              type: 'SET_TAB',
              tab: 'home',
            })
          }
        >
          <ArrowLeftIcon />
        </button>

        <div className="chat-header-center">
          <div className="chat-title">
            Wellness Chat
          </div>

          <div className="chat-subtitle">
            AI-powered support, anytime
          </div>
        </div>

        <div className="chat-actions">
          <button
            className="clear-btn"
            onClick={clearChat}
            title="Clear chat"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Sage Bar */}
      <div className="chat-sage-bar">
        <div className="chat-sage-avatar">
          🌿
        </div>

        <div>
          <div className="chat-sage-name">
            Sage
          </div>

          <div className="chat-sage-status">
            <span className="chat-sage-dot" />
            AI Wellness Companion
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble-wrap ${msg.role}`}
          >
            <div className="chat-role-tag">
              {msg.role === 'user'
                ? 'You'
                : 'Sage'}
            </div>

            <div
              className={`chat-bubble ${msg.role}`}
            >
              {msg.text}
            </div>

            <div className="chat-time">
              {msg.time}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-bubble-wrap sage">
            <div className="chat-role-tag">
              Sage
            </div>

            <div className="chat-typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="Share what's on your mind..."
          value={text}
          onChange={e =>
            setText(e.target.value)
          }
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSend()
            }
          }}
        />

        <button
          className="chat-send"
          onClick={handleSend}
          disabled={!text.trim() || loading}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  )
}