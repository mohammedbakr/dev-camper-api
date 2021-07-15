const express = require('express')

const authController = require('../../controllers/auth')
const { protect } = require('../../middleware/auth')

const router = express.Router()

router.get('/', protect, authController.getAuth)

router.post('/register', authController.register)

router.post('/login', authController.login)

module.exports = router
