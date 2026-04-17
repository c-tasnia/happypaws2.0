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

const Groq = require('groq-sdk')
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const Pet = require('./models/Pet')

const app = express()

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ✅ Open CORS for SSLCommerz webhook routes
const openCors = cors({ origin: '*' })
app.post('/api/donate/success', openCors)
app.post('/api/donate/fail',    openCors)
app.post('/api/donate/cancel',  openCors)
app.post('/api/donate/ipn',     openCors)

// ✅ Restricted CORS for everything else
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