const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.add = async (req, res) => {
    const { movie, watched } = req.body
    const token = req.headers.authorization
    try {
        const getId = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
        const user = await User.findById(getId.sub)
        const index = user.watchList.findIndex(e => e.movie == movie)
        if (index > -1) {
            user.watchList[index].watched = watched
        } else {
            user.watchList.push({ movie, watched })
        }
        await user.save()
        res.json({ massege: true })
    } catch (error) {
        res.status(403).json({ massege: error })
    }
}

exports.delete = async (req, res) => {
    const { movie } = await req.params
    const token = req.headers.authorization
    try {
        const getId = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
        const user = await User.findById(getId.sub)
        console.log(user);
        user.watchList = user.watchList.filter(e => e.movie != movie)
        await user.save()
        res.json({ massege: true })
    } catch (error) {
        res.status(403).json({ massege: error })
    }
}

exports.list = async (req, res) => {
    const token = req.headers.authorization
    try {
        const getId = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
        const user = await User.findById(getId.sub).select('-watchList._id').populate('watchList.movie', ['name', 'category'])
        res.json({ massege: true, data: user.watchList })
    } catch (error) {
        res.json({ massege: error })
    }
}