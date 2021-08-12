const nodeGeocoder = require('node-geocoder')

const options = {
  provider: process.env.GEOCODER_PROVIDER || 'mapquest',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY || '1MKUaJQUzaClNzbXkGukqYyGyd40VSXo',
  formatter: null
}

const geocoder = nodeGeocoder(options)

module.exports = geocoder
