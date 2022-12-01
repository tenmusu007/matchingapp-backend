const Images = require("../models/Images");
const { getImageFromS3 } = require("./getImageFromS3");


const getImageForChatList = async (userData) => {
	const image = await Images.findOne({
		user_id: userData._id.toString(),
	});
	if (image) {
    const url = await getImageFromS3(image.path);
    userData.image = url
    return userData
	} else {
    return userData
	}
};
const getImageForHome = async (userData) => {
  const getImageForUserList = userData.map(async(item) => {
    const image = await Images.findOne({
      user_id: item._id.toString(),
    });
    if (image) {
      const url = await getImageFromS3(image.path);
      userData.image = url
      return userData
    } else {
      userData.image = "nothing"
      return userData
    }
  })
  console.log("getImageForUse rList",getImageForUserList);
  return getImageForUserList;
}
module.exports = { getImageForChatList, getImageForHome };
