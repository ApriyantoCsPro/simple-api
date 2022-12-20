"use strict";
const express = require("express")
const { verifyToken } = require("../middleware/VerifyToken")


const router = express.Router()
const { createStudyPlanCard, getAllStudyPlanCard, getStudyPlanCardDetails, updateStudyPlanCard, deleteStudyPlanCard } = require("../controllers/studyPlanCard");

router.post("/create", verifyToken, createStudyPlanCard);
router.get("/", verifyToken, getAllStudyPlanCard);
router.get("/:id", getStudyPlanCardDetails);
router.put("/:id", verifyToken, updateStudyPlanCard);
router.delete("/", verifyToken, deleteStudyPlanCard);



module.exports = router