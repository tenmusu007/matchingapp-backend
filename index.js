const express = require("express");
const app = express();
const port = 8000;
const cookieSession = require("cookie-session");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const settingRoute = require("./routes/setting");
const interestsRoute = require("./routes/interests");
const likesRoute = require("./routes/likes");
const chatRoute = require("./routes/chat");
const imageRoute = require("./routes/image");
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("trust proxy", 1);
app.use(
	cookieSession({
		name: "id",
		keys: ["key1", "key2"],
		secure: true,
		sameSite: "none",	
		// httpOnly : false
	})
);
// app.set("trust proxy", process.env.FRONT_URL);
app.use(
	cors({
		origin: [
			process.env.FRONT_URL,
			"http://localhost:3000",
			"https://chatlist.d1q845p9ygn1yh.amplifyapp.com",
		],
		methods: ["GET", "POST", "DELETE"],
		credentials: true,
	})
);
app.use("/auth", authRoute);
app.use("/setting", settingRoute);
app.use("/interest", interestsRoute);
app.use("/like", likesRoute);
app.use("/chat", chatRoute);
app.use("/image", imageRoute);
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: [
			process.env.FRONT_URL,
			"http://localhost:3000",
			"https://chatlist.d1q845p9ygn1yh.amplifyapp.com",
		],
		methods: ["GET", "POST", "DELETE"],
		allowedHeaders: ["my-custom-header"],
		credentials: true,
	},
});

io.on("connection", async (socket) => {
	socket.on("join_room", (roomId) => {
		socket.join(roomId);
		io.to(roomId).emit("joined_room", roomId);
	});
	socket.on("send_msg", (data) => {
		console.log("msg", data);
		io.to(data.roomId).emit("recived_msg", data.data);
	});
	socket.on("disconnect", () => {});
});
mongoose
	.connect(process.env.APP_MONGO_URL)
	.then(() => {
		console.log("DB connecting");
	})
	.catch((err) => {
		console.log(err);
	});
server.listen(process.env.PORT || port, () => {
	console.log(`listening on port ${port}`);
});
