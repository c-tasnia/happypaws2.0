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

const app = express()

connectDB()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://happypaws-qu2vme25g-my-team-a4e0a14f.vercel.app',
    'https://happypaws2-0-1sen.vercel.app',
  ],
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

// ❌ REMOVED: app.listen() — Vercel serverless cannot bind ports
// ✅ Just export the app

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'HappyPaws API is running 🐾' })
}) 

module.exports = app