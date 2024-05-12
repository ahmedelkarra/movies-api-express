const express = require('express')
const router = express.Router()
const controllers = require('../controllers/authController')
const auth = require('../middlewares/auth')


router.post('/login', controllers.login)
router.post('/register', controllers.register)
router.get('/me', auth.check ,controllers.me)

module.exports = router