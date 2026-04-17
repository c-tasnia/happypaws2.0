const express = require('express')
const router = express.Router()
const DonorComment = require('../models/Comments')

/* ================= GET ALL COMMENTS ================= */

router.get('/', async (req, res) => {
  try {
    const comments = await DonorComment.find()
      .sort({ createdAt: -1 })
      .limit(20)

    res.json(comments)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* ================= POST COMMENT ================= */

router.post('/', async (req, res) => {
  const { message, amount, isAnonymous, transactionId, name } = req.body

  try {
    const comment = await DonorComment.create({
      name: isAnonymous ? 'Anonymous' : name || 'Anonymous',
      message,
      amount,
      isAnonymous,
      transactionId,
    })

    res.status(201).json(comment)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* ================= DELETE COMMENT ================= */

router.delete('/:id', async (req, res) => {
  try {
    await DonorComment.findByIdAndDelete(req.params.id)
    res.json({ message: 'Comment deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
