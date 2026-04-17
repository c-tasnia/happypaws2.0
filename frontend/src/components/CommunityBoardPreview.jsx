import { useState, useEffect } from 'react'

const TEAL = '#1a6b5c'

const COLORS = [
  { bg: '#c2f1ea', accent: '#1a6b5c' },
  { bg: '#f8ecce', accent: '#d4a017' },
  { bg: '#fdf0f0', accent: '#c0392b' },
  { bg: '#e0e9ff', accent: '#3b5bdb' },
  { bg: '#dfd4fc', accent: '#7048e8' },
  { bg: '#cef5d8', accent: '#2f9e44' },
]

// Dummy data
const STATIC_MESSAGES = [
  { _id: '1', name: 'Bhumika D.', message: 'So happy to support such a wonderful cause. These animals deserve all the love!', createdAt: new Date() },
  { _id: '2', name: 'Anonymous', message: 'Keep up the amazing work. Every little paw deserves a warm home.', createdAt: new Date() },
  { _id: '3', name: 'Towhid S.', message: 'Donated in memory of my childhood cat. Love what you do for street animals!', createdAt: new Date() },
  { _id: '4', name: 'Priya M.', message: 'Found my best friend through Happy Paws. Forever grateful 🐱', createdAt: new Date() },
  { _id: '5', name: 'Anonymous', message: 'Small donation, big heart. Hope it helps even one animal find a home.', createdAt: new Date() },
  { _id: '6', name: 'Tasnia C.', message: 'Proud to be part of this community. Bangladesh needs more orgs like this!', createdAt: new Date() },
]

const CommunityBoardPreview = () => {
  const [messages, setMessages] = useState(STATIC_MESSAGES)
  const [visible, setVisible] = useState([0, 1, 2])
  const [animating, setAnimating] = useState(false)

  
  useEffect(() => {
    fetch('http://localhost:5000/api/comments')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setMessages(data)
      })
      .catch(() => {}) 
  }, [])


  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setVisible(prev => {
          const next = prev.map(i => (i + 3) % messages.length)
          return next
        })
        setAnimating(false)
      }, 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [messages])

  const getInitials = (name) => {
    if (name === 'Anonymous') return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div>
      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem',
      }}>
        {visible.map((msgIndex, i) => {
          const msg = messages[msgIndex % messages.length]
          const color = COLORS[msgIndex % COLORS.length]
          return (
            <div key={msg._id + i} style={{
              background: color.bg,
              borderRadius: '14px',
              padding: '1.5rem',
              position: 'relative',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(8px)' : 'translateY(0)',
              border: `1px solid ${color.accent}22`,
            }}>
              {/* Quote mark */}
              <span style={{
                fontSize: '4rem', color: color.accent,
                opacity: 0.15, position: 'absolute',
                top: '0.5rem', left: '1rem',
                fontFamily: 'Georgia, serif', lineHeight: 1,
              }}>"</span>

              {/* Message */}
              <p style={{
                fontSize: '14px', color: '#444', lineHeight: 1.8,
                margin: '1rem 0 1.25rem', position: 'relative', zIndex: 1,
                fontStyle: 'italic',
              }}>
                "{msg.message}"
              </p>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Avatar */}
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: color.accent, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '700', flexShrink: 0,
                }}>
                  {getInitials(msg.name)}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#333' }}>
                    {msg.name}
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#aaa' }}>
                    {timeAgo(msg.createdAt)}
                  </p>
                </div>
                {/* Paw badge */}
                <span style={{
                  marginLeft: 'auto', fontSize: '18px',
                }}>🐾</span>
              </div>

              {msg.amount && (
                <div style={{
                  marginTop: '0.75rem', paddingTop: '0.75rem',
                  borderTop: `1px solid ${color.accent}33`,
                  fontSize: '12px', fontWeight: '700', color: color.accent,
                }}>
                  Donated ৳{msg.amount.toLocaleString()}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Dots indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '2rem' }}>
        {messages.map((_, i) => (
          <div key={i} style={{
            width: visible.includes(i) ? '20px' : '6px',
            height: '6px',
            borderRadius: '3px',
            background: visible.includes(i) ? TEAL : '#ddd',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center' }}>
        <a href="/donations" style={{
          display: 'inline-block', padding: '11px 28px', borderRadius: '8px',
          border: `1.5px solid ${TEAL}`, color: TEAL, textDecoration: 'none',
          fontSize: '14px', fontWeight: '600',
        }}>
          Leave Your Paw Print →
        </a>
      </div>
    </div>
  )
}

export default CommunityBoardPreview