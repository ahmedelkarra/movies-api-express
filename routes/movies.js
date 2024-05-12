const express = require('express')
const router = express.Router()
const controllers = require('../controllers/moviesController')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')


router.post('/', [auth.check, admin.check], controllers.create)
router.put('/:id', [auth.check, admin.check], controllers.update)
router.delete('/:id', [auth.check, admin.check], controllers.delete)


router.get('/', auth.check, controllers.list)
router.get('/:id', auth.check, controllers.find)

router.post('/:id/reviews', auth.check, controllers.addReview)
router.get('/:id/reviews', auth.check, controllers.reviews)


module.exports = router