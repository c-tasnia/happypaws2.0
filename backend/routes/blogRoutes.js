const express = require('express')
const Blog = require('../models/Blog')
const verifyAdmin = require('../middleware/verifyAdmin')

const router = express.Router()

// ─────────────────────────────────────────────
// ✅ PUBLIC ROUTE: only published blogs
// GET /api/blogs
// ─────────────────────────────────────────────
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true })
      .sort({ createdAt: -1 })

    res.json(blogs)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})


// ─────────────────────────────────────────────
// 🔐 ADMIN ROUTE: all blogs (published + drafts)
// GET /api/admin/blogs
// ─────────────────────────────────────────────
router.get('/admin/blogs', verifyAdmin, async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })

    res.json(blogs)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})


// ─────────────────────────────────────────────
// 🔐 CREATE BLOG
// POST /api/admin/blogs
// ─────────────────────────────────────────────
router.post('/admin/blogs', verifyAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, cover_image, tags, published } = req.body

    const blog = await Blog.create({
      title,
      excerpt,
      content,
      cover_image,
      tags,
      published
    })

    res.status(201).json(blog)
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message })
    }
    res.status(500).json({ message: 'Server error' })
  }
})


// ─────────────────────────────────────────────
// 🔐 UPDATE BLOG (FULL REPLACE)
// PUT /api/admin/blogs/:id
// ─────────────────────────────────────────────
router.put('/admin/blogs/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, cover_image, tags, published } = req.body

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, excerpt, content, cover_image, tags, published },
      { new: true, runValidators: true }
    )

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    res.json(blog)
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message })
    }
    res.status(500).json({ message: 'Server error' })
  }
})


// ─────────────────────────────────────────────
// 🔐 TOGGLE PUBLISH STATUS
// PATCH /api/admin/blogs/:id
// ─────────────────────────────────────────────
router.patch('/admin/blogs/:id', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    blog.published =
      req.body.published !== undefined
        ? Boolean(req.body.published)
        : !blog.published

    await blog.save()

    res.json(blog)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})


// ─────────────────────────────────────────────
// 🔐 DELETE BLOG
// DELETE /api/admin/blogs/:id
// ─────────────────────────────────────────────
router.delete('/admin/blogs/:id', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    res.json({ message: 'Blog deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router