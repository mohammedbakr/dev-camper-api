const Course = require('../models/course')
const Bootcamp = require('../models/bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc      Get all courses with filters
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampsId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  const bootcampId = req.params.bootcampId

  if (bootcampId) {
    // Each bootcamp courses
    const bootcamp = await Bootcamp.findById(bootcampId)
    if (!bootcamp)
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${bootcampId}`, 404)
      )

    const courses = await Course.find({ bootcamp: bootcampId })

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    })
  } // All courses
  else res.status(200).json(res.advancedResults)
})

// @desc      Create new course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.postCourses = asyncHandler(async (req, res, next) => {
  const bootcampId = req.params.bootcampId
  req.body.bootcamp = bootcampId
  req.body.user = req.user.id

  const bootcamp = await Bootcamp.findById(bootcampId)
  if (!bootcamp)
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${bootcampId}`, 404)
    )

  if (bootcamp.user.toString() !== req.user.id.toString())
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to add a course to bootcamp ${bootcamp.name}`,
        403
      )
    )

  const course = await Course.create(req.body)

  res.status(201).json({ success: true, data: course })
})

// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const course = await Course.findById(id).populate({
    path: 'bootcamp',
    select: 'name description' // if I only want some properties
  })

  if (!course)
    return next(new ErrorResponse(`course not found with id of ${id}`, 404))

  res.status(200).json({ success: true, data: course })
})

// @desc      Update single course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  let course = await Course.findById(id)

  if (!course)
    return next(new ErrorResponse(`course not found with id of ${id}`, 404))

  if (
    course.user.toString() !== req.user.id.toString() &&
    req.user.role !== 'admin'
  )
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to update the course`,
        403
      )
    )

  course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({ success: true, data: course })
})

// @desc      Delete single course
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const course = await Course.findById(id)

  if (!course)
    return next(new ErrorResponse(`course not found with id of ${id}`, 404))

  if (
    course.user.toString() !== req.user.id.toString() &&
    req.user.role !== 'admin'
  )
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to delete the course`,
        403
      )
    )

  await course.remove()

  res.status(200).json({ success: true, data: {} })
})
