const express = require("express");
const randomController = require("../controllers/randomController");
const router = express.Router();

router.post("/", randomController.random);

module.exports = router;
