const Chat = require("../models/Chat");
const Users = require("../models/Users");
const User = require("../models/Users");
const {
	getImageForHome,
	getImageForChatList,
} = require("../helper/addImageUrl");
const getChatList = async (req, res) => {
	try {
		const chatList1 = await Chat.find({ user1: req.session.id });
		const chatList2 = await Chat.find({ user2: req.session.id });
		const list = [...chatList1, ...chatList2];
		const userAndRoomInfo = [];
		if (list.length > 0) {
			for (const item of list) {
				if (item.user1 === req.session.id) {
					const userInfo = await User.findById(item.user2.toString());
					const userInfoWithImage = await getImageForChatList(userInfo)
					userAndRoomInfo.push({ userInfo, createdChat: item });
				} else {
					const userInfo = await User.findById(item.user1.toString());
					const userInfoWithImage = await getImageForChatList(userInfo)
					userAndRoomInfo.push({ userInfo, createdChat: item });
				}
			}
			return res.status(200).json(userAndRoomInfo);
		} else {
			return res.status(200).json([]);
		}
	} catch (err) {
		res.status(500).json(err);
	}
};
const saveChat = async (req, res) => {
	try {
		const chatRoom = await Chat.findById(req.body.room_id);
		const saveText = await chatRoom.updateOne({
			$set: {
				text: [...chatRoom.text, req.body.newText],
			},
		});
		res.status(200).json(chatRoom);
	} catch (err) {
		res.status(500).json(err);
	}
};
const getChat = async (req, res) => {
	try {
		const chatInfo = await Chat.findById(req.body.room_id);
		if (chatInfo !== undefined) {
			if (chatInfo.user1 === req.session.id) {
				const userInfo = await Users.findById(chatInfo.user1);
				// console.log("info",userInfo);
				const addUrl = await getImageForChatList(userInfo);
				console.log(addUrl);
				res.status(200).json(chatInfo);
			} else {
				const userInfo = await Users.findById(chatInfo.user2);
				// console.log("info",userInfo);
				const addUrl = await getImageForChatList(userInfo);				
				console.log(addUrl);
				res.status(200).json(chatInfo);
			}
		} else {
			res.status(200).json([]);
		}
	} catch (err) {
		res.status(500).json(err);
	}
};
module.exports = { getChatList, saveChat, getChat };
