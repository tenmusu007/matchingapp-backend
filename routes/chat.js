const router = require("express").Router();
const {
	getChatList,
	saveChat,
	getChat,
	deleteChat,
} = require("../controllers/chat");
router.get("/getchatlist", getChatList);
router.post("/savechat", saveChat);
router.post("/getchat", getChat);
router.post("/deletechat", deleteChat);
module.exports = router;
