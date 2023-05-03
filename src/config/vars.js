require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  mongouri: process.env.MONGOURI,
  awsAccessId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucketName: process.env.BUCKET_NAME,
  rpayKey: process.env.YOUR_KEY_ID,
  rpaySecret: process.env.YOUR_KEY_SECRET,
  rpayMerchant: process.env.RAZORPAYMERCHANTID,
};
