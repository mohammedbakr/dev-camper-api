const mongoose = require('mongoose')

const Bootcamp = require('../models/bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find()

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps })
})

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access Private
/*
exports.postBootcamps = async (req, res, next) => {
  const {
    name,
    description,
    website,
    phone,
    email,
    address,
    careers,
    housing,
    jobAssistance,
    jobGuarantee,
    acceptGi
  } = req.body

  try {
    const bootcamp = new Bootcamp({
      name,
      description,
      website,
      phone,
      email,
      address,
      careers,
      housing,
      jobAssistance,
      jobGuarantee,
      acceptGi
    })

    const result = await bootcamp.save()
    res.status(201).json({ msg: 'Bootcamp created successfully', data: result })
  } catch (err) {
    console.log(err.message)

    res.status(500).json({ msg: 'Server Error!' })
  }
}
*/
exports.postBootcamps = asyncHandler(async (req, res, next) => {
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

  const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  })

  if (!bootcamp)
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404))

  res.status(200).json({ success: true, data: bootcamp })
})

// @desc      Delete single bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const bootcamp = await Bootcamp.findByIdAndDelete(id)

  if (!bootcamp)
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404))

  res.status(200).json({ success: true, data: {} })
})
