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

      // ✅ new fields
      likes: 0,
      replies: []
    })

    res.status(201).json(comment)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* ================= DELETE COMMENT (NO AUTH) ================= */

router.delete('/:id', async (req, res) => {
  try {
    await DonorComment.findByIdAndDelete(req.params.id)
    res.json({ message: 'Comment deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* ================= ❤️ LIKE ================= */

router.post('/:id/like', async (req, res) => {
  try {
    const comment = await DonorComment.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    )

    res.json({ likes: comment.likes })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* ================= 💬 REPLY ================= */

router.post('/:id/reply', async (req, res) => {
  try {
    const { message, name } = req.body

    const reply = {
      message,
      name: name || 'Anonymous',
      createdAt: new Date()
    }

    const comment = await DonorComment.findByIdAndUpdate(
      req.params.id,
      { $push: { replies: reply } },
      { new: true }
    )

    res.json(comment.replies[comment.replies.length - 1])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router