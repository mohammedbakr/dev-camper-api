const Bootcamp = require('../models/bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const fileHelper = require('../utils/file')

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access Private
exports.postBootcamps = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id
  const bootcamp = await Bootcamp.create(req.body)

  res.status(201).json({ success: true, data: bootcamp })
})

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const bootcamp = await Bootcamp.findById(id)

  if (!bootcamp)
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404))

  res.status(200).json({ success: true, data: bootcamp })
})

// @desc      Update single bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  let bootcamp = await Bootcamp.findById(id)

  if (!bootcamp)
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404))

  if (bootcamp.user.toString() !== req.user.id.toString())
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to update the bootcamp`,
        403
      )
    )

  bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({ success: true, data: bootcamp })
})

// @desc      Delete single bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const bootcamp = await Bootcamp.findById(id)

  if (!bootcamp)
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404))

  if (bootcamp.user.toString() !== req.user.id.toString())
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to delete the bootcamp`,
        403
      )
    )

  if (bootcamp.photo && bootcamp.photo !== 'no-photo.jpg') {
    fileHelper.deleteFile(bootcamp.photo)
  }

  await bootcamp.remove()

  res.status(200).json({ success: true, data: {} })
})

// @desc      Get bootcamp with in a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Public
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  // Get lat & lng from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  // Calc radius using radians
  // Divide dist by radius of earth
  // Earth Radius = 3,963 mi / 6,3378 km
  const radius = distance / 3963 // in mile

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] }
    }
  })

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })
})

// @desc      upload bootcamp photo
// @route     DELETE /api/v1/bootcamps/:id/photo
// @access    Private
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const id = req.params.id
  const image = req.file

  const bootcamp = await Bootcamp.findById(id)

  if (!bootcamp)
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404))

  if (bootcamp.user.toString() !== req.user.id.toString())
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to update the bootcamp photo`,
        403
      )
    )

  if (!req.file) return next(new ErrorResponse(`Please upload an image`, 400))

  if (bootcamp.photo && bootcamp.photo !== 'no-photo.jpg') {
    fileHelper.deleteFile(bootcamp.photo)
    bootcamp.photo = image.path
  }

  if (image.size > process.env.MAX_FILE_UPLOAD)
    return next(
      new ErrorResponse(
        `Please upload an image with max size of ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    )

  await Bootcamp.findByIdAndUpdate(id, { photo: image.path })

  res.status(200).json({ success: true, data: image.path })
})
