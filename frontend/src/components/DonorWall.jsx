import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { auth } from '../firebase/firebase.config'

const TEAL = '#1a6b5c'

const DonorWall = () => {
  const { currentUser } = useAuth()
  const [comments, setComments] = useState([])
  const [message, setMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch comments
  useEffect(() => {
    fetch('http://localhost:5000/api/comments')
      .then(res => res.json())
      .then(data => setComments(data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)

    try {
      // Get token if logged in
      let headers = { 'Content-Type': 'application/json' }
      if (currentUser) {
        const token = await auth.currentUser.getIdToken()
        headers.Authorization = `Bearer ${token}`
      }

      const res = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message, isAnonymous }),
      })

      const newComment = await res.json()
      setComments([newComment, ...comments])
      setMessage('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    return `${Math.floor(diff / 86400)} days ago`
  }

  return (
    
  <section style={{ padding: '3rem 1rem', background: '#e0efef' }}>
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

      {/* Section Title */}
      <p style={{
        fontSize: '11px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: '#1a6b5c',
        marginBottom: '0.4rem'
      }}>
        Community
      </p>

      <h2 style={{
        fontSize: '1.8rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#222'
      }}>
        Community Chats
      </h2>

      {/* Form */}
      <div style={{
        background: '#fff',
        border: '1px solid #e3e6e8',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '0.5rem',
          color: '#232629'
        }}>
          Leave a comment
        </h3>

        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Add a message..."
            required
            style={{
              width: '100%',   // ✅ FULL WIDTH
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #d6d9dc',
              borderRadius: '6px',
              outline: 'none',
              resize: 'vertical',
              minHeight: '90px',
              fontFamily: 'system-ui',
              boxSizing: 'border-box',
              marginBottom: '0.5rem'
            }}
          />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <label style={{ fontSize: '13px', color: '#555' }}>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={e => setIsAnonymous(e.target.checked)}
                style={{ marginRight: '6px' }}
              />
              Anonymous
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '8px 16px',
                background: loading ? '#9fa6ad' : '#0a95ff',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>

      {/* Comments */}
      <div>
        {comments.length === 0 && (
          <p style={{ color: '#6a737c', fontSize: '14px' }}>
            No messages yet.
          </p>
        )}

        {comments.map(c => (
          <div key={c._id} style={{
            borderBottom: '1px solid #e3e6e8',
            padding: '1rem 0'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.4rem'
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#0074cc'
              }}>
                {c.name || 'Anonymous'}
              </span>

              <span style={{
                fontSize: '12px',
                color: '#6a737c'
              }}>
                {timeAgo(c.createdAt)}
              </span>
            </div>

            <p style={{
              fontSize: '14px',
              color: '#232629',
              margin: 0,
              lineHeight: '1.6'
            }}>
              {c.message}
            </p>

            {c.amount && (
              <div style={{
                fontSize: '12px',
                color: '#2f6f44',
                marginTop: '6px'
              }}>
                Donated ৳{c.amount.toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  </section>

  )
}

export default DonorWall
