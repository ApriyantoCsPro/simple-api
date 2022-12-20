const { Op } = require('Sequelize')
const studentCourseServices = require('../services/studentCourse')
const courseServices = require('../services/course')
const studyPlanCardServices = require('../services/studyPlanCard')

module.exports = {
  createCourse: async (req, res) => {
    try {
      const { courseCode, course, academicCreditSystem } = req.body;

      const courseInDB = await courseServices.findOne({ course, deleted: null })
      if (courseInDB) {
        return res.status(400).send({
          status: false,
          message: "Course already exist!",
        });
      }

      await courseServices.create({ courseCode, course, academicCreditSystem })

      res.send({
        status: true,
        message: "Data berhasil ditambahkan",
      });
    } catch (error) {
      console.log("Program error", error);
      return res.status(500).send({
        status: false,
        message: error.sqlMessage || "internal server errors!",
      });
    }
  },

  getAllCourse: async (req, res) => {
    try {
      coursesInDB = await courseServices.findAll({ deleted: null })
      coursesInDB = JSON.parse(JSON.stringify(coursesInDB))

      coursesInDB.map((course) => {
        delete course.deleted;
        return course;
      });

      res.send({
        status: true,
        message: "All Courses",
        data: coursesInDB,
      });
    } catch (error) {
      console.log("Program error", error);
      return res.status(500).send({
        status: false,
        message: error.sqlMessage || "internal server errors!",
      });
    }
  },

  getCourseDetails: async (req, res) => {
    const paramsId = req.params.id
    try {
      let findCourse = await courseServices.findOne({
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

  updateCourse: async (req, res) => {
    try {
      const { courseCode, course, academicCreditSystem } = req.body;

      const courseInDB = await courseServices.findOne({
        [Op.and]: [{ id: req.id }, { deleted: null }]
      })

      if (!courseInDB || courseInDB.length === 0) {
        return res.status(400).send({
          status: false,
          message: "Course not found.",
        });
      }

      const oldData = JSON.parse(JSON.stringify(courseInDB))
      const payloadUpdate = { courseCode, course, academicCreditSystem }

      Object.keys(payloadUpdate).map(d => {
        payloadUpdate[d] = req.body[d] || oldData[d]
      })
      await courseServices.update(payloadUpdate, { id: req.id })

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

  deleteCourse: async (req, res) => {
    try {
      await courseServices.update({ deleted: `${new Date}` }, { id: req.id })

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
  }
}