const express = require("express");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.post("/", transactionController.changeNumber);

module.exports = router;
