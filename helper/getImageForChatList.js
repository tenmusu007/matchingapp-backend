const Images = require("../models/Images");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getImageFromS3 } = require("../helper/getImageFromS3");
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
	credentials: {
		accessKeyId: accessKey,
		secretAccessKey: secretAccessKey,
	},
	region: bucketRegion,
});

const getImageForChatList = async (userData) => {
	const urlArray = [];
console.log("data", userData);
	const image = await Images.findOne({
		user_id: userData._id.toString(),
	});
	if (image) {
    const url = await getImageFromS3(image.path);
    const newObj = { ...userData, "image": url }
    console.log("newObj", newObj);
		await urlArray.push(url);
	} else {
		await urlArray.push("string");
	}
	console.log("helper Arr", urlArray);
};
module.exports = { getImageForChatList };
