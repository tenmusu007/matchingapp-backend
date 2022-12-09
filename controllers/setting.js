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

const updateInfo = async (req, res) => {
	try {
		const update = await JSON.parse(req.body.userInfo);
		const checkImage = await Images.findOne({ user_id: update._id });
		const user = await User.findById(update._id);
		if (req.file) {
			console.log("pic");
			if (checkImage.path === "none") {
				console.log("first pic");
				const hashImageName = await bcrypt
					.hash(update._id, 12)
					.then((hashedPassword) => {
						return hashedPassword;
					});
				const deletedHashImageName = hashImageName.replace(/\/$/, "");
				// console.log("hashImageName", hashImageName);
				const params = await {
					Bucket: bucketName,
					Key: deletedHashImageName,
					Body: req.file.buffer,
					ContentType: req.file.mimetype,
				};
				console.log("params",params);
				const command = new PutObjectCommand(params);
				await s3.send(command);
				// const newImage = new Images({
				// 	user_id: update._id,
				// 	path: hashImageName,
				// });
				const newImage = await checkImage.updateOne({
					$set: {
						path: deletedHashImageName,
					},
				});
				await newImage.save();
			} else if (checkImage.path !== "none") {
				console.log("not first pic");
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
		} else {
			console.log("no pic");
		}
		const userImagePath = await Images.findOne({ user_id: update._id });
		console.log(userImagePath);
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
		res.status(200).json(selectedUser);
	} catch (err) {
		res.status(500).json(err);
	}
};
const updateImage = async (req, res) => {};
module.exports = { updateInfo, updateImage };
