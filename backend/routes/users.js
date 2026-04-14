const express = require('express')
const router = express.Router()
const User = require('../models/User')
const verifyToken = require('../middleware/verifyToken')

// POST /api/users — called after register (public)
router.post('/', async (req, res) => {
  const { uid, name, email } = req.body
  try {
    const existing = await User.findOne({ uid })
    if (existing) return res.status(200).json(existing)

    const user = await User.create({ uid, name, email })
    res.status(201).json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/users/profile — logged in user's own profile (protected)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/users — all users, admin only (protected)
router.get('/', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findOne({ uid: req.user.uid })
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Admins only' })
    }
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router