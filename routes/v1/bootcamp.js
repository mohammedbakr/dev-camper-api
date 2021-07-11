const express = require('express')

const Bootcamp = require('../../models/bootcamp')
const bootcampController = require('../../controllers/bootcamp')
const courseRouter = require('./course')
const advancedresults = require('../../middleware/advancedresults')

const router = express.Router()

router.get(
  '/',
  advancedresults(Bootcamp, 'courses'),
  bootcampController.getBootcamps
)

router.post('/', bootcampController.postBootcamps)

router.get('/:id', bootcampController.getBootcamp)

router.put('/:id', bootcampController.updateBootcamp)

router.put('/:id/photo', bootcampController.uploadBootcampPhoto)

router.delete('/:id', bootcampController.deleteBootcamp)

router.get('/radius/:zipcode/:distance', bootcampController.getBootcampInRadius)

// Includer other resource routers
router.use('/:bootcampId/courses', courseRouter)

module.exports = router
