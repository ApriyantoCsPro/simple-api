const { Op } = require('Sequelize')
const studentServices = require('../services/student')
const courseServices = require('../services/course')
const studyPlanCardServices = require('../services/studyPlanCard')
const studentCourseServices = require('../services/studentCourse')

module.exports = {
  createStudentCourse: async (req, res) => {
    try {
      const { studentId, courseId } = req.body;

      const findStudentId = await studentServices.findOne({
        [Op.and]: [{ id: studentId }, { deleted: null }]
      })
      const findCourseId = await courseServices.findOne({
        [Op.and]: [{ id: courseId }, { deleted: null }]
      })

      if (!findStudentId || findStudentId.length === 0) {
        return res.status(400).send({
          status: false,
          message: "studentId tidak ditemukan.",
        });
      }

      if (!findCourseId || findCourseId.length === 0) {
        return res.status(400).send({
          status: false,
          message: "courseId tidak ditemukan.",
        });
      }

      const StudentCourseDB = await studentCourseServices.findAll({
        [Op.and]: [{ studentId }, { courseId }]
      })

      if (StudentCourseDB.length !== 0) {
        return res.status(400).send({
          status: false,
          message: "StudentCourse already in data",
        });
      }


      await studentCourseServices.create({ studentId, courseId })

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

  getAllStudentCourse: async (req, res) => {
    try {
      let studentCoursesInDB = await studentCourseServices.findAll({ deleted: null })
      studentCoursesInDB = JSON.parse(JSON.stringify(studentCoursesInDB))

      studentCoursesInDB.map((studentCourse) => {
        delete studentCourse.deleted;
        return studentCourse;
      });

      res.send({
        status: true,
        message: "All Courses",
        data: studentCoursesInDB,
      });
    } catch (error) {
      console.log("Program error", error);
      return res.status(500).send({
        status: false,
        message: error.sqlMessage || "internal server errors!",
      });
    }
  },

  getStudentCourseDetails: async (req, res) => {
    const paramsId = req.params.id
    try {
      let findStudentCourse = await studentCourseServices.findOne({
        [Op.and]: [{ id: paramsId }, { deleted: null }]
      })

      findStudentCourse = JSON.parse(JSON.stringify(findStudentCourse))

      if (!findStudentCourse) {
        return res.status(404).send({
          status: false,
          message: "No data",
        });
      }
      delete findStudentCourse.deleted;

      //   let user = await User.findOne({where: {id: findStudentCourse.userId}})
      //   user = JSON.parse(JSON.stringify(user))

      //   findStudentCourse.user_details = {
      //     fullName: user.first_name + ' ' + user.last_name,
      //     studentCourse: user.studentCourse,
      //   }

      // findStudentCourse[0].react_details = {
      //   // react: react[0].reaction_type
      // }

      res.send({
        status: true,
        message: "Detail studentCourse data",
        data: findStudentCourse,
      });
    } catch (error) {
      console.log("Program error", error);
      return res.status(500).send({
        status: false,
        message: error.sqlMessage || "internal server errors!",
      });
    }
  },

  updateStudentCourse: async (req, res) => {
    try {
      const { studentId, courseId } = req.body;

      const StudentCourseInDB = await studentCourseServices.findOne({
        [Op.and]: [{ id: req.id }, { deleted: null }]
      })

      if (!StudentCourseInDB || StudentCourseInDB.length === 0) {
        return res.status(400).send({
          status: false,
          message: "StudentCourse not found.",
        });
      }

      const findStudentId = await studentServices.findOne({
        [Op.and]: [{ id: studentId }, { deleted: null }]
      })
      const findCourseId = await courseServices.findOne({
        [Op.and]: [{ id: courseId }, { deleted: null }]
      })

      if (!findStudentId || findStudentId.length === 0) {
        return res.status(400).send({
          status: false,
          message: "studentId tidak ditemukan.",
        });
      }

      if (!findCourseId || findCourseId.length === 0) {
        return res.status(400).send({
          status: false,
          message: "courseId tidak ditemukan.",
        });
      }

      const StudentCourseDB = await studentCourseServices.findAll({
        [Op.and]: [{ studentId }, { courseId }]
      })

      if (StudentCourseDB.length !== 0) {
        return res.status(400).send({
          status: false,
          message: "StudentCourse already in data",
        });
      }

      const oldData = JSON.parse(JSON.stringify(StudentCourseInDB))
      const payloadUpdate = { studentId, courseId }

      Object.keys(payloadUpdate).map(d => {
        payloadUpdate[d] = req.body[d] || oldData[d]
      })
      await studentCourseServices.update(payloadUpdate, { id: req.id })

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


  deleteStudentCourse: async (req, res) => {
    try {
      await studentCourseServices.update({ deleted: `${new Date}` }, { id: req.id })

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