import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Logo = '/LOGO.png'
const cat = '/cat.jpg'
const cat2 = '/cat2.jpg'
const dog = '/dog.jpg'
const Hero = '/HERO.png'

const TEAL = '#1a6b5c'
const TEAL_DARK = '#155248'

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ fontFamily: "'Georgia', serif", color: '#1a1a1a', overflowX: 'hidden' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e8e8e8',
        padding: '0 1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Logo */}
        <Link to="/" style={{ flexShrink: 0 }}>
          <img src={Logo} alt="HappyPaws" style={{ height: '40px', objectFit: 'contain' }} />
        </Link>

        {/* Desktop nav links */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {[['/', 'Home'], ['/donations', 'Donations'], ['#', 'Blog'], ['#', 'Volunteer'], ['#', 'Contact']].map(([href, label]) => (
            <Link key={label} to={href} style={{ color: '#444', textDecoration: 'none', fontSize: '15px' }}
              onMouseEnter={e => e.target.style.color = TEAL}
              onMouseLeave={e => e.target.style.color = '#444'}
            >{label}</Link>
          ))}
        </div>

        {/* Desktop buttons */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/login" style={{
            padding: '8px 18px', borderRadius: '6px', fontSize: '14px',
            border: `1.5px solid ${TEAL}`, color: TEAL, textDecoration: 'none',
          }}>Login</Link>
          <Link to="/donations" style={{
            padding: '8px 20px', borderRadius: '6px', fontSize: '14px',
            background: TEAL, color: '#fff', textDecoration: 'none', fontWeight: '600',
          }}>Donate Now</Link>
        </div>

        {/* Mobile: Donate + Hamburger */}
        <div className="mobile-nav" style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }}>
          <Link to="/donations" style={{
            padding: '8px 14px', borderRadius: '6px', fontSize: '13px',
            background: TEAL, color: '#fff', textDecoration: 'none', fontWeight: '600',
          }}>Donate</Link>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '6px', display: 'flex', flexDirection: 'column', gap: '5px',
          }}>
            <span style={{ width: '22px', height: '2px', background: '#333', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ width: '22px', height: '2px', background: '#333', display: 'block', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: '22px', height: '2px', background: '#333', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 49,
          background: '#fff', borderBottom: '1px solid #e8e8e8',
          padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column',
        }}>
          {[['/', 'Home'], ['/donations', 'Donations'], ['#', 'Blog'], ['#', 'Volunteer'], ['#', 'Contact']].map(([href, label]) => (
            <Link key={label} to={href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: '#333', textDecoration: 'none', fontSize: '16px',
                padding: '14px 0', borderBottom: '1px solid #f0f0f0', display: 'block',
              }}
            >{label}</Link>
          ))}
          <Link to="/login" onClick={() => setMenuOpen(false)} style={{
            marginTop: '1rem', padding: '12px', borderRadius: '6px', fontSize: '15px',
            border: `1.5px solid ${TEAL}`, color: TEAL, textDecoration: 'none',
            textAlign: 'center', display: 'block',
          }}>Login</Link>
        </div>
      )}

      <Outlet />

      {/* ── Hero ── */}
      <section style={{ position: 'relative', height: '580px', background: '#0d0d0d', overflow: 'hidden' }}>
        <img src={Hero} alt="Hero" style={{
          width: '100%', height: '100%', objectFit: 'cover',
          opacity: 0.55, display: 'block',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          textAlign: 'center', padding: '0 1.5rem',
        }}>
          <p style={{
            fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#a8e0cc', marginBottom: '1rem',
          }}>Bangladesh's Animal Rescue Network</p>
          <h1 style={{
            fontSize: 'clamp(1.9rem, 7vw, 3.8rem)', fontWeight: '700',
            color: '#fff', marginBottom: '1.25rem', lineHeight: 1.2,
            maxWidth: '700px',
          }}>
            Every Paw Deserves Love
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 3.5vw, 16px)', color: 'rgba(255,255,255,0.82)',
            maxWidth: '480px', marginBottom: '2rem', lineHeight: 1.7,
          }}>
            Join us in rescuing, rehabilitating, and rehoming street animals across Bangladesh.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/donations" style={{
              padding: '13px 28px', borderRadius: '6px',
              background: TEAL, color: '#fff', textDecoration: 'none',
              fontSize: '14px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>Donate Now</Link>
            <Link to="/pets" style={{
              padding: '13px 28px', borderRadius: '6px',
              border: '1.5px solid rgba(255,255,255,0.7)', color: '#fff',
              textDecoration: 'none', fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>Meet the Pets</Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{
        background: TEAL, color: '#fff',
        padding: '2.5rem 1.5rem',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '1.5rem', textAlign: 'center',
      }}>
        {[['500+', 'Animals Rescued'], ['120+', 'Adopted This Year'], ['50+', 'Active Volunteers'], ['৳2M+', 'Donations Raised']].map(([num, label]) => (
          <div key={label}>
            <p style={{ fontSize: '1.8rem', fontWeight: '700', margin: '0 0 4px' }}>{num}</p>
            <p style={{ fontSize: '12px', opacity: 0.85, margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</p>
          </div>
        ))}
      </section>

      {/* ── Donation Amount Section ── */}
      <section style={{ padding: '4rem 1.25rem', textAlign: 'center', background: '#fafaf8' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: TEAL, marginBottom: '0.75rem' }}>
          Changing a life starts here
        </p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', fontWeight: '700', marginBottom: '1rem' }}>
          Make a Donation
        </h2>
        <p style={{ color: '#777', maxWidth: '480px', margin: '0 auto 2rem', fontSize: '15px', lineHeight: 1.7 }}>
          Every contribution helps us provide food, shelter, and medical care to animals in need.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          {['৳500', '৳1,000', '৳2,000', '৳5,000'].map((amt) => (
            <button key={amt} style={{
              padding: '11px 28px', border: `2px solid ${TEAL}`, borderRadius: '6px',
              background: 'transparent', color: TEAL, fontSize: '15px', fontWeight: '600',
              cursor: 'pointer', minWidth: '100px', fontFamily: 'Georgia, serif',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = TEAL; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = TEAL }}
            >{amt}</button>
          ))}
        </div>
        <Link to="/donations" style={{
          display: 'inline-block', padding: '13px 40px', borderRadius: '6px',
          background: TEAL, color: '#fff', textDecoration: 'none',
          fontSize: '15px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>Donate Now</Link>
      </section>

      {/* ── Who We Are ── */}
      <section style={{ padding: '4rem 1.25rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3rem', alignItems: 'center',
        }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: TEAL, marginBottom: '0.75rem' }}>About Us</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', fontWeight: '700', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              Who We Are
            </h2>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.85, marginBottom: '1.25rem' }}>
              Happy Paws provides a voice for vulnerable street animals through urgent rescue, medical treatment, and vaccinations.
            </p>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.85, marginBottom: '1.75rem' }}>
              We ensure lifelong, dignified care for those who remain in our sanctuary — transforming lives one rescue at a time.
            </p>
            <Link to="/about" style={{
              display: 'inline-block', padding: '11px 28px', borderRadius: '6px',
              border: `1.5px solid ${TEAL}`, color: TEAL, textDecoration: 'none',
              fontSize: '14px', fontWeight: '600',
            }}>Learn More</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <img src={cat} alt="Cat" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
            <img src={dog} alt="Dog" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginTop: '20px' }} />
            <img src={cat2} alt="Cat 2" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginTop: '-20px' }} />
            <img src={cat} alt="Cat 3" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: '4rem 1.25rem', background: '#fafaf8', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: TEAL, marginBottom: '0.75rem' }}>The Process</p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', fontWeight: '700', marginBottom: '3rem' }}>How It Works</h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem', maxWidth: '900px', margin: '0 auto',
        }}>
          {[
            ['01', 'Rescue', 'Our team responds to reports of injured or abandoned animals across the city.'],
            ['02', 'Rehabilitate', "Veterinary care, vaccinations, and shelter until they're healthy and happy."],
            ['03', 'Rehome', "We match pets with loving families through our adoption program."],
            ['04', 'Support', "Post-adoption follow-ups ensure every animal thrives in their new home."],
          ].map(([num, title, desc]) => (
            <div key={num} style={{
              padding: '1.75rem 1.25rem', borderRadius: '10px',
              background: '#fff', border: '1px solid #ebebeb', textAlign: 'left',
            }}>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#e8e8e8', marginBottom: '0.5rem' }}>{num}</p>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.6rem', color: TEAL }}>{title}</h3>
              <p style={{ fontSize: '14px', color: '#777', lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding: '4rem 1.5rem', background: TEAL, textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', fontWeight: '700', marginBottom: '1rem' }}>
          Ready to Make a Difference?
        </h2>
        <p style={{ fontSize: '15px', opacity: 0.85, maxWidth: '440px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
          Your donation today gives a street animal a second chance at life.
        </p>
        <Link to="/donations" style={{
          display: 'inline-block', padding: '13px 36px', borderRadius: '6px',
          background: '#fff', color: TEAL, textDecoration: 'none',
          fontSize: '15px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>Donate Now</Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: '#111', color: '#aaa',
        padding: '2.5rem 1.25rem', textAlign: 'center', fontSize: '14px',
      }}>
        <img src={Logo} alt="HappyPaws" style={{ height: '34px', marginBottom: '1.25rem', opacity: 0.7 }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {[['/', 'Home'], ['/donations', 'Donations'], ['#', 'Blog'], ['#', 'Volunteer'], ['#', 'Contact']].map(([href, label]) => (
            <Link key={label} to={href} style={{ color: '#aaa', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
        <p style={{ margin: 0, color: '#555', fontSize: '13px' }}>
          © {new Date().getFullYear()} HappyPaws Bangladesh. All rights reserved.
        </p>
      </footer>

      {/* ── Responsive Styles ── */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
          .desktop-nav { display: flex !important; }
        }
      `}</style>

    </div>
  )
}

export default Home
