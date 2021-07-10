const express = require('express')

const courseController = require('../../controllers/course')

const router = express.Router({ mergeParams: true })

router.get('/', courseController.getCourses)

router.post('/', courseController.postCourses)

router.get('/:id', courseController.getCourse)

router.put('/:id', courseController.updateCourse)

router.delete('/:id', courseController.deleteCourse)

module.exports = router
