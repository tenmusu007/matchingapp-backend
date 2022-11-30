const router = require("express").Router();
const {
	getImageForProfile,
	getImageForChatList,
	getImageForChat,
} = require("../controllers/image");

router.post("/profileimage", getImageForProfile);
router.post("/chatlistimage", getImageForChatList);
router.post("/userimage", getImageForChat);
module.exports = router;
