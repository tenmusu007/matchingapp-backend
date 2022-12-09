const User = require("../models/Users");
const Images = require("../models/Images");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const randomImageName = (bytes = 32) =>
	crypto.randomBytes(bytes).toString("hex");
const bcrypt = require("bcrypt");

const sharp = require("sharp");
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
const { selectedUserData } = require("../helper/selectedUserData");
const { getImageForChatList } = require("../helper/addImageUrl");

const updateInfo = async (req, res) => {
	try {
		const update = await JSON.parse(req.body.userInfo);
		const checkImage = await Images.findOne({ user_id: update._id });
		const user = await User.findById(update._id);
		if (req.file) {
			if (checkImage.path === "none") {
				const hashImageName = await bcrypt
					.hash(update._id, 12)
					.then((hashedPassword) => {
						return hashedPassword;
					});
				const deletedHashImageName = hashImageName
					.replace(/\//g, "")
					.replace(/\./g, "");
				const params = await {
					Bucket: bucketName,
					Key: deletedHashImageName,
					Body: req.file.buffer,
					ContentType: req.file.mimetype,
				};
				const command = new PutObjectCommand(params);
				await s3.send(command);
				await checkImage.updateOne({
					$set: {
						path: deletedHashImageName,
					},
				});
			} else if (checkImage.path !== "none") {
				const userImagePath = await Images.findOne({ user_id: update._id });
				const params = {
					Bucket: bucketName,
					Key: userImagePath.path,
					Body: req.file.buffer,
					ContentType: req.file.mimetype,
				};
				const command = new PutObjectCommand(params);
				await s3.send(command);
			}
		} 
		const userImagePath = await Images.findOne({ user_id: update._id });
		await user.updateOne({
			$set: {
				username: update.username,
				course: update.course,
				sexual_orientation: update.sexual_orientation,
				age: update.age,
				about: update.about,
				gender: update.gender,
				interests: update.interests,
				image: userImagePath.path,
			},
		});
		const updateUser = await User.findById(update._id);
		const selectedUser = await selectedUserData({ ...updateUser._doc });
		const addUrl = await getImageForChatList(selectedUser)
		// console.log("add", addUrl);
		res.status(200).json(addUrl);
	} catch (err) {
		res.status(500).json(err);
	}
};
const updateImage = async (req, res) => {};
module.exports = { updateInfo, updateImage };
