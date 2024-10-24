// utils/s3.js
import AWS from "aws-sdk";

AWS.config.update({ region: "ap-south-1" });

const s3 = new AWS.S3();

export const getPreSignedUrl = (
  bucketName: string,
  objectKey: string
): string => {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Expires: 60 * 5, // URL expiration time in seconds
  };

  return s3.getSignedUrl("getObject", params);
};
