const mongoose = require('mongoose')

const replySchema = new mongoose.Schema({
  message: String,
  name: String,
  createdAt: { type: Date, default: Date.now }
})

const commentSchema = new mongoose.Schema({
  name: String,
  message: String,
  amount: Number,
  isAnonymous: Boolean,
  transactionId: String,

  likes: { type: Number, default: 0 },
  replies: [replySchema],

  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('DonorComment', commentSchema)
