"use strict";
const express = require("express")
const { verifyToken } = require("../middleware/VerifyToken")


const router = express.Router()
const { createCourse, getAllCourse, getCourseDetails, updateCourse, deleteCourse } = require("../controllers/course");

router.post("/create", createCourse);
router.get("/", verifyToken, getAllCourse);
router.get("/:id", getCourseDetails);
router.put("/", verifyToken, updateCourse);
router.delete("/", verifyToken, deleteCourse);



module.exports = router