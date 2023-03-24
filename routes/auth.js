const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
/* GET home page. */
router.get("/login", function (req, res, next) {
  authController.userLogin(req, res, next);
});

router.get("/signup", function (req, res, next) {
  authController.addUser(req, res, next);
});

module.exports = router;
