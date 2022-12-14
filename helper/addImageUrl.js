const Images = require("../models/Images");
const { getImageFromS3 } = require("./getImageFromS3");

const getImageForChatList = async (userData) => {
	const image = await Images.findOne({
		user_id: userData._id.toString(),
	});
	if (image.path !== "none") {
		const url = await getImageFromS3(image.path);
		userData.image = url;
		return userData;
	} else {
		return userData;
	}
};
const getImageForHome = async (userData) => {
	for (const item of userData) {
		const image = await Images.findOne({
			user_id: item._id.toString(),
		});
		if (image.path !== "none") {
			const url = await getImageFromS3(image.path);
			item.image = url;
		} 
	}
	// return getImageForUserList;
	return userData;
};
module.exports = { getImageForChatList, getImageForHome };
