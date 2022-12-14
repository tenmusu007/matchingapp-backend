const router = require("express").Router();
const { formData } = require("../controllers/formdata");
router.post("/formdata", formData);
module.exports = router;
