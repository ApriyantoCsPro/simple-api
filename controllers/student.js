const { Op } = require('Sequelize')
const studentServices = require('../services/student')
const courseServices = require('../services/course')
const studentCourseServices = require('../services/studentCourse')
const studyPlanCardServices = require('../services/studyPlanCard')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

module.exports = {

  createStudent: async (req, res) => {
    try {
      const { firstName, lastName, email, password, confPassword } = req.body;
      const student = await studentServices.findAll({ email })

      if (password !== confPassword) return res.status(400).json({ msg: "Password and Confirm Password do not match" })
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt)

      if (!student || student.length >= 1) {
        return res.status(400).send({
          status: false,
          message: "Email already in use!",
        });
      }

      if (password.length < 5) {
        return res.status(400).send({
          status: false,
          message: "Password cannot be less than 5 characters",
        });
      }

      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return res.status(400).send({
          status: false,
          message: "Invalid email address!",
        });
      }

      await studentServices.create({ firstName, lastName, email, password: hashPassword })

      res.send({
        status: true,
        message: "Data added successfully",
      });
    } catch (error) {
      console.log("Program error", error.message);
      return res.status(500).send({
        status: false,
        message: error.sqlMessage || "There was a server error",
      });
    }
  },

  login: async (req, res) => {
    try {
      const student = await studentServices.findOne({
        email: req.body.email
      })

      const match = await bcrypt.compare(req.body.password, student.password)
      if (!match) return res.status(400).json({ msg: "Wrong Password" })

      const studentId = student.id
      const name = student.firstName + student.lastName
      const email = student.email

      const accessTokenInDB = jwt.sign({ id: studentId, name, email }, `${process.env.ACCESS_TOKEN_SECRET}`)

      await studentServices.update({ accessToken: accessTokenInDB }, {
        id: studentId
      })

      res.cookie('accessTokenInDB', accessTokenInDB, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      })
      res.json({ accessTokenInDB })
    } catch (err) {
      console.error("Program error", err)
      res.status(404).json({ msg: "Email not found" })
    }
  },

  getAllStudents: async (req, res) => {
    try {
      let studentInDB = await studentServices.findAll({ deleted: null });

      studentInDB = studentInDB.map((student) => {
        student = JSON.parse(JSON.stringify(student))
        delete student.deleted;
        delete student.studyPlanCard;
        return student;
      });

      res.send({
        status: true,
        message: "All student data",
        data: studentInDB,
      });
    } catch (error) {
      console.log("Program error", error);
      return res.status(500).send({
        status: false,
        message: error.sqlMessage || "internal server errors!",
      });
    }
  },

  getStudentDetails: async (req, res) => {
    const studentId = req.params.id;
    try {
      let findStudent = await studentServices.findOne({
        [Op.and]: [{ id: studentId }, { deleted: null }]
      })
      findStudent = JSON.parse(JSON.stringify(findStudent))

      if (!findStudent || findStudent.length === 0) {
        return res.status(404).send({
          status: false,
          message: "No data",
        });
      }
      delete findStudent.deleted;
      let studyPlanCard = await studyPlanCardServices.findOne({ id: findStudent.id })
      studyPlanCard = JSON.parse(JSON.stringify(studyPlanCard))

      if (studyPlanCard) {
        findStudent.studyPlanCardDetails = {
          fullName: studyPlanCard.fullName,
          phoneNumber: studyPlanCard.phoneNumber,
          studyProgram: studyPlanCard.studyProgram,
          studyProgram: studyPlanCard.studyProgram,
          semester: studyPlanCard.semester,
          classRoom: studyPlanCard.classRoom
        }
      }

      let studentCourse = await studentCourseServices.findAll({ studentId: findStudent.id, deleted: null });
      studentCourse = JSON.parse(JSON.stringify(studentCourse))

      if (studentCourse.length > 1) {
        let allCourses = await courseServices.findAll({ id: studentCourse.map(student => student.id), deleted: null });
        allCourses = JSON.parse(JSON.stringify(allCourses))

        findStudent.studentCourses = {
          courseDetails:
            allCourses.map(courses => [{
              course: courses.course,
            }]
            )
        }
      }


      res.send({
        status: true,
        message: "Detail student data",
        data: findStudent
      });
    } catch (error) {
      console.log("Program error", error);
      return res.status(500).send({
        status: false,
        message: error.sqlMessage || "internal server errors!",
      });
    }
  },

  updateStudent: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      const courseInDB = await studentServices.findOne({
        [Op.and]: [{ id: req.id }, { deleted: null }]
      })

      if (!courseInDB || courseInDB.length === 0) {
        return res.status(400).send({
          status: false,
          message: "Student not found.",
        });
      }

      if (email) {
        const coursesInDB = await studentServices.findAll({ email })

        if (!coursesInDB || coursesInDB.length > 1) {
          return res.status(400).send({
            status: false,
            message: "Email already in data",
          });
        }
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt)

      const oldData = JSON.parse(JSON.stringify(courseInDB))
      const payloadUpdate = { firstName, lastName, email, password: hashPassword }

      Object.keys(payloadUpdate).map(d =>
        payloadUpdate[d] = payloadUpdate[d] || oldData[d]
      )

      await studentServices.update(payloadUpdate, { id: req.id })

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

  deleteStudent: async (req, res) => {
    try {
      await studentServices.update({ deleted: `${new Date}` }, { id: req.id })

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

  logout: async (req, res) => {
    try {
      const accessTokenInDB = req.cookies.accessTokenInDB
      if (!accessTokenInDB) return res.sendStatus(204)
      const student = await studentServices.findAll({
        accessToken: accessTokenInDB
      })
      if (!student[0]) return res.sendStatus(204)
      const studentId = student[0].id
      await studentServices.update({ accessToken: null }, {
        id: studentId
      })
      res.clearCookie('accessToken')
      return res.sendStatus(200)
    } catch (error) {
      console.log("Program error", error);
      return res.status(500).send({
        status: false,
        message: error.sqlMessage || "internal server errors!",
      });
    }
  }
}
