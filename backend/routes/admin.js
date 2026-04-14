const express     = require('express')
const Donation    = require('../models/Donation')
const verifyAdmin = require('../middleware/verifyAdmin')
const router      = express.Router()

// GET /api/admin/donations
router.get('/donations', verifyAdmin, async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('pet', 'name emoji')
      .sort({ createdAt: -1 })
    res.json(donations)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router