const { Op } = require('Sequelize')
const studentServices = require('../services/student')
const courseServices = require('../services/course')
const studyPlanCardServices = require('../services/studyPlanCard')

module.exports = {
  createStudyPlanCard: async (req, res) => {
    try {
      const { fullName, phoneNumber, studyProgram, semester, classRoom } = req.body;

      const studyPlanCardInDBS = await studyPlanCardServices.findOne({ fullName, deleted: null })
      if (studyPlanCardInDBS) {
        return res.status(400).send({
          status: false,
          message: "Name already in use!",
        });
      }

      await studyPlanCardServices.create({ studentId: req.id, fullName, phoneNumber, studyProgram, semester, classRoom })

      res.send({
        status: true,
        message: "Data added successfully",
      });
    } catch (error) {
      console.log("Program error", error);
      return res.status(500).send({
        status: false,
        message: error.sqlMessage || "internal server errors!",
      });
    }
  },

  getAllStudyPlanCard: async (req, res) => {
    try {
      let studyPlanCardInDB = await studyPlanCardServices.findAll({ deleted: null })
      studyPlanCardInDB = JSON.parse(JSON.stringify(studyPlanCardInDB))

      studyPlanCardInDB.map((studyPlanCard) => {
        delete studyPlanCard.deleted;
        return studyPlanCard;
      });

      res.send({
        status: true,
        message: "All StudyPlanCard",
        data: studyPlanCardInDB,
      });
    } catch (error) {
      console.log("Program error", error);
      return res.status(500).send({
        status: false,
        message: error.sqlMessage || "internal server errors!",
      });
    }
  },

  getStudyPlanCardDetails: async (req, res) => {
    const paramsId = req.params.id
    try {
      let findCourse = await studyPlanCardServices.findOne({
        [Op.and]: [{ id: paramsId }, { deleted: null }]
      })

      findCourse = JSON.parse(JSON.stringify(findCourse))

      if (!findCourse) {
        return res.status(404).send({
          status: false,
          message: "No data",
        });
      }
      delete findCourse.deleted;

      res.send({
        status: true,
        message: "Detail course data",
        data: findCourse,
      });
    } catch (error) {
      console.log("Program error", error);
      return res.status(500).send({
        status: false,
        message: error.sqlMessage || "internal server errors!",
      });
    }
  },

  updateStudyPlanCard: async (req, res) => {
    try {
      const { fullName, phoneNumber, studyProgram, semester, classRoom } = req.body;

      const studyPlanCardInDB = await studyPlanCardServices.findOne({
        id: req.params.id,
        studentId: req.id,
        deleted: null
      })

      if (!studyPlanCardInDB || studyPlanCardInDB.length === 0) {
        return res.status(400).send({
          status: false,
          message: "StudyPlanCard not found.",
        });
      }

      const oldData = JSON.parse(JSON.stringify(studyPlanCardInDB))
      const payloadUpdate = { fullName, phoneNumber, studyProgram, semester, classRoom }

      Object.keys(payloadUpdate).map(d => {
        payloadUpdate[d] = req.body[d] || oldData[d]
      })
      await studyPlanCardServices.update(payloadUpdate, { id: req.params.id })

      res.send({
        status: true,
        message: "Update success",
      });
    } catch (error) {
      console.log("Program error", error);
      return res.status(500).send({
        status: false,
        message: error.sqlMessage || "internal server errors!",
      });
    }
  },

  deleteStudyPlanCard: async (req, res) => {
    try {
      await studyPlanCardServices.update({ deleted: `${new Date}` }, { id: req.id })

      res.send({
        status: true,
        message: "Data deleted successfully!",
      });
    } catch (error) {
      console.log("Program error", error);
      return res.status(500).send({
        status: false,
        message: error.sqlMessage || "internal server errors!",
      });
    }
  },
}