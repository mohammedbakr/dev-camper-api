const express = require('express')

const Bootcamp = require('../../models/bootcamp')
const bootcampController = require('../../controllers/bootcamp')
const courseRouter = require('./course')
const advancedresults = require('../../middleware/advancedresults')
const { protect, authorize } = require('../../middleware/auth')

const router = express.Router()

router.get(
  '/',
  advancedresults(Bootcamp, 'courses'),
  bootcampController.getBootcamps
)

router.post(
  '/',
  protect,
  authorize(['publisher', 'admin']),
  bootcampController.postBootcamps
)

router.get('/:id', bootcampController.getBootcamp)

router.put(
  '/:id',
  protect,
  authorize('publisher', 'admin'),
  bootcampController.updateBootcamp
)

router.put(
  '/:id/photo',
  protect,
  authorize('publisher', 'admin'),
  bootcampController.uploadBootcampPhoto
)

router.delete(
  '/:id',
  protect,
  authorize('publisher', 'admin'),
  bootcampController.deleteBootcamp
)

router.get('/radius/:zipcode/:distance', bootcampController.getBootcampInRadius)

// Includer other resource routers
router.use('/:bootcampId/courses', courseRouter)

module.exports = router
