const express = require('express')

const bootcampController = require('../../controllers/bootcamp')

const router = express.Router()

router.get('/', bootcampController.getBootcamps)

router.post('/', bootcampController.postBootcamps)

router.get('/:id', bootcampController.getBootcamp)

router.put('/:id', bootcampController.updateBootcamp)

router.delete('/:id', bootcampController.deleteBootcamp)

module.exports = router
