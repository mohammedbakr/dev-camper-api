const express = require('express')
const dotenv = require('dotenv')

// Load env vars
dotenv.config({ path: './config/config.env' })

const app = express()

// Init Routes
// Routes files
const authRoutes = require('./routes/v1/auth')
const usersRoutes = require('./routes/v1/user')
const bootcampsRoutes = require('./routes/v1/bootcamp')
const coursesRoutes = require('./routes/v1/course')
const reviewsRoutes = require('./routes/v1/review')
// Mount routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', usersRoutes)
app.use('/api/v1/bootcamps', bootcampsRoutes)
app.use('/api/v1/courses', coursesRoutes)
app.use('/api/v1/reviews', reviewsRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
)
