const express = require('express')

const Review = require('../../models/review')
const {
  getReviews,
  postReviews,
  getReview,
  updateReview,
  deleteReview
} = require('../../controllers/review')
const advancedresults = require('../../middleware/advancedresults')
const { protect, authorize } = require('../../middleware/auth')

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(
    advancedresults(Review, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), postReviews)

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview)

module.exports = router
