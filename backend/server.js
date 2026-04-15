const dns = require('dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])

require('dotenv').config()
const express   = require('express')
const cors      = require('cors')
const path      = require('path')
const connectDB = require('./db')

const petsRoutes      = require('./routes/pets')
const donationsRoutes = require('./routes/donations')
const adminRoutes     = require('./routes/admin')
const { router: volunteerRoutes } = require('./routes/volunteer')

const app = express()

connectDB()

// server.js — place this BEFORE app.use(cors(...))

const donationsRoutes = require('./routes/donations')

// SSLCommerz hits these — no browser, no CORS needed
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.post('/api/donate/success', require('./routes/donations').handleSuccess)
app.post('/api/donate/fail',    require('./routes/donations').handleFailure)
app.post('/api/donate/cancel',  require('./routes/donations').handleFailure)
app.post('/api/donate/ipn',     require('./routes/donations').handleIPN)

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:5173',
      'https://happypaws2-0-1sen.vercel.app',
    ]
    // Allow any Vercel preview deployment
    if (!origin) return callback(null, true)  // SSLCommerz & server-to-server calls

if (allowed.includes(origin) || origin.endsWith('.vercel.app')) {
  callback(null, true)
} else {
  callback(new Error('Not allowed by CORS'))
}
  },
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/pets',      petsRoutes)
app.use('/api/donate',    donationsRoutes)
app.use('/api/donations', donationsRoutes)
app.use('/api/admin',     adminRoutes)
app.use('/api/volunteer', volunteerRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: 'mongodb', time: new Date().toISOString() })
})

// ❌ REMOVED: app.listen() — Vercel serverless cannot bind ports
// ✅ Just export the app

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'HappyPaws API is running 🐾' })
}) 

// ✅ Only listen when running locally, not on Vercel
if (require.main === module) {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
}

module.exports = app