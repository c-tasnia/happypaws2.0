const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const volunteerSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  address: String,
  interest: String,
  availability: String,
  message: String,
  status: { type: String, default: 'pending' }, // pending, approved, rejected
  createdAt: { type: Date, default: Date.now }
})

const Volunteer = mongoose.model('Volunteer', volunteerSchema)

// POST /api/volunteer — submit application
router.post('/', async (req, res) => {
  try {
    const application = new Volunteer(req.body)
    await application.save()
    res.status(201).json({ message: 'Application submitted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/volunteer — admin fetch all
router.get('/', async (req, res) => {
  try {
    const applications = await Volunteer.find().sort({ createdAt: -1 })
    res.json(applications)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/volunteer/:id — update status
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ✅ Must have this at the bottom
module.exports = { router }