const StatusCodes = require('http-status');
const Review = require('../../model/reviews');

exports.uploadReviews = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(StatusCodes.OK).send({
      status: 'Review created successfully',
      data: {
        review,
      },
    });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send({
      status: 'Review not uploaded',
      error: err,
    });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(StatusCodes.OK).send({
      status: 'Review fetched successfully',
      data: {
        reviews,
      },
    });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send({
      status: 'Reviews finding failed with error',
      error: err,
    });
  }
};