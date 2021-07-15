const express = require('express')

const courseController = require('../../controllers/course')
const Course = require('../../models/course')
const advancedresults = require('../../middleware/advancedresults')
const { protect, authorize } = require('../../middleware/auth')

const router = express.Router({ mergeParams: true })

router.get(
  '/',
  advancedresults(Course, {
    path: 'bootcamp',
    select: 'name description' // if I only want some properties
  }),
  courseController.getCourses
)

router.post(
  '/',
  protect,
  authorize('publisher', 'admin'),
  courseController.postCourses
)

router.get('/:id', courseController.getCourse)

router.put(
  '/:id',
  protect,
  authorize('publisher', 'admin'),
  courseController.updateCourse
)

router.delete(
  '/:id',
  protect,
  authorize('publisher', 'admin'),
  courseController.deleteCourse
)

module.exports = router
