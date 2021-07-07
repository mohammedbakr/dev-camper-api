// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = (req, res) => {
  res.status(200).json({ success: true, msg: 'All bootcamps' })
}
