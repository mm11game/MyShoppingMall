const express = require("express");
const router = express.Router();

const usersController = require("../controller/users");
const { auth } = require("../middleware/auth");

router.post("/login", usersController.login);
router.delete("/logout", usersController.logout);
router.post("/signup", usersController.signup);
router.get("/userinfo", auth, usersController.userinfo);

module.exports = router;
