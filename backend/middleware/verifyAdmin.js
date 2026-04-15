const admin = require('../firebase/firebaseAdmin')

const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split('Bearer ')[1]
  try {
    const decoded = await admin.auth().verifyIdToken(token)
    console.log('Token email:', decoded.email)
    console.log('Admin emails:', process.env.ADMIN_EMAILS)
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    if (!adminEmails.includes(decoded.email)) {
      return res.status(403).json({ message: 'Forbidden: not an admin' })
    }
    req.user = decoded
    next()
  } catch (err) {
    console.log('Token error:', err.message)
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = verifyAdmin