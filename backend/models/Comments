const mongoose = require('mongoose')

const donorCommentSchema = new mongoose.Schema({
  uid: { type: String },               
  name: { type: String, default: 'Anonymous' },
  message: { type: String, required: true },
  amount: { type: Number },            
  isAnonymous: { type: Boolean, default: false },
  transactionId: { type: String },     
}, { timestamps: true })

module.exports = mongoose.model('DonorComment', donorCommentSchema)
