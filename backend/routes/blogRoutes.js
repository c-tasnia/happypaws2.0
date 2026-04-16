const express     = require('express')
const Blog        = require('../models/Blog')
const verifyAdmin = require('../middleware/verifyAdmin')
const router      = express.Router()

// ── GET /api/admin/blogs ─────────────────────────────────────────────────────
router.get('/blogs', verifyAdmin, async (req, res) => {  // 👈 add verifyAdmin
  try {
    const filter = req.isAdmin ? {} : { published: true }
    const blogs  = await Blog.find(filter).sort({ createdAt: -1 })
    res.json(blogs)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// ── POST /api/admin/blogs ────────────────────────────────────────────────────
router.post('/blogs', verifyAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, cover_image, tags, published } = req.body
    const blog = await Blog.create({ title, excerpt, content, cover_image, tags, published })
    res.status(201).json(blog)
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message })
    }
    res.status(500).json({ message: 'Server error' })
  }
})

// ── PUT /api/admin/blogs/:id ─────────────────────────────────────────────────
// Full update — replaces all editable fields.
router.put('/blogs/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, cover_image, tags, published } = req.body
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, excerpt, content, cover_image, tags, published },
      { new: true, runValidators: true }
    )
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.json(blog)
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message })
    }
    res.status(500).json({ message: 'Server error' })
  }
})

// ── PATCH /api/admin/blogs/:id ───────────────────────────────────────────────
// Toggles (or explicitly sets) the published field only.
router.patch('/blogs/:id', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ message: 'Blog not found' })

    // If caller sends { published: true/false }, honour it; otherwise toggle.
    blog.published = req.body.published !== undefined
      ? Boolean(req.body.published)
      : !blog.published

    await blog.save()
    res.json(blog)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// ── DELETE /api/admin/blogs/:id ──────────────────────────────────────────────
router.delete('/blogs/:id', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.json({ message: 'Blog deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router