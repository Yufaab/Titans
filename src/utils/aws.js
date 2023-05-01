const AWS = require('aws-sdk');
const { awsAccessId, awsSecretKey, bucketName } = require('../config/vars');

const s3 = new AWS.S3({
  accessKeyId: awsAccessId, 
  secretAccessKey: awsSecretKey,
  Bucket: bucketName, 
});

exports.getDataFromS3 = async (year) => {
  const params = {
    Bucket: bucketName,
    Key: `${year}/round6.csv`, 
  };
  const data = await s3download(params);
  return data.Body;
}

const s3download = function (params) {
  return new Promise((resolve, reject) => {
    s3.createBucket({  Bucket: bucketName }, () => {
      s3.getObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          console.log("Successfully dowloaded data from  bucket");
          resolve(data);
        }
      });
    });
  });
}