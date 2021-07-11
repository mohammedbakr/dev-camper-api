const multer = require('multer')

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
// filtering files to accept images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

module.exports = multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single('photo')
