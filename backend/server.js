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

const app  = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/pets',      petsRoutes)
app.use('/api/donate',    donationsRoutes)
app.use('/api/donations', donationsRoutes)
app.use('/api/admin',     adminRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: 'mongodb', time: new Date().toISOString() })
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')))
  app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')))
}

app.listen(PORT, () => {
  console.log(`🐾 HappyPaws (MongoDB) running → http://localhost:${PORT}`)
  console.log(`   SSLCommerz : ${process.env.SSLCOMMERZ_IS_LIVE === 'true' ? '🟢 LIVE' : '🟡 SANDBOX'}`)
})
module.exports = app