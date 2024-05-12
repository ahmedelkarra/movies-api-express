const Movie = require('../models/movie')


exports.create = async (req, res) => {
    const { name, category, description } = req.body
    const movie = Movie({ name, category, description })
    await movie.save()
    res.json({ massege: true, data: movie })
}

exports.find = async (req, res) => {
    const { id } = req.params
    try {
        const movie = await Movie.findById(id).select('-reviews')
        if (!movie) return res.status(404).send()
        res.json({ massege: true, data: movie })
    } catch (error) {
        res.status(404).send()
    }
}

exports.update = async (req, res) => {
    const { id } = req.params
    try {
        const { name, category, description } = req.body
        const movie = await Movie.findById(id)
        if (movie) {
            await Movie.updateOne({ _id: id }, { $set: { name, category, description } })
            res.json({ massege: true })
        } else {
            res.status(404).send()
        }
    } catch (error) {
        res.status(404).send()
    }
}

exports.delete = async (req, res) => {
    const { id } = req.params
    try {
        const { name, category, description } = req.body
        const movie = await Movie.findById(id)
        if (movie) {
            await Movie.deleteOne({ _id: id })
            res.json({ massege: true })
        } else {
            res.status(404).send()
        }
    } catch (error) {
        res.status(404).send()
    }
}

exports.list = async (req, res) => {
    const page = req?.query?.page || 1
    const limit = 20
    const skip = (page - 1) * limit
    const movie = await Movie.find().select('-reviews').skip(skip).limit(limit)
    const total = await Movie.countDocuments()
    const pages = Math.ceil(total / limit)
    res.json({ massege: true, pages: pages, data: movie })
}

exports.reviews = async (req, res) => {
    const { id } = req.params
    try {
        const movie = await Movie.findById(id).select('-reviews._id').populate("reviews.user", ['name', 'email'])
        if (!movie) return res.status(404).send()
        res.status(200).json({ massege: true, data: movie.reviews })
    } catch (error) {
        res.status(404).send()
    }
}

exports.addReview = async (req, res) => {
    const { id } = req.params
    try {
        const movie = await Movie.findById(id)
        const { comment, rate } = req.body
        if (!movie) return res.status(404).send()
        const isRated = movie.reviews.findIndex(m => m.user == req.userId)
        if (isRated > -1) return res.status(403).send({ message: "Review Is Already Added" })
        const totalRate = movie.reviews.reduce((sum, review) => sum + review.rate, 0)
        const finalRate = (totalRate + rate) / (movie.reviews.length + 1)
        await Movie.updateOne({ _id: id }, { $push: { reviews: { user: req.userId, comment, rate } }, $set: { rate: finalRate } })
        res.status(201).json({ massege: true, data: movie })
    } catch (error) {
        res.status(404).send()
    }
}