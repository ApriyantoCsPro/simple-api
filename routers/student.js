const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/VerifyToken")


const { getAllStudents, getStudentDetails, updateStudent, deleteStudent, logout } = require('../controllers/student');

router.get('/', verifyToken, getAllStudents)
router.get('/:id', getStudentDetails)
router.put('/', verifyToken, updateStudent)
router.delete('/', verifyToken, deleteStudent)
router.post("/logout", verifyToken, logout);

module.exports = router;