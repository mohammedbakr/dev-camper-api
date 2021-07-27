const crypto = require('crypto')

const User = require('../models/user')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendEmail')

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  const foundUser = await User.findOne({ email })
  if (foundUser) return next(new ErrorResponse('E-Mail already exists!', 409))

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role
  })

  sendTokenResponse(user, 200, res)
})

// @desc      login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // Validate email & password
  if (!email || !password)
    return next(new ErrorResponse('please provide an email and password', 40))

  const user = await User.findOne({ email }).select('+password')
  if (!user) return next(new ErrorResponse('Invalid credentials.', 401))

  // Check if password matches
  const isMatch = await user.matchPassword(password)
  if (!isMatch) return next(new ErrorResponse('Invalid credentials.', 401))

  sendTokenResponse(user, 200, res)
})

// @desc      Get current logged in user
// @route     POST /api/v1/auth/
// @access    Private
exports.getAuth = asyncHandler((req, res, next) => {
  res.status(200).json({ success: true, data: req.user })
})

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })
  res.status(200).json({ success: true, data: {} })
})

// @desc      Update logged in user name and email
// @route     POST /api/v1/auth/updateprofile
// @access    Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const id = req.user.id
  const updatedProfile = {
    name: req.body.name,
    email: req.body.email
  }

  const user = await User.findByIdAndUpdate(id, updatedProfile, {
    new: true,
    runValidators: true
  })

  res.status(200).json({ success: true, data: user })
})

// @desc      Update logged in user password
// @route     POST /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const id = req.user.id
  const currentPassword = req.body.currentpassword
  const newPassword = req.body.newpassword

  const user = await User.findById(id).select('+password')
  if (!user) return next(new ErrorResponse('User not found', 404))

  // Check password
  if (!(await user.matchPassword(currentPassword)))
    return next(new ErrorResponse('Incorrect current password', 422))

  user.password = newPassword
  await user.save()

  sendTokenResponse(user, 200, res)
})

// @desc      Forget password
// @route     POST /api/v1/auth/forgetpassword
// @access    Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user)
    return next(new ErrorResponse('There is no user with that email', 404))

  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetPassword/${resetToken}`

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT to: \n\n ${resetUrl}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    })
    res.status(200).json({ success: true, data: 'email sent' })
  } catch (err) {
    console.log(err)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorResponse('Email could not be sent', 500))
  }
})

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })

  if (!user) return next(new ErrorResponse('Invalid token', 400))

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  sendTokenResponse(user, 200, res)
})

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken()

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }

  // To enable https in production
  if (process.env.NODE_ENV === 'production') options.secure = true

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token })
}
