const mongoose = require('mongoose')

const petSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  species:       { type: String, required: true },
  breed:         { type: String },
  age:           { type: Number },
  description:   { type: String },
  image_url:     { type: String },
  images:        [{ type: String }],
  emoji:         { type: String, default: '🐾' },
  goal_amount:   { type: Number, required: true },
  raised_amount: { type: Number, default: 0 },
  is_active:     { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Pet', petSchema)
