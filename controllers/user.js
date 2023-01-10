const { Op } = require('Sequelize')
const { User } = require('../models')

module.exports = {

  createUser: async (req, res) => {
    try {
      const fullName = req.body;
      const user = await User.findAll({where: fullName})

      if (!user || user.length >= 1) {
        return res.status(400).send({
          status: false,
          message: "Name already in use!",
        });
      }

      await User.create( fullName )

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

  getAllUsers: async (req, res) => {
    try {
      const Scope = req.headers.scope

      if (!["user"].includes(Scope)) {
        return res.status(401).send({
          responseCode: 401,
          message: "Scope UNAUTHORIZED",
        });
      }
      const userId = req.headers.user_id

      let userInDB = await User.findAll({where: {fullName: userId}})
      userInDB = JSON.parse(JSON.stringify(userInDB))


      console.log("userInDB", userInDB)

      if (!userInDB || userInDB.length === 0) {
        if (![userInDB].includes(userId)) {
          return res.status(401).send({
            responseCode: 401,
            message: "User-id UNAUTHORIZED",
          });
        }
      }
      
      let allUserInDB = await User.findAll({where: {deleted: null}});
      allUserInDB = allUserInDB.map((user) => {
        user = JSON.parse(JSON.stringify(user))
        delete user.deleted;
        delete user.studyPlanCard;
        return user;
      });
      
      res.send({
        status: true,
        message: "All user data",
        data: allUserInDB,
      });
    } catch (error) {
      console.log("Program error", error);
      return res.status(500).send({
        status: false,
        message: error.sqlMessage || "internal server errors!",
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      console.log("req.params.id", req.params.id)
      await User.update({ deleted: `${new Date}` }, { where: {id: req.params.id} })

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
