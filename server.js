const path = require('path')

const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

// Routes files
const authRoutes = require('./routes/v1/auth')
const usersRoutes = require('./routes/v1/user')
const bootcampsRoutes = require('./routes/v1/bootcamp')
const coursesRoutes = require('./routes/v1/course')
const reviewsRoutes = require('./routes/v1/review')
// MongoDb file
const connectDB = require('./config/db')
// Error handler
const errorHandler = require('./middleware/error')
// Multer file
const multer = require('./utils/multer')

// Load env vars
dotenv.config({ path: './config/config.env' })

const app = express()

// Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// DB Connection
connectDB()

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Multer
app.use(multer)
// Serving images as static
app.use('/images', express.static(path.join(__dirname, 'images')))

// Mount routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', usersRoutes)
app.use('/api/v1/bootcamps', bootcampsRoutes)
app.use('/api/v1/courses', coursesRoutes)
app.use('/api/v1/reviews', reviewsRoutes)

// Error handler middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
)
