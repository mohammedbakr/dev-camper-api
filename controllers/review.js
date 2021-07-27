const Bootcamp = require('../models/bootcamp')
const Review = require('../models/review')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc      Get all reviews & for each bootcamp
// @route     GET /api/v1/reviews
// @route     GET /api/v1/bootcamps/:bootcampsId/reviews
// @access    Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  const bootcampId = req.params.bootcampId

  if (bootcampId) {
    // Each bootcamp reviews
    const bootcamp = await Bootcamp.findById(bootcampId)
    if (!bootcamp)
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${bootcampId}`, 404)
      )

    const reviews = await Review.find({ bootcamp: bootcampId })

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } // All reviews
  else res.status(200).json(res.advancedResults)
})

// @desc      Create new review
// @route     POST /api/v1/bootcamps/:bootcampId/reviews
// @access    Private
exports.postReviews = asyncHandler(async (req, res, next) => {
  const bootcampId = req.params.bootcampId
  req.body.bootcamp = bootcampId
  req.body.user = req.user.id

  const bootcamp = await Bootcamp.findById(bootcampId)
  if (!bootcamp)
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${bootcampId}`, 404)
    )

  const review = await Review.create(req.body)

  res.status(201).json({ success: true, data: review })
})

// @desc      Get single review
// @route     GET /api/v1/reviews/:id
// @access    Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const review = await Review.findById(id).populate({
    path: 'bootcamp',
    select: 'name description' // if I only want some properties
  })

  if (!review)
    return next(new ErrorResponse(`Review not found with id of ${id}`, 404))

  res.status(200).json({ success: true, data: review })
})

// @desc      Update single review
// @route     PUT /api/v1/reviews/:id
// @access    Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  let review = await Review.findById(id)

  if (!review)
    return next(new ErrorResponse(`Review not found with id of ${id}`, 404))

  if (
    review.user.toString() !== req.user.id.toString() &&
    req.user.role !== 'admin'
  )
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to update the review`,
        403
      )
    )

  review = await Review.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({ success: true, data: review })
})

// @desc      Delete single review
// @route     DELETE /api/v1/reviews/:id
// @access    Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const review = await Review.findById(id, req.body)

  if (!review)
    return next(new ErrorResponse(`review not found with id of ${id}`, 404))

  if (
    review.user.toString() !== req.user.id.toString() &&
    req.user.role !== 'admin'
  )
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to delete the review`,
        403
      )
    )

  await review.remove()

  res.status(200).json({ success: true, data: {} })
})
