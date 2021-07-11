const express = require('express')

const courseController = require('../../controllers/course')
const Course = require('../../models/course')
const advancedresults = require('../../middleware/advancedresults')

const router = express.Router({ mergeParams: true })

router.get(
  '/',
  advancedresults(Course, {
    path: 'bootcamp',
    select: 'name description' // if I only want some properties
  }),
  courseController.getCourses
)

router.post('/', courseController.postCourses)

router.get('/:id', courseController.getCourse)

router.put('/:id', courseController.updateCourse)

router.delete('/:id', courseController.deleteCourse)

module.exports = router
