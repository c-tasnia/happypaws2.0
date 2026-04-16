import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const Logo = '/LOGO1.png'
const TEAL = '#1a6b5c'

const BlogList = () => {
  const [blogs, setBlogs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    fetch(`${API}/blogs`)
      .then(r => r.json())
      .then(data => { setBlogs(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openPost = (blog) => {
    setSelected(blog)
    document.body.style.overflow = 'hidden'
  }

  const closePost = () => {
    setSelected(null)
    document.body.style.overflow = ''
  }

  const navLinks = [
    ['/', 'Home'],
    ['/pets', 'Our Pets'],
    ['/donations', 'Donate'],
    ['/volunteer', 'Volunteer'],
    ['/blogs', 'Blog'],
  ]

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap');
        .blog-desk-nav { display: flex; }
        .blog-mob-nav  { display: none; }
        @media (max-width: 768px) {
          .blog-desk-nav { display: none !important; }
          .blog-mob-nav  { display: flex !important; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '68px',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.07)' : 'none',
        transition: 'box-shadow 0.3s',
      }}>
        <Link to="/" style={{ flexShrink: 0 }}>
          <img src={Logo} alt="HappyPaws" style={{ height: '44px', objectFit: 'contain' }} />
        </Link>

        {/* Desktop links */}
        <div className="blog-desk-nav" style={{ alignItems: 'center', gap: '2rem' }}>
          {navLinks.map(([href, label]) => {
            const isActive = href === '/blogs'
            return (
              <Link key={label} to={href} style={{
                color: isActive ? TEAL : '#444',
                textDecoration: 'none', fontSize: '15px',
                letterSpacing: '0.04em', fontFamily: 'inherit',
                fontWeight: isActive ? '600' : '500',
                borderBottom: isActive ? `1.5px solid ${TEAL}` : '1.5px solid transparent',
                paddingBottom: '2px', transition: 'color 0.2s, border-color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = TEAL; e.currentTarget.style.borderBottomColor = TEAL }}
                onMouseLeave={e => { e.currentTarget.style.color = isActive ? TEAL : '#444'; e.currentTarget.style.borderBottomColor = isActive ? TEAL : 'transparent' }}
              >{label}</Link>
            )
          })}
        </div>

        {/* Desktop CTA */}
        <div className="blog-desk-nav" style={{ alignItems: 'center' }}>
          <Link to="/donations" style={{
            padding: '9px 22px', borderRadius: '4px', fontSize: '13px',
            background: TEAL, color: '#fff', textDecoration: 'none',
            fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase',
            boxShadow: '0 2px 12px rgba(26,107,92,0.3)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#155248'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = TEAL; e.currentTarget.style.transform = 'none' }}
          >Donate Now</Link>
        </div>

        {/* Mobile hamburger */}
        <div className="blog-mob-nav" style={{ alignItems: 'center', gap: '0.5rem' }}>
          <Link to="/donations" style={{ padding: '8px 14px', borderRadius: '4px', fontSize: '13px', background: TEAL, color: '#fff', textDecoration: 'none', fontWeight: '600' }}>Donate</Link>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: '22px', height: '2px', background: '#333', display: 'block', transition: 'all 0.25s',
                transform: i === 0 && menuOpen ? 'rotate(45deg) translate(5px,5px)' : i === 2 && menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none',
                opacity: i === 1 && menuOpen ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '68px', left: 0, right: 0, zIndex: 99,
          background: '#fff', borderBottom: '1px solid #eee',
          padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}>
          {navLinks.map(([href, label]) => (
            <Link key={label} to={href} onClick={() => setMenuOpen(false)} style={{
              color: href === '/blogs' ? TEAL : '#333',
              textDecoration: 'none', fontSize: '17px',
              padding: '13px 0', borderBottom: '1px solid #f5f5f5',
              fontFamily: 'inherit', fontWeight: href === '/blogs' ? '600' : '400',
            }}>{label}</Link>
          ))}
        </div>
      )}

      {/* ── Page content ── */}
      <div style={{ paddingTop: '68px' }}>

        {/* Hero */}
        <div style={{ background: '#1a1a1a', padding: '4.5rem 1rem 4rem', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7ecfb8', marginBottom: '0.75rem', fontFamily: 'inherit' }}>Our Stories</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: '700', color: '#fff', margin: '0 0 1rem' }}>
            From the Shelter
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: '420px', margin: '0 auto', fontSize: '15px', lineHeight: 1.8 }}>
            Updates, stories, and news from HappyPaws — the animals, the people, and the community behind it all.
          </p>
        </div>

        {/* Grid */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {loading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : blogs.length === 0 ? (
            <p className="text-center text-muted py-20">No posts yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map(blog => (
                <div
                  key={blog._id}
                  onClick={() => openPost(blog)}
                  className="card bg-white shadow-sm border border-base-200 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                >
                  {blog.cover_image ? (
                    <figure className="h-48 overflow-hidden">
                      <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover" />
                    </figure>
                  ) : (
                    <div className="h-48 bg-base-200 flex items-center justify-center text-5xl">📝</div>
                  )}

                  <div className="card-body p-5">
                    {/* Tags */}
                    {blog.tags?.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        {blog.tags.slice(0, 3).map(tag => (
                          <span key={tag} style={{
                            fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase',
                            background: '#e8f5f2', color: TEAL, padding: '2px 8px', borderRadius: '20px', fontWeight: '600',
                          }}>{tag}</span>
                        ))}
                      </div>
                    )}

                    <h2 className="card-title font-serif text-dark" style={{ fontSize: '1.1rem', lineHeight: 1.3 }}>
                      {blog.title}
                    </h2>

                    <p className="text-sm text-muted leading-relaxed line-clamp-3" style={{ marginTop: '4px' }}>
                      {blog.excerpt}
                    </p>

                    <p style={{ fontSize: '11px', color: '#aaa', marginTop: '10px' }}>
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Post Modal ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={closePost}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {selected.cover_image && (
              <figure className="h-64 overflow-hidden rounded-t-2xl">
                <img src={selected.cover_image} alt={selected.title} className="w-full h-full object-cover" />
              </figure>
            )}

            <div className="p-6">
              {/* Tags */}
              {selected.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {selected.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase',
                      background: '#e8f5f2', color: TEAL, padding: '2px 8px', borderRadius: '20px', fontWeight: '600',
                    }}>{tag}</span>
                  ))}
                </div>
              )}

              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>
                {selected.title}
              </h2>

              <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '20px' }}>
                {new Date(selected.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.8, marginBottom: '20px', fontStyle: 'italic' }}>
                {selected.excerpt}
              </p>

              <div style={{ fontSize: '15px', color: '#333', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
                {selected.content}
              </div>

              <div style={{ marginTop: '28px', display: 'flex', gap: '12px' }}>
                <Link
                  to="/donations"
                  onClick={closePost}
                  className="btn flex-1 text-white border-none bg-primary hover:bg-dark"
                >
                  Support HappyPaws
                </Link>
                <button onClick={closePost} className="btn btn-outline border-base-300">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogList