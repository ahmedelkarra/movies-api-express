const User = require('../models/user')
const jwtHelpers = require('../utils/jwtHelpers')
const bcrypt = require('bcrypt')

exports.login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    try {
        if (user && bcrypt.compareSync(password.toString(), user.password)) {
            res.json({ massege: "login", data: { id: user._id, name: user.name, accessToken: jwtHelpers.sign({ sub: user._id }) } })
        } else {
            res.status(401).json({ massege: "Invalid Credentials" })
        }
    } catch (error) {
        res.status(401).json({ massege: "Invalid Credentials" })
    }
}

exports.register = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const user = User({ name, email, password: bcrypt.hashSync(password.toString(), 10) })
        await user.save()
        res.json({ message: true })
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" })
    }
}

exports.me = async (req, res) => {
    const user = await User.findById(req.userId)
    res.json({ message: true, data: { id: user.id, name: user.name, email: user.email } })
}