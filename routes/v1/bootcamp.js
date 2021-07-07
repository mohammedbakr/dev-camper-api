const express = require('express')

const bootcampController = require('../../controllers/bootcamp')

const router = express.Router()

router.get('/', bootcampController.getBootcamps)

module.exports = router
