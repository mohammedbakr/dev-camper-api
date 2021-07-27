const fs = require('fs')
const path = require('path')

const mongoose = require('mongoose')
const dotenv = require('dotenv')

// Load env vars
dotenv.config({ path: './config/config.env' })

// Load models
const User = require('./models/user')
const Bootcamp = require('./models/bootcamp')
const Course = require('./models/course')
const Review = require('./models/review')

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

// Load JSON files
const user = JSON.parse(
  fs.readFileSync(path.join(__dirname, '_data', 'users.json'), 'utf-8')
)
const bootcamp = JSON.parse(
  fs.readFileSync(path.join(__dirname, '_data', 'bootcamps.json'), 'utf-8')
)
const course = JSON.parse(
  fs.readFileSync(path.join(__dirname, '_data', 'courses.json'), 'utf-8')
)
const review = JSON.parse(
  fs.readFileSync(path.join(__dirname, '_data', 'reviews.json'), 'utf-8')
)

// Import into Db
const importData = async () => {
  try {
    await User.create(user)
    await Bootcamp.create(bootcamp)
    await Course.create(course)
    await Review.create(review)

    console.log('Data Imported...')
    process.exit(1)
  } catch (err) {
    console.error(err)
  }
}

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany()
    await Bootcamp.deleteMany()
    await Course.deleteMany()
    await Review.deleteMany()

    console.log('Data Destroyed...')
    process.exit(1)
  } catch (err) {
    console.error(err)
  }
}

if (process.argv[2] === '-i') {
  importData()
} else if (process.argv[2] === '-d') {
  deleteData()
}
