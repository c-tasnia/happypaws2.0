const dns = require('dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])

require('dotenv').config()
const express   = require('express')
const cors      = require('cors')
const connectDB = require('./db')

const petsRoutes      = require('./routes/pets')
const donationsRoutes = require('./routes/donations')
const adminRoutes     = require('./routes/admin')
const { router: volunteerRoutes } = require('./routes/volunteer')
const blogRoutes = require('./routes/blogRoutes')

const app = express()

connectDB()

// ✅ Parse body FIRST before any routes
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ✅ SSLCommerz callbacks — registered BEFORE cors
app.post('/api/donate/success', donationsRoutes.handleSuccess)
app.post('/api/donate/fail',    donationsRoutes.handleFailure)
app.post('/api/donate/cancel',  donationsRoutes.handleFailure)
app.post('/api/donate/ipn',     donationsRoutes.handleIPN)

// ✅ CORS for all browser requests
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:5173',
      'https://happypaws2-0-1sen.vercel.app',
    ]
    if (!origin) return callback(null, true)
    if (allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))

app.use('/api/pets',      petsRoutes)
app.use('/api/donate',    donationsRoutes)
app.use('/api/donations', donationsRoutes)
app.use('/api/admin',     adminRoutes)
app.use('/api/volunteer', volunteerRoutes)
app.use('/api',           blogRoutes)  


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: 'mongodb', time: new Date().toISOString() })
})

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'HappyPaws API is running 🐾' })
})

if (require.main === module) {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
}

module.exports = app