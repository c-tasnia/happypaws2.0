const express      = require('express')
const Pet          = require('../models/Pet')
const verifyAdmin  = require('../middleware/verifyAdmin')
const router       = express.Router()

// GET /api/pets — public
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find({ is_active: true }).sort({ createdAt: -1 })
    res.json(pets)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/pets/all — admin (includes inactive)
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 })
    res.json(pets)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/pets — admin
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const pet = await Pet.create(req.body)
    res.status(201).json(pet)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT /api/pets/:id — admin
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!pet) return res.status(404).json({ message: 'Pet not found' })
    res.json(pet)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/pets/:id — admin (soft delete)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Pet.findByIdAndUpdate(req.params.id, { is_active: false })
    res.json({ message: 'Pet deactivated' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/pets/seed
router.get('/seed', async (req, res) => {
  try {
    const count = await Pet.countDocuments()
    if (count > 0) return res.json({ message: 'Pets already seeded' })
    await Pet.insertMany([
      { name: 'Biscuit', species: 'Dog',    breed: 'Mixed Breed',  age: 2, description: 'Found injured near Dhanmondi.',       emoji: '🐕', goal_amount: 5000, raised_amount: 3200 },
      { name: 'Mimi',    species: 'Cat',    breed: 'Persian Mix',  age: 1, description: 'Tiny kitten rescued from Chittagong.', emoji: '🐱', goal_amount: 2000, raised_amount: 800  },
      { name: 'Rocky',   species: 'Dog',    breed: 'Labrador Mix', age: 4, description: 'Survived a road accident.',            emoji: '🦮', goal_amount: 8000, raised_amount: 5500 },
    ])
    res.json({ message: 'Seeded' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router