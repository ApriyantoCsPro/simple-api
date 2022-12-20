"use strict";
const express = require("express")

const router = express.Router()
const { createStudent, login } = require("../controllers/student");

router.post("/register", createStudent);
router.post("/login", login);

module.exports = router