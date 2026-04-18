const dns = require('dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])

require('dotenv').config()
const express   = require('express')
const cors      = require('cors')
const connectDB = require('./db')
const mongoose = require('mongoose')

const donorcomments = require('./routes/comments')
const petsRoutes      = require('./routes/pets')
const donationsRoutes = require('./routes/donations')
const adminRoutes     = require('./routes/admin')
const { router: volunteerRoutes } = require('./routes/volunteer')
const blogRoutes = require('./routes/blogRoutes')

const Donation = require('./models/Donation')

const Groq = require('groq-sdk')
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const Pet = require('./models/Pet')

const app = express()

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// ✅ Open CORS for SSLCommerz webhook routes (both GET and POST)
const openCors = cors({ origin: '*' })
app.use('/api/donate/success', openCors)
app.use('/api/donate/fail',    openCors)
app.use('/api/donate/cancel',  openCors)
app.use('/api/donate/ipn',     openCors)

// ✅ Restricted CORS for everything else
// Replace your entire CORS block with this:
app.use(cors({
  origin: (origin, callback) => {
    // Allow SSLCommerz and no-origin requests (server-to-server)
    if (!origin) return callback(null, true)
    
    const allowed = [
      'http://localhost:5173',
      'https://happypaws2-0-1sen.vercel.app',
    ]
    if (allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true)
    }
    
    // Allow SSLCommerz domains
    if (origin.includes('sslcommerz') || origin.includes('sslcommerz.com')) {
      return callback(null, true)
    }

    // Allow all for donate routes — SSLCommerz redirects come from unknown origins
    return callback(null, true) // ← temporarily allow ALL origins
  },
  credentials: true,
}))

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body
  try {
    const pets = await Pet.find({ adopted: false }).limit(10).lean()
    const petList = pets.length
      ? pets.map(p => `${p.name} (${p.species}, ${p.age} yrs)`).join(', ')
      : 'No pets currently listed'

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a friendly assistant for HappyPaws Animal Shelter.
Currently available pets: ${petList}
Help users with adoption, donations, and volunteering. Keep responses short and warm.`
        },
        ...messages
      ]
    })
    res.json({ reply: response.choices[0].message.content })
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ error: err.message })
  }
})


app.use('/api/comments',  donorcomments)
app.use('/api/pets',      petsRoutes)
app.use('/api/donate',    donationsRoutes)
app.use('/api/donations', donationsRoutes)
app.use('/api/admin',     adminRoutes)
app.use('/api/volunteer', volunteerRoutes)
app.use('/api',           blogRoutes)

app.get('/api/stats', async (req, res) => {
  const donors = await Donation.countDocuments()
  console.log("DB NAME:", mongoose.connection.name)
  console.log("DB HOST:", mongoose.connection.host)

  const raisedData = await Donation.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ])

  const rescued = await Pet.countDocuments()

  res.json({
    donors,
    raised: raisedData[0]?.total || 0,
    rescued
  })
})

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