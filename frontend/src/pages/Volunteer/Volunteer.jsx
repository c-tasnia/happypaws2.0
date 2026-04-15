import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const TEAL = '#1a6b5c'

const Volunteer = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    interest: '',
    availability: '',
    message: '',
  })

  const [showPopup, setShowPopup] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
     axios.post('https://happypaws2-0.vercel.app/api/volunteer', data)
      setShowPopup(true)

      setTimeout(() => {
        setShowPopup(false)
      }, 3000)

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        interest: '',
        availability: '',
        message: '',
      })
    } catch (error) {
      console.error('Submission failed:', error)
      alert('Failed to submit form')
    }
  }

  return (
    <div
      data-theme="light"
      style={{
        fontFamily: "'Georgia', serif",
        minHeight: '100vh',
        background: TEAL,
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(250,250,250,0.98)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #e8e8e8',
          padding: '0 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        <Link to="/">
          <img src="/LOGO.png" alt="HappyPaws" style={{ height: '40px' }} />
        </Link>

        <div
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/donations" style={linkStyle}>Donations</Link>
          <Link to="#" style={linkStyle}>Blog</Link>
          <Link
            to="/volunteer"
            style={{ ...linkStyle, color: TEAL, fontWeight: '600' }}
          >
            Volunteer
          </Link>
          <Link to="#" style={linkStyle}>Contact</Link>
        </div>

        <div
          className="desktop-nav"
          style={{
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <Link to="/login" style={btnOutline}>Login</Link>
          <Link to="/register" style={btnOutline}>Register</Link>
          <Link to="/donations" style={btnFilled}>Donate Now</Link>
        </div>
      </nav>

      {/* FORM */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem 1rem',
        }}
      >
        <div
          style={{
            background: '#fff',
            width: '100%',
            maxWidth: '650px',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          }}
        >
          <h2
            style={{
              textAlign: 'center',
              color: TEAL,
              marginBottom: '2rem',
              fontSize: '28px',
              fontWeight: '700',
            }}
          >
            Volunteer With HappyPaws 🐾
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <select
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Interest</option>
              <option value="rescue">Animal Rescue</option>
              <option value="fundraising">Fundraising</option>
              <option value="shelter">Shelter Care</option>
            </select>

            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Availability</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="both">Both</option>
            </select>

            <textarea
              name="message"
              placeholder="Why do you want to volunteer?"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              style={inputStyle}
            />

            <button type="submit" style={buttonStyle}>
              Submit Application
            </button>
          </form>
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#ffffff',
            color: TEAL,
            padding: '20px 30px',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
            fontSize: '18px',
            fontWeight: '600',
            zIndex: 1000,
          }}
        >
          Form Submitted Successfully ✅
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

const linkStyle = {
  color: '#444',
  textDecoration: 'none',
  fontSize: '15px',
}

const btnOutline = {
  padding: '8px 18px',
  borderRadius: '6px',
  fontSize: '14px',
  border: `1.5px solid ${TEAL}`,
  color: TEAL,
  textDecoration: 'none',
  background: 'transparent',
}

const btnFilled = {
  padding: '8px 20px',
  borderRadius: '6px',
  fontSize: '14px',
  background: TEAL,
  color: '#fff',
  textDecoration: 'none',
  fontWeight: '600',
  border: 'none',
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '12px',
  borderRadius: '15px',
  border: '1px solid #ccc',
  fontSize: '14px',
  outline: 'none',
}

const buttonStyle = {
  width: '100%',
  padding: '12px',
  background: TEAL,
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
}

export default Volunteer
