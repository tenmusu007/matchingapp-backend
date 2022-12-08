const mongoose = require("mongoose");
const UserInterestsSchema = new mongoose.Schema({
	hobby: {
		type: String,
	},
});
module.exports = mongoose.model("UserInterests", UserInterestsSchema);
