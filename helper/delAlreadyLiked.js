const User = require("../models/Users");

const delAlredyLiked = async (likedList, getUserList, sexualOrientation) => {
	const toList = likedList.map((item) => {
		return item.to;
	});
	const userList = getUserList.map((item) => {
		return item._id.toString();
	});
	const allTogther = [...new Set([...toList, ...userList])];
	const romovedUser = allTogther.filter((val) => {
		return !toList.includes(val) || !userList.includes(val);
	});
	const delLiked = [];
	for (const item of romovedUser) {
		const user = await User.findById(item);
		delLiked.push(user);
	}
	const filteredByGender = await delLiked.filter((item) => {
		for (const currentUserSexualOrientation of sexualOrientation) {
			if (item.gender === currentUserSexualOrientation.id) {
				return item;
			}
		}
	});
	return filteredByGender;
};
module.exports = { delAlredyLiked };
