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
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const crypto = require("crypto");
const sharp = require("sharp");
const path = require("path");
const {
	S3Client,
	DeleteBucketCommand,
} = require("@aws-sdk/client-s3");
const Images = require("./models/Images");
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	cookieSession({
		name: "session",
		keys:["key1","key2"]
	})
	);
	app.use("/", authRoute);
	app.use("/", settingRoute);
	app.use("/", interestsRoute);
	app.use("/", likesRoute);
	app.use("/", chatRoute);
	app.use("/", imageRoute);
	const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST", "DELETE"],
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
mongoose
	.connect(process.env.APP_MONGO_URL)
	.then(() => {
		console.log("DB connecting");
	})
	.catch((err) => {
		console.log(err);
	});
server.listen(process.env.PORT|| port, () => {
	console.log(`listening on port ${port}`);
});
