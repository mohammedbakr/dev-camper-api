const path = require('path')

const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')

// Routes files
const authRoutes = require('./routes/v1/auth')
const usersRoutes = require('./routes/v1/user')
const bootcampsRoutes = require('./routes/v1/bootcamp')
const coursesRoutes = require('./routes/v1/course')
const reviewsRoutes = require('./routes/v1/review')
// MongoDb file
const connectDB = require('./config/db')
// Error handler
const { notFound, errorHandler } = require('./middleware/error')
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

// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Enable CORS
app.use(cors())

// // Prevent XSS attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Multer
app.use(multer)
// Serving public folder as static
app.use('/', express.static(path.join(__dirname, 'public')))
// Serving images as static
app.use('/images', express.static(path.join(__dirname, 'images')))

// Mount routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', usersRoutes)
app.use('/api/v1/bootcamps', bootcampsRoutes)
app.use('/api/v1/courses', coursesRoutes)
app.use('/api/v1/reviews', reviewsRoutes)

// Error handler middlewares
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'

app.listen(PORT, () =>
  console.log(`Server is running in ${NODE_ENV} mode on port ${PORT}`)
)
