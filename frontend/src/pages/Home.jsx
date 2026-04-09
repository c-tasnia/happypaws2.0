import { Link, Outlet } from 'react-router-dom'

const Logo = '/LOGO.png'
const cat = '/cat.jpg'
const cat2 = '/cat2.jpg'
const dog = '/dog.jpg'
const Hero = '/HERO.png'

const TEAL = '#1a6b5c'
const TEAL_DARK = '#155248'

const Home = () => {
  return (
    <div style={{ fontFamily: "'Georgia', serif", color: '#1a1a1a' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e8e8e8',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '68px',
      }}>
        <Link to="/">
          <img src={Logo} alt="HappyPaws" style={{ height: '44px', objectFit: 'contain' }} />
        </Link>

        <ul style={{
          display: 'flex', gap: '2rem', listStyle: 'none',
          margin: 0, padding: 0,
          fontFamily: "'Georgia', serif", fontSize: '15px',
        }}>
          {[['/', 'Home'], ['/donations', 'Donations'], ['#', 'Blog'], ['#', 'Volunteer'], ['#', 'Contact']].map(([href, label]) => (
            <li key={label} style={{ display: 'none' }} className="nav-item">
              <Link to={href} style={{ color: '#444', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = TEAL}
                onMouseLeave={e => e.target.style.color = '#444'}
              >{label}</Link>
            </li>
          ))}
        </ul>

        {/* Desktop nav links inline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{ color: '#444', textDecoration: 'none', fontSize: '15px' }}
            onMouseEnter={e => e.target.style.color = TEAL}
            onMouseLeave={e => e.target.style.color = '#444'}>Home</Link>
          <Link to="/donations" style={{ color: '#444', textDecoration: 'none', fontSize: '15px' }}
            onMouseEnter={e => e.target.style.color = TEAL}
            onMouseLeave={e => e.target.style.color = '#444'}>Donations</Link>
          <a href="#" style={{ color: '#444', textDecoration: 'none', fontSize: '15px' }}
            onMouseEnter={e => e.target.style.color = TEAL}
            onMouseLeave={e => e.target.style.color = '#444'}>Blog</a>
          <a href="#" style={{ color: '#444', textDecoration: 'none', fontSize: '15px' }}
            onMouseEnter={e => e.target.style.color = TEAL}
            onMouseLeave={e => e.target.style.color = '#444'}>Volunteer</a>
          <a href="#" style={{ color: '#444', textDecoration: 'none', fontSize: '15px' }}
            onMouseEnter={e => e.target.style.color = TEAL}
            onMouseLeave={e => e.target.style.color = '#444'}>Contact</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/login" style={{
            padding: '8px 18px', borderRadius: '6px', fontSize: '14px',
            border: `1.5px solid ${TEAL}`, color: TEAL, textDecoration: 'none',
            fontFamily: 'Georgia, serif', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.background = TEAL; e.target.style.color = '#fff' }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = TEAL }}
          >Login</Link>
          <Link to="/Donations" style={{
            padding: '8px 20px', borderRadius: '6px', fontSize: '14px',
            background: TEAL, color: '#fff', textDecoration: 'none',
            fontFamily: 'Georgia, serif', fontWeight: '600', letterSpacing: '0.03em',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.target.style.background = TEAL_DARK}
            onMouseLeave={e => e.target.style.background = TEAL}
          >Donate Now</Link>
        </div>
      </nav>

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
            fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#a8e0cc', marginBottom: '1rem', fontFamily: 'Georgia, serif',
          }}>Bangladesh's Animal Rescue Network</p>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: '700',
            color: '#fff', marginBottom: '1.25rem', lineHeight: 1.2,
            fontFamily: 'Georgia, serif', maxWidth: '700px',
          }}>
            Every Paw Deserves Love
          </h1>
          <p style={{
            fontSize: '1.05rem', color: 'rgba(255,255,255,0.82)',
            maxWidth: '520px', marginBottom: '2.5rem', lineHeight: 1.7,
          }}>
            Join us in rescuing, rehabilitating, and rehoming street animals across Bangladesh.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/Donations" style={{
              padding: '14px 36px', borderRadius: '6px',
              background: TEAL, color: '#fff', textDecoration: 'none',
              fontSize: '15px', fontWeight: '600', letterSpacing: '0.05em',
              textTransform: 'uppercase', transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.target.style.background = TEAL_DARK}
              onMouseLeave={e => e.target.style.background = TEAL}
            >Donate Now</Link>
            <Link to="/pets" style={{
              padding: '14px 36px', borderRadius: '6px',
              border: '1.5px solid rgba(255,255,255,0.7)', color: '#fff',
              textDecoration: 'none', fontSize: '15px', letterSpacing: '0.05em',
              textTransform: 'uppercase', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.15)' }}
              onMouseLeave={e => { e.target.style.background = 'transparent' }}
            >Meet the Pets</Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{
        background: TEAL, color: '#fff',
        padding: '2.5rem 2rem',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem', textAlign: 'center',
      }}>
        {[['500+', 'Animals Rescued'], ['120+', 'Adopted This Year'], ['50+', 'Active Volunteers'], ['৳2M+', 'Donations Raised']].map(([num, label]) => (
          <div key={label}>
            <p style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 4px', fontFamily: 'Georgia, serif' }}>{num}</p>
            <p style={{ fontSize: '13px', opacity: 0.85, margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</p>
          </div>
        ))}
      </section>

      {/* ── Donation Amount Section ── */}
      <section style={{
        padding: '5rem 1.5rem', textAlign: 'center',
        background: '#fafaf8',
      }}>
        <p style={{ fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: TEAL, marginBottom: '0.75rem' }}>
          Changing a life starts here
        </p>
        <h2 style={{ fontSize: '2.4rem', fontWeight: '700', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
          Make a Donation
        </h2>
        <p style={{ color: '#777', maxWidth: '500px', margin: '0 auto 2.5rem', fontSize: '15px', lineHeight: 1.7 }}>
          Every contribution helps us provide food, shelter, and medical care to animals in need across Bangladesh.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          {['৳500', '৳1,000', '৳2,000', '৳5,000'].map((amt) => (
            <button key={amt} style={{
              padding: '12px 36px', border: `2px solid ${TEAL}`, borderRadius: '6px',
              background: 'transparent', color: TEAL, fontSize: '15px', fontWeight: '600',
              fontFamily: 'Georgia, serif', cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.background = TEAL; e.target.style.color = '#fff' }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = TEAL }}
            >{amt}</button>
          ))}
        </div>
        <Link to="/Donations" style={{
          display: 'inline-block', padding: '14px 48px', borderRadius: '6px',
          background: TEAL, color: '#fff', textDecoration: 'none',
          fontSize: '15px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.target.style.background = TEAL_DARK}
          onMouseLeave={e => e.target.style.background = TEAL}
        >Donate Now</Link>
      </section>

      {/* ── Who We Are ── */}
      <section style={{
        padding: '5rem 2rem',
        maxWidth: '1100px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '4rem', alignItems: 'center',
      }}>
        <div>
          <p style={{ fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: TEAL, marginBottom: '0.75rem' }}>About Us</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '700', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', lineHeight: 1.2 }}>
            Who We Are
          </h2>
          <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.85, marginBottom: '1.25rem' }}>
            Happy Paws provides a voice for vulnerable street animals through urgent rescue, medical
            treatment, and vaccinations. We focus on rehabilitating injured and abandoned pets to find
            them loving homes.
          </p>
          <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.85, marginBottom: '2rem' }}>
            We ensure lifelong, dignified care for those who remain in our sanctuary — transforming
            lives one rescue at a time, replacing struggle with compassion and security.
          </p>
          <Link to="/about" style={{
            display: 'inline-block', padding: '11px 28px', borderRadius: '6px',
            border: `1.5px solid ${TEAL}`, color: TEAL, textDecoration: 'none',
            fontSize: '14px', fontWeight: '600', letterSpacing: '0.03em',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.background = TEAL; e.target.style.color = '#fff' }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = TEAL }}
          >Learn More</Link>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
        }}>
          <img src={cat} alt="Cat" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px' }} />
          <img src={dog} alt="Dog" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px', marginTop: '28px' }} />
          <img src={cat2} alt="Cat 2" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginTop: '-28px' }} />
          <img src={cat} alt="Cat 3" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: '5rem 1.5rem', background: '#fafaf8', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: TEAL, marginBottom: '0.75rem' }}>The Process</p>
        <h2 style={{ fontSize: '2.4rem', fontWeight: '700', marginBottom: '3.5rem', fontFamily: 'Georgia, serif' }}>How It Works</h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem', maxWidth: '900px', margin: '0 auto',
        }}>
          {[
            ['01', 'Rescue', 'Our team responds to reports of injured or abandoned animals across the city.'],
            ['02', 'Rehabilitate', "Veterinary care, vaccinations, and shelter until they're healthy and happy."],
            ['03', 'Rehome', "We match pets with loving families through our adoption program."],
            ['04', 'Support', "Post-adoption follow-ups ensure every animal thrives in their new home."],
          ].map(([num, title, desc]) => (
            <div key={num} style={{
              padding: '2rem 1.5rem', borderRadius: '10px',
              background: '#fff', border: '1px solid #ebebeb',
              textAlign: 'left',
            }}>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#e8e8e8', marginBottom: '0.5rem', fontFamily: 'Georgia, serif' }}>{num}</p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', color: TEAL }}>{title}</h3>
              <p style={{ fontSize: '14px', color: '#777', lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{
        padding: '5rem 2rem', background: TEAL, textAlign: 'center', color: '#fff',
      }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
          Ready to Make a Difference?
        </h2>
        <p style={{ fontSize: '16px', opacity: 0.85, maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
          Your donation today gives a street animal a second chance at life.
        </p>
        <Link to="/Donations" style={{
          display: 'inline-block', padding: '14px 40px', borderRadius: '6px',
          background: '#fff', color: TEAL, textDecoration: 'none',
          fontSize: '15px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase',
          transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => e.target.style.opacity = '0.9'}
          onMouseLeave={e => e.target.style.opacity = '1'}
        >Donate Now</Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: '#111', color: '#aaa',
        padding: '3rem 2rem', textAlign: 'center',
        fontSize: '14px',
      }}>
        <img src={Logo} alt="HappyPaws" style={{ height: '36px', marginBottom: '1.5rem', opacity: 0.7 }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {['Home', 'Donations', 'Blog', 'Volunteer', 'Contact'].map(label => (
            <a key={label} href="#" style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = '#aaa'}
            >{label}</a>
          ))}
        </div>
        <p style={{ margin: 0, color: '#555', fontSize: '13px' }}>
          © {new Date().getFullYear()} HappyPaws Bangladesh. All rights reserved.
        </p>
      </footer>

    </div>
  )
}

export default Home
