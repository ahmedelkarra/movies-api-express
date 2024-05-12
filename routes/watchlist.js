const express = require('express')
const router = express.Router()
const controllers = require('../controllers/wachlistController')
const auth = require('../middlewares/auth')


router.post('/', controllers.add)
router.delete('/:movie', controllers.delete)
router.get('/', auth.check, controllers.list)

module.exports = router