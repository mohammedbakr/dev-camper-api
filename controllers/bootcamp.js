const mongoose = require('mongoose')

const Bootcamp = require('../models/bootcamp')

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = async (req, res) => {
  try {
    const bootcamps = await Bootcamp.find()

    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps })
  } catch (err) {
    console.log(err.message)

    res.status(500).json({ success: false, msg: 'Server Error!' })
  }
}

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access Private
/*
exports.postBootcamps = async (req, res) => {
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
exports.postBootcamps = async (req, res) => {
  try {
    const bootcamp = await Bootcamp.create(req.body)

    res.status(201).json({ success: true, data: bootcamp })
  } catch (err) {
    console.log(err.message)

    res.status(500).json({ success: false, msg: 'Server Error!' })
  }
}

// @desc Get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = async (req, res) => {
  try {
    const id = req.params.id

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, msg: 'Malformed ID' })

    const bootcamp = await Bootcamp.findById(id)

    if (!bootcamp)
      return res
        .status(404)
        .json({ success: false, msg: 'Bootcamp not found.' })

    res.status(200).json({ success: true, data: bootcamp })
  } catch (err) {
    console.log(err.message)

    res.status(500).json({ success: false, msg: 'Server Error!' })
  }
}

// @desc Update single bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = async (req, res) => {
  try {
    const id = req.params.id

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, msg: 'Malformed ID' })

    const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })

    if (!bootcamp)
      return res
        .status(404)
        .json({ success: false, msg: 'Bootcamp not found.' })

    res.status(200).json({ success: true, data: bootcamp })
  } catch (err) {
    console.log(err.message)

    res.status(500).json({ success: false, msg: 'Server Error!' })
  }
}

// @desc Delete single bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = async (req, res) => {
  try {
    const id = req.params.id

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, msg: 'Malformed ID' })

    const bootcamp = await Bootcamp.findByIdAndDelete(id)

    if (!bootcamp)
      return res
        .status(404)
        .json({ success: false, msg: 'Bootcamp not found.' })

    res.status(200).json({ success: true, data: {} })
  } catch (err) {
    console.log(err.message)

    res.status(500).json({ success: false, msg: 'Server Error!' })
  }
}
