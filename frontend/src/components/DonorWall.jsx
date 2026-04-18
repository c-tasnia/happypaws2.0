import { useState, useEffect } from 'react'

const TEAL = '#1a6b5c'

const DonorWall = () => {
  const [comments, setComments] = useState([])
  const [message, setMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [replyText, setReplyText] = useState({})
  const [showReplyBox, setShowReplyBox] = useState({})
  const [likes, setLikes] = useState({})


  useEffect(() => {
    fetch('https://happypaws2-0.vercel.app/api/comments')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch comments');
        return res.json();
      })
      .then(data => setComments(data))
      .catch(err => console.error("Fetch error:", err));
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)

    try {
      const res = await fetch('https://happypaws2-0.vercel.app/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, isAnonymous }),
      })

      if (!res.ok) throw new Error('Network response was not ok');

      const newComment = await res.json()
      setComments([newComment, ...comments])
      setMessage('')
    } catch (err) {
      console.error("Error posting comment:", err)
      alert("Failed to post comment. Please check your connection or CORS policy.");
    } finally {
      setLoading(false)
    }
  }

  const timeAgo = (date) => {
    if (!date) return 'just now'
    const diff = (Date.now() - new Date(date)) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    return `${Math.floor(diff / 86400)} days ago`
  }

  const handleReplySubmit = async (commentId) => {
    const text = replyText[commentId]
    if (!text?.trim()) return

    try {
      const res = await fetch(`http://localhost:5000/api/comments/${commentId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })

      if (!res.ok) throw new Error('Failed to post reply');

      const newReply = await res.json()

      setComments(prev =>
        prev.map(c =>
          c._id === commentId
            ? { ...c, replies: [...(c.replies || []), newReply] }
            : c
        )
      )

      setReplyText(prev => ({ ...prev, [commentId]: '' }))
      setShowReplyBox(prev => ({ ...prev, [commentId]: false }))
    } catch (err) {
      console.error("Error posting reply:", err)
    }
  }

  const handleLike = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${id}/like`, {
        method: 'POST'
      })

      if (!res.ok) throw new Error('Failed to like comment');

      const data = await res.json()

      setComments(prev =>
        prev.map(c =>
          c._id === id ? { ...c, likes: data.likes } : c
        )
      )
    } catch (err) {
      console.error("Error liking comment:", err)
    }
  }

  return (
    <section style={{ padding: '3rem 1rem', background: '#e0efef' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Section Title */}
        <p style={{
          fontSize: '11px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: TEAL,
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
                width: '100%',
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
              
              {/* Top */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.3rem'
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

              {/* Message */}
              <p style={{
                fontSize: '14px',
                margin: 0,
                color: '#232629'
              }}>
                {c.message}
              </p>

              {/* ❤️ Like + Reply */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '6px',
                fontSize: '13px',
                color: '#6a737c',
                cursor: 'pointer'
              }}>
                <span onClick={() => handleLike(c._id)}>
                  ❤️ {c.likes || likes[c._id] || 0}
                </span>

                <span onClick={() =>
                  setShowReplyBox(prev => ({
                    ...prev,
                    [c._id]: !prev[c._id]
                  }))
                }>
                  Reply
                </span>
              </div>

              {/* Reply Input */}
              {showReplyBox[c._id] && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={replyText[c._id] || ''}
                    onChange={(e) =>
                      setReplyText(prev => ({
                        ...prev,
                        [c._id]: e.target.value
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '13px',
                      border: '1px solid #d6d9dc',
                      borderRadius: '6px'
                    }}
                  />

                  <button
                    onClick={() => handleReplySubmit(c._id)}
                    style={{
                      marginTop: '5px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      background: '#0a95ff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Reply
                  </button>
                </div>
              )}

              {/* Replies */}
              {c.replies && c.replies.length > 0 && (
                <div style={{
                  marginTop: '10px',
                  paddingLeft: '15px',
                  borderLeft: '2px solid #e3e6e8'
                }}>
                  {c.replies.map((r, i) => (
                    <div key={i} style={{ marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#555'
                      }}>
                        {r.name || 'User'}
                      </span>

                      <p style={{
                        margin: '2px 0',
                        fontSize: '13px',
                        color: '#444'
                      }}>
                        {r.message}
                      </p>
                    </div>
                  ))}
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