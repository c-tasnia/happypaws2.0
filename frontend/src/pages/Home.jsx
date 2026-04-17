import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CommunityBoardPreview from '../components/CommunityBoardPreview'

const Logo = '/LOGO1.png'
const cat = '/pet4.jpeg'
const cat2 = '/cat2.jpg'
const puppy = '/puppy.jpg'
const pet2 = '/pet2.jpeg'
const dog = '/dog.jpg'
const Hero = '/HERO.png'
const Cop = '/cop2.png'
const Catg = '/catg.jpeg'
const bird = '/bird.jpeg'


const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const TEAL = '#1a6b5c'
const TEAL_DARK = '#155248'
const TEAL_LIGHT = '#e8f5f1'
const WARM = '#f7f3ee'

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',')
  const isAdmin = adminEmails.includes(currentUser?.email)

  // Pet slider state
  const [pets, setPets] = useState([])
  const [sliderIndex, setSliderIndex] = useState(0)
  const sliderRef = useRef(null)
  const autoPlayRef = useRef(null)

  useEffect(() => {
    fetch(`${API}/api/pets`)
      .then(r => r.json())
      .then(data => Array.isArray(data) ? setPets(data.slice(0, 8)) : setPets([]))
      .catch(() => setPets([]))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Auto-advance slider
  useEffect(() => {
    if (pets.length < 2) return
    autoPlayRef.current = setInterval(() => {
      setSliderIndex(i => (i + 1) % pets.length)
    }, 3500)
    return () => clearInterval(autoPlayRef.current)
  }, [pets.length])

  const goSlide = (dir) => {
    clearInterval(autoPlayRef.current)
    setSliderIndex(i => (i + dir + pets.length) % pets.length)
  }

  const getPhotoUrl = (pet) => pet.image_url || (pet.images && pet.images[0]) || null

  const handleLogout = async () => {
    try { await logout(); navigate('/') } catch (err) { console.error(err) }
  }

  const navLinks = [['/', 'Home'], ['/pets', 'Our Pets'], ['/donations', 'Donate'], ['/Volunteer', 'Volunteer'], ['/blogs', 'Blog'], ['/contact', 'Contact'], ...(isAdmin ? [['/admin', 'Admin']] : [])]

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#1a1a1a', overflowX: 'hidden', background: WARM }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : 'none',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '68px',
        transition: 'all 0.4s ease',
      }}>
        <Link to="/" style={{ flexShrink: 0 }}>
          <img src={Logo} alt="HappyPaws" style={{ height: '44px', objectFit: 'contain'}} />
        </Link>

        <div className="desk-nav" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {navLinks.map(([href, label]) => (
            <Link key={label} to={href} style={{
              color: scrolled ? '#333' : 'rgba(255,255,255,0.9)',
              textDecoration: 'none', fontSize: '15px', letterSpacing: '0.04em',
              fontFamily: "'Cormorant Garamond', serif", fontWeight: '500',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = scrolled ? TEAL : '#fff'}
              onMouseLeave={e => e.target.style.color = scrolled ? '#333' : 'rgba(255,255,255,0.9)'}
            >{label}</Link>
          ))}
        </div>

        <div className="desk-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {currentUser ? (
            <>
              <span style={{ fontSize: '13px', color: scrolled ? '#666' : 'rgba(255,255,255,0.8)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.email}
              </span>
              <button onClick={handleLogout} style={{
                padding: '8px 20px', borderRadius: '4px', fontSize: '13px',
                border: '1.5px solid #c0392b', color: '#c0392b',
                background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.04em',
              }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                padding: '8px 20px', borderRadius: '4px', fontSize: '13px',
                border: `1.5px solid ${scrolled ? TEAL : 'rgba(255,255,255,0.7)'}`,
                color: scrolled ? TEAL : '#fff', textDecoration: 'none', letterSpacing: '0.04em',
                transition: 'all 0.2s',
              }}>Login</Link>
              <Link to="/donations" style={{
                padding: '9px 22px', borderRadius: '4px', fontSize: '13px',
                background: TEAL, color: '#fff', textDecoration: 'none',
                fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase',
                boxShadow: '0 2px 12px rgba(26,107,92,0.35)',
              }}>Donate</Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="mob-nav" style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }}>
          <Link to="/donations" style={{ padding: '8px 14px', borderRadius: '4px', fontSize: '13px', background: TEAL, color: '#fff', textDecoration: 'none', fontWeight: '600' }}>Donate</Link>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: '22px', height: '2px', display: 'block', transition: 'all 0.25s',
                background: scrolled ? '#333' : '#fff',
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
              color: '#333', textDecoration: 'none', fontSize: '17px',
              padding: '13px 0', borderBottom: '1px solid #f5f5f5',
              fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.03em',
            }}>{label}</Link>
          ))}
          {currentUser ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false) }} style={{ marginTop: '1rem', padding: '12px', borderRadius: '4px', border: '1.5px solid #c0392b', color: '#c0392b', background: 'transparent', fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit' }}>Logout</button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} style={{ marginTop: '1rem', padding: '12px', borderRadius: '4px', border: `1.5px solid ${TEAL}`, color: TEAL, textDecoration: 'none', fontSize: '15px', textAlign: 'center' }}>Login</Link>
          )}
        </div>
      )}

      {/* ── Hero ── */}
      <section style={{ position: 'relative', height: '100vh', minHeight: '580px', background: '#0a0a0a', overflow: 'hidden' }}>
        <img src={Cop} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, display: 'block', transform: 'scale(1.04)', animation: 'heroZoom 12s ease-in-out infinite alternate',  objectPosition: '20% 40%', }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, rgba(0,0,0,0.15) 0%, rgba(10,10,10,0.65) 70%, rgba(10,10,10,0.85) 100%)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'flex-start',
          padding: '0 max(2rem, 8vw)',
        }}>
          <div style={{ animation: 'fadeUp 0.9s ease both' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#7ecfb8', marginBottom: '1.25rem', fontFamily: 'inherit' }}>
              Bangladesh's Animal Rescue Network
            </p>
            <h1 style={{
              fontSize: 'clamp(2.4rem, 7.5vw, 5rem)', fontWeight: '700',
              color: '#fff', marginBottom: '1.5rem', lineHeight: 1.1,
              maxWidth: '680px', fontFamily: "'Cormorant Garamond', serif",
            }}>
              Every Soul<br />Deserves Love
            </h1>
            <p style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: 'rgba(255,255,255,0.75)', maxWidth: '440px', marginBottom: '2.5rem', lineHeight: 1.8, fontFamily: 'inherit' }}>
              Rescuing, rehabilitating, and rehoming street animals across Bangladesh — one life at a time.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/donations" style={{
                padding: '14px 34px', borderRadius: '4px',
                background: TEAL, color: '#fff', textDecoration: 'none',
                fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase',
                boxShadow: '0 4px 20px rgba(26,107,92,0.45)', transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(26,107,92,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,107,92,0.45)' }}
              >Donate Now</Link>
              <Link to="/pets" style={{
                padding: '14px 34px', borderRadius: '4px',
                border: '1.5px solid rgba(255,255,255,0.55)', color: '#fff',
                textDecoration: 'none', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase',
                transition: 'border-color 0.2s, background 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)'; e.currentTarget.style.background = 'transparent' }}
              >Meet the Pets</Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', animation: 'bounce 2s ease infinite' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)' }} />
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ background: TEAL, color: '#fff', padding: '2.75rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          {[['500+', 'Animals Rescued'], ['120+', 'Adopted This Year'], ['50+', 'Active Volunteers'], ['৳2M+', 'Donations Raised']].map(([num, label]) => (
            <div key={label}>
              <p style={{ fontSize: '2.2rem', fontWeight: '700', margin: '0 0 4px', fontFamily: "'Cormorant Garamond', serif", letterSpacing: '-0.01em' }}>{num}</p>
              <p style={{ fontSize: '11px', opacity: 0.75, margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'inherit' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pet Slider ── */}
      {pets.length > 0 && (
        <section style={{ padding: '5rem 0', background: '#fff', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL, marginBottom: '0.5rem' }}>Our Animals</p>
                <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', fontWeight: '700', margin: 0, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.1 }}>Meet the Pets</h2>
              </div>
              <Link to="/pets" style={{ color: TEAL, textDecoration: 'none', fontSize: '14px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: `1.5px solid ${TEAL}`, paddingBottom: '2px' }}>
                View All →
              </Link>
            </div>

            {/* Slider track */}
            <div style={{ position: 'relative' }}>
              <div ref={sliderRef} style={{
                display: 'flex', gap: '20px',
                transition: 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transform: `translateX(calc(-${sliderIndex * (300 + 20)}px))`,
              }}>
                {[...pets, ...pets].map((pet, i) => {
                  const photo = getPhotoUrl(pet)
                  const progress = Math.min((pet.raised_amount / pet.goal_amount) * 100, 100)
                  return (
                    <Link
                      key={`${pet._id}-${i}`}
                      to="/pets"
                      style={{
                        minWidth: '300px', borderRadius: '12px', overflow: 'hidden',
                        background: WARM, border: '1px solid rgba(0,0,0,0.07)',
                        textDecoration: 'none', color: 'inherit', flexShrink: 0,
                        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)' }}
                    >
                      <div style={{ height: '200px', background: TEAL_LIGHT, overflow: 'hidden', position: 'relative' }}>
                        {photo ? (
                          <img src={photo} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>{pet.emoji}</div>
                        )}
                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.92)', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: '600', color: TEAL_DARK, letterSpacing: '0.05em' }}>
                          {pet.species}
                        </div>
                      </div>
                      <div style={{ padding: '1.1rem 1.25rem 1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif" }}>{pet.name}</h3>
                          <span style={{ fontSize: '1.3rem' }}>{pet.emoji}</span>
                        </div>
                        {pet.breed && (
                          <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#999', letterSpacing: '0.03em' }}>{pet.breed} · {pet.age}yr</p>
                        )}
                        <p style={{ margin: '0 0 12px', fontSize: '13.5px', color: '#666', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{pet.description}</p>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                            <span style={{ color: TEAL, fontWeight: '600' }}>৳{pet.raised_amount?.toLocaleString()} raised</span>
                            <span style={{ color: '#aaa' }}>of ৳{pet.goal_amount?.toLocaleString()}</span>
                          </div>
                          <div style={{ height: '4px', background: '#e8e8e8', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${progress}%`, background: TEAL, borderRadius: '2px', transition: 'width 0.6s ease' }} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Prev / Next */}
              {pets.length > 1 && (
                <>
                  <button onClick={() => goSlide(-1)} style={{
                    position: 'absolute', left: '-16px', top: '50%', transform: 'translateY(-50%)',
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: '#fff', border: '1px solid rgba(0,0,0,0.1)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', color: '#333', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = TEAL; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#333' }}
                  >‹</button>
                  <button onClick={() => goSlide(1)} style={{
                    position: 'absolute', right: '-16px', top: '50%', transform: 'translateY(-50%)',
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: '#fff', border: '1px solid rgba(0,0,0,0.1)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', color: '#333', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = TEAL; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#333' }}
                  >›</button>
                </>
              )}
            </div>

            {/* Dots */}
            {pets.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '2rem' }}>
                {pets.map((_, i) => (
                  <button key={i} onClick={() => { clearInterval(autoPlayRef.current); setSliderIndex(i) }} style={{
                    width: i === sliderIndex % pets.length ? '24px' : '7px',
                    height: '7px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                    background: i === sliderIndex % pets.length ? TEAL : '#ccc',
                    transition: 'all 0.3s ease', padding: 0,
                  }} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Donation Amount Section ── */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center', background: WARM }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL, marginBottom: '0.75rem' }}>Changing a life starts here</p>
        <h2 style={{ fontSize: 'clamp(1.9rem, 5vw, 2.8rem)', fontWeight: '700', marginBottom: '1rem', fontFamily: "'Cormorant Garamond', serif" }}>Make a Donation</h2>
        <p style={{ color: '#888', maxWidth: '460px', margin: '0 auto 2.5rem', fontSize: '15px', lineHeight: 1.8 }}>
          Every contribution provides food, shelter, and medical care to animals in need.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          {['৳500', '৳1,000', '৳2,000', '৳5,000'].map((amt) => (
            <button key={amt} style={{
              padding: '12px 30px', border: `1.5px solid ${TEAL}`, borderRadius: '4px',
              background: 'transparent', color: TEAL, fontSize: '15px', fontWeight: '600',
              cursor: 'pointer', minWidth: '110px', fontFamily: 'inherit',
              transition: 'all 0.2s', letterSpacing: '0.04em',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = TEAL; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = TEAL; e.currentTarget.style.transform = 'none' }}
            >{amt}</button>
          ))}
        </div>
        <Link to="/donations" style={{
          display: 'inline-block', padding: '14px 44px', borderRadius: '4px',
          background: TEAL, color: '#fff', textDecoration: 'none',
          fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase',
          boxShadow: '0 4px 20px rgba(26,107,92,0.3)',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = TEAL_DARK; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = TEAL; e.currentTarget.style.transform = 'none' }}
        >Donate Now</Link>
      </section>

      {/* ── Who We Are ── */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL, marginBottom: '0.75rem' }}>About Us</p>
            <h2 style={{ fontSize: 'clamp(1.9rem, 5vw, 2.8rem)', fontWeight: '700', marginBottom: '1.5rem', lineHeight: 1.1, fontFamily: "'Cormorant Garamond', serif" }}>
              Who We Are
            </h2>
            <p style={{ color: '#666', fontSize: '15.5px', lineHeight: 1.9, marginBottom: '1.25rem' }}>
              Happy Paws provides a voice for vulnerable street animals through urgent rescue, medical treatment, and vaccinations.
            </p>
            <p style={{ color: '#666', fontSize: '15.5px', lineHeight: 1.9, marginBottom: '2rem' }}>
              We ensure lifelong, dignified care for those who remain in our sanctuary — transforming lives one rescue at a time.
            </p>
            <Link to="/blogs" style={{
              display: 'inline-block', padding: '11px 28px', borderRadius: '4px',
              border: `1.5px solid ${TEAL}`, color: TEAL, textDecoration: 'none',
              fontSize: '13px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = TEAL; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = TEAL }}
            >Learn More</Link>
          </div>

          <div style={{ 
  display: 'grid', 
  gridTemplateColumns: '1fr 1fr', 
  gap: '14px' 
}}>
  {[
    { src: cat, h: '250px', mt: '-30px' },  
    { src: bird, h: '230px', mt: '10px' },  
    { src: puppy, h: '280px', mt: '-15px' },  
    { src: pet2, h: '260px', mt: '10px' },  
  ].map((item, i) => (
    <div key={i} style={{
      overflow: 'hidden',       
      borderRadius: '12px',
      marginTop: item.mt,
    }}>
      <img
        src={item.src}
        alt=""
        style={{
          width: '100%',
          height: item.h,
          objectFit: 'cover',
          objectPosition: item.objectPosition || '70% 50%',
          borderRadius: '12px',
          display: 'block',
          transition: 'transform 0.4s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      />
    </div>
  ))}
</div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: '5rem 2rem', background: '#fff', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL, marginBottom: '0.75rem' }}>The Process</p>
        <h2 style={{ fontSize: 'clamp(1.9rem, 5vw, 2.8rem)', fontWeight: '700', marginBottom: '3.5rem', fontFamily: "'Cormorant Garamond', serif" }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.5rem', maxWidth: '960px', margin: '0 auto' }}>
          {[
            ['01', 'Rescue', 'Our team responds to reports of injured or abandoned animals across the city.'],
            ['02', 'Rehabilitate', "Veterinary care, vaccinations, and shelter until they're healthy and happy."],
            ['03', 'Rehome', "We match pets with loving families through our adoption program."],
            ['04', 'Support', "Post-adoption follow-ups ensure every animal thrives in their new home."],
          ].map(([num, title, desc]) => (
            <div key={num} style={{
              padding: '2rem 1.5rem', borderRadius: '10px',
              background: WARM, border: '1px solid rgba(0,0,0,0.06)',
              textAlign: 'left', transition: 'transform 0.3s, box-shadow 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <p style={{ fontSize: '2.8rem', fontWeight: '700', color: '#e0dbd4', marginBottom: '0.75rem', fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>{num}</p>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.6rem', color: TEAL, fontFamily: "'Cormorant Garamond', serif" }}>{title}</h3>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.75, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding: '5rem 2rem', background: TEAL, textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.06) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(0,0,0,0.1) 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: '700', marginBottom: '1rem', fontFamily: "'Cormorant Garamond', serif" }}>
            Ready to Make a Difference?
          </h2>
          <p style={{ fontSize: '16px', opacity: 0.82, maxWidth: '420px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            Your donation today gives a street animal a second chance at life.
          </p>
          <Link to="/donations" style={{
            display: 'inline-block', padding: '14px 40px', borderRadius: '4px',
            background: '#fff', color: TEAL, textDecoration: 'none',
            fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)' }}
          >Donate Now</Link>
        </div>
      </section>

      {/* ── Community Board Preview ── */}
      
      <section style={{ padding: '4rem 1.25rem', background: '#fff' }}>
         <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: TEAL, marginBottom: '0.75rem', textAlign: 'center' }}>
            Words of Kindness
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center' }}>
            Community Board
          </h2>
          <p style={{ color: '#888', textAlign: 'center', fontSize: '15px', marginBottom: '3rem' }}>
            Kind words from our wonderful supporters 🐾
          </p>

          {/* Cards Grid */}
                 <CommunityBoardPreview />

                   </div>
             </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#0f0f0f', color: '#777', padding: '3rem 2rem', textAlign: 'center', fontSize: '14px' }}>
        <img src={Logo} alt="HappyPaws" style={{ height: '32px', marginBottom: '1.5rem', opacity: 0.5}} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {[['/', 'Home'], ['/pets', 'Our Pets'], ['/donations', 'Donations'], ['/blogs', 'Blog'], ['#', 'Volunteer'], ['#', 'Contact']].map(([href, label]) => (
            <Link key={label} to={href} style={{ color: '#666', textDecoration: 'none', fontSize: '13px', letterSpacing: '0.06em', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#aaa'}
              onMouseLeave={e => e.target.style.color = '#666'}
            >{label}</Link>
          ))}
        </div>
        <p style={{ margin: 0, color: '#444', fontSize: '12px', letterSpacing: '0.05em' }}>
          © {new Date().getFullYear()} HappyPaws Bangladesh · All rights reserved
        </p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap');

        @keyframes heroZoom {
          from { transform: scale(1.04); }
          to { transform: scale(1.12); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }

        @media (max-width: 768px) {
          .desk-nav { display: none !important; }
          .mob-nav { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mob-nav { display: none !important; }
          .desk-nav { display: flex !important; }
        }
      `}</style>
    </div>
  )
}

export default Home
