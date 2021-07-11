const express = require('express')

const bootcampController = require('../../controllers/bootcamp')
const courseRouter = require('./course')

const router = express.Router()

router.get('/', bootcampController.getBootcamps)

router.post('/', bootcampController.postBootcamps)

router.get('/:id', bootcampController.getBootcamp)

router.put('/:id', bootcampController.updateBootcamp)

router.put('/:id/photo', bootcampController.uploadBootcampPhoto)

router.delete('/:id', bootcampController.deleteBootcamp)

router.get('/radius/:zipcode/:distance', bootcampController.getBootcampInRadius)

// Includer other resource routers
router.use('/:bootcampId/courses', courseRouter)

module.exports = router
