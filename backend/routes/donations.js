const express  = require('express')
const SSLCommerzPayment = require('sslcommerz-lts')
const Pet      = require('../models/Pet')
const Donation = require('../models/Donation')
const router   = express.Router()

const getSSL = () => new SSLCommerzPayment(
  process.env.SSLCOMMERZ_STORE_ID,
  process.env.SSLCOMMERZ_STORE_PASSWORD,
  process.env.SSLCOMMERZ_IS_LIVE === 'true'
)

// ── POST /api/donate/pay ──────────────────────────────────────
router.post('/pay', async (req, res) => {
  try {
    const { donor_name, donor_email, donor_phone, amount, message, pet_id, is_general } = req.body

    if (!donor_name || !donor_email || !donor_phone || !amount)
      return res.status(400).json({ message: 'Name, email, phone and amount are required' })

    if (Number(amount) < 10)
      return res.status(400).json({ message: 'Minimum donation is ৳10' })

    // Get pet name for payment description
    let petName = 'General Fund'
    let petDoc  = null
    if (pet_id && !is_general) {
      petDoc = await Pet.findById(pet_id)
      if (petDoc) petName = petDoc.name
    }

    const tran_id = `HAPPYPAWS-${Date.now()}-${Math.floor(Math.random() * 9999)}`

    // Save pending donation
    await Donation.create({
      pet:         petDoc?._id || null,
      is_general:  is_general || !pet_id,
      donor_name,
      donor_email,
      donor_phone,
      amount:      Number(amount),
      message:     message || '',
      tran_id,
      status:      'pending',
    })

    const BACKEND  = process.env.BACKEND_URL  || 'https://happypaws2-0.vercel.app'
    const FRONTEND = process.env.FRONTEND_URL || 'https://happypaws2-0-1sen.vercel.app'

    const data = {
      total_amount:     Number(amount),
      currency:         'BDT',
      tran_id,
      success_url:      `${BACKEND}/api/donate/success`,
      fail_url:         `${BACKEND}/api/donate/fail`,
      cancel_url:       `${BACKEND}/api/donate/cancel`,
      ipn_url:          `${BACKEND}/api/donate/ipn`,
      product_name:     `HappyPaws Donation — ${petName}`,
      product_category: 'Donation',
      product_profile:  'general',
      cus_name:         donor_name,
      cus_email:        donor_email,
      cus_phone:        donor_phone,
      cus_add1:         'Bangladesh',
      cus_city:         'Dhaka',
      cus_country:      'Bangladesh',
      ship_name:        donor_name,
      ship_add1:        'Bangladesh',
      ship_city:        'Dhaka',
      ship_country:     'Bangladesh',
      shipping_method:  'NO',
      num_of_item:      1,
      value_a:          `${FRONTEND}/payment/success`,
      value_b:          `${FRONTEND}/payment/fail`,
    }

    const sslResponse = await getSSL().init(data)

    if (!sslResponse?.GatewayPageURL) {
      console.error('SSLCommerz init failed:', sslResponse)
      return res.status(500).json({ message: 'Could not initiate payment. Check SSLCommerz credentials.' })
    }

    res.json({ payment_url: sslResponse.GatewayPageURL })
  } catch (err) {
    console.error('Donate pay error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ── POST /api/donate/success ──────────────────────────────────
router.post('/success', async (req, res) => {
  try {
    const { tran_id, val_id, status, value_a } = req.body

    if (status !== 'VALID' && status !== 'VALIDATED')
      return res.redirect(`${process.env.FRONTEND_URL}/payment/fail`)

    const validation = await getSSL().validate({ val_id })

    if (validation?.status === 'VALID' || validation?.status === 'VALIDATED') {
      const donation = await Donation.findOneAndUpdate(
        { tran_id },
        { status: 'success' },
        { new: true }
      )
      // Update pet raised_amount
      if (donation?.pet && !donation.is_general) {
        await Pet.findByIdAndUpdate(donation.pet, {
          $inc: { raised_amount: donation.amount }
        })
      }
      const redirectUrl = value_a || `${process.env.FRONTEND_URL}/payment/success`
      return res.redirect(`${redirectUrl}?tran_id=${tran_id}`)
    }

    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`)
  } catch (err) {
    console.error('Payment success error:', err)
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`)
  }
})

// ── POST /api/donate/fail ─────────────────────────────────────
router.post('/fail', async (req, res) => {
  const { tran_id, value_b } = req.body
  if (tran_id) await Donation.findOneAndUpdate({ tran_id }, { status: 'failed' }).catch(() => {})
  res.redirect(value_b || `${process.env.FRONTEND_URL}/payment/fail`)
})

// ── POST /api/donate/cancel ───────────────────────────────────
router.post('/cancel', async (req, res) => {
  const { tran_id, value_b } = req.body
  if (tran_id) await Donation.findOneAndUpdate({ tran_id }, { status: 'failed' }).catch(() => {})
  res.redirect(value_b || `${process.env.FRONTEND_URL}/payment/fail`)
})

// ── POST /api/donate/ipn ──────────────────────────────────────
router.post('/ipn', async (req, res) => {
  try {
    const { tran_id, val_id, status } = req.body
    if (status === 'VALID' || status === 'VALIDATED') {
      const validation = await getSSL().validate({ val_id })
      if (validation?.status === 'VALID' || validation?.status === 'VALIDATED') {
        const donation = await Donation.findOneAndUpdate(
          { tran_id },
          { status: 'success' },
          { new: true }
        )
        if (donation?.pet && !donation.is_general) {
          await Pet.findByIdAndUpdate(donation.pet, {
            $inc: { raised_amount: donation.amount }
          })
        }
      }
    }
    res.status(200).send('OK')
  } catch (err) {
    console.error('IPN error:', err)
    res.status(200).send('OK')
  }
})

// ── GET /api/donate/verify/:tran_id ───────────────────────────
router.get('/verify/:tran_id', async (req, res) => {
  try {
    const donation = await Donation.findOne({ tran_id: req.params.tran_id }).populate('pet', 'name')
    if (!donation)                    return res.status(404).json({ message: 'Transaction not found' })
    if (donation.status !== 'success') return res.status(400).json({ message: 'Payment not successful' })

    res.json({
      tran_id:    donation.tran_id,
      donor_name: donation.donor_name,
      amount:     donation.amount,
      status:     donation.status,
      pet_name:   donation.is_general ? 'General Fund' : (donation.pet?.name || 'General Fund'),
    })
  } catch (err) {
    console.error('Verify error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ── GET /api/donations/recent ─────────────────────────────────
router.get('/recent', async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'success' })
      .populate('pet', 'name')
      .sort({ createdAt: -1 })
      .limit(10)

    const result = donations.map(d => ({
      donor_name: d.donor_name,
      pet_name:   d.is_general ? 'General Fund' : (d.pet?.name || 'General Fund'),
      amount:     d.amount,
    }))

    res.json(result)
  } catch (err) {
    console.error('Recent donations error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
