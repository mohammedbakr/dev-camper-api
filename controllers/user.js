const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/user')

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const user = await User.findById(id)

  console.log(user)

  if (!user)
    return next(new ErrorResponse(`User not found with id of ${id}`, 404))

  res.status(200).json({
    success: true,
    data: user
  })
})

// @desc      Create user
// @route     POST /api/v1/users
// @access    Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body)

  res.status(201).json({
    success: true,
    data: user
  })
})

// @desc      Update user
// @route     PUT /api/v1/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  })

  if (!user)
    return next(new ErrorResponse(`User not found with id of ${id}`, 404))

  res.status(200).json({
    success: true,
    data: user
  })
})

// @desc      Delete user
// @route     DELETE /api/v1/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const user = await User.findByIdAndDelete(id)

  if (!user)
    return next(new ErrorResponse(`User not found with id of ${id}`, 404))

  res.status(200).json({
    success: true,
    data: {}
  })
})
