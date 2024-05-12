const User = require('../models/user')

exports.check = async (req, res, next) => {
    const user = await User.findById(req.userId)
    try {
        user.isAdmin ? next() : res.status(403).json({ message: 'Forbidden' })
    } catch (error) {
        res.status(403).json({ message: 'Forbidden' })
    }
}