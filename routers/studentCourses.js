"use strict";
const express = require("express")
const { verifyToken } = require("../middleware/VerifyToken")


const router = express.Router()
const { createStudentCourse, getAllStudentCourse, getStudentCourseDetails, updateStudentCourse, deleteStudentCourse } = require("../controllers/studentCourses");

router.post("/create", verifyToken, createStudentCourse);
router.get("/", verifyToken, getAllStudentCourse);
router.get("/:id", getStudentCourseDetails);
router.put("/", verifyToken, updateStudentCourse);
router.delete("/", verifyToken, deleteStudentCourse);



module.exports = router