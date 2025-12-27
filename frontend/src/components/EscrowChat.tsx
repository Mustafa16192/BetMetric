import { useEffect, useRef, useState } from 'react'

type Message = {
  id: string
  role: 'user' | 'ai'
  text: string
}

const initialMessages: Message[] = [
  {
    id: 'm1',
    role: 'ai',
    text: 'Escrow Agent is in read-only standby. Connect the ledger to enable answers.'
  }
]

export default function EscrowChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setThinking(true)

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'ai',
          text: 'No live data connection yet. Enable the Escrow Agent to query the ledger.'
        }
      ])
      setThinking(false)
    }, 650)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`flex h-14 w-14 items-center justify-center rounded-full bg-ai-flow shadow-glow-ai ${
            thinking ? 'animate-pulse-ai' : ''
          }`}
          aria-label="Open Escrow Agent"
        >
          <span className="text-sm font-semibold text-text-primary">AI</span>
        </button>
      )}

      {open && (
        <div className="surface-card--raised w-80 border border-border-subtle p-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">
                Escrow Agent
              </p>
              <p className="text-sm font-semibold text-text-primary">
                Read-only audit mode
              </p>
            </div>
            <button
              type="button"
              className="ghost-button"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>

          <div
            ref={scrollRef}
            className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-2 text-sm"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-md px-3 py-2 ${
                  message.role === 'ai'
                    ? 'bg-surface-100 text-text-secondary'
                    : 'bg-surface-200 text-text-primary'
                }`}
              >
                <p>{message.text}</p>
              </div>
            ))}
            {thinking && (
              <div className="rounded-md bg-surface-100 px-3 py-2 text-text-tertiary">
                Escrow Agent is analyzing...
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about burn, ROI, or zombies"
              className="input-field"
            />
            <button
              type="button"
              onClick={handleSend}
              className="rounded-md bg-ai-flow px-3 text-sm font-semibold text-void"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
