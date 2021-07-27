const express = require('express')

const authController = require('../../controllers/auth')
const { protect } = require('../../middleware/auth')

const router = express.Router()

router.get('/', protect, authController.getAuth)

router.put('/updateprofile', protect, authController.updateProfile)

router.put('/updatepassword', protect, authController.updatePassword)

router.post('/register', authController.register)

router.post('/login', authController.login)

// if token is in the Cookie
// router.get('/logout', authController.logout)

router.post('/forgetpassword', authController.forgetPassword)

router.put('/resetpassword/:resettoken', authController.resetPassword)

module.exports = router
