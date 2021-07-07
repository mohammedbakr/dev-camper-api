const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    if (process.env.NODE_ENV === 'development')
      console.log('MongoDB connected...')
  } catch (err) {
    console.log(err.message)

    process.exit(1)
  }
}

module.exports = connectDB
