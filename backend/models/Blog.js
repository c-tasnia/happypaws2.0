const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    excerpt:     { type: String, required: true, trim: true },
    content:     { type: String, required: true },
    cover_image: { type: String, default: '' },
    tags:        { type: [String], default: [] },
    published:   { type: Boolean, default: false },
  },
  { timestamps: true }   // adds createdAt + updatedAt automatically
)

module.exports = mongoose.model('Blog', blogSchema)