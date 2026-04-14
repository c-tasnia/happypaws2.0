const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  donationHistory: [
    {
      amount: Number,
      transactionId: String,
      date: { type: Date, default: Date.now }
    }
  ],
  adoptionRequests: [
    {
      petId: String,
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)