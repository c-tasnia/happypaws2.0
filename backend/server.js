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

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:5173',
      'https://happypaws2-0-1sen.vercel.app',
      'https://sandbox.sslcommerz.com',   // ✅ SSLCommerz sandbox callback
      'https://securepay.sslcommerz.com', // ✅ SSLCommerz live callback
    ]
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

