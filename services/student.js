const { Op } = require("sequelize");
const { Student, Course, StudyPlanCard } = require('../models');


module.exports = {
    findOne: async (options, withRelation = false) => {
        try {
            const params = {
                where: options,
            }
            const student = await Student.findOne(params);
            return student;
        } catch (errors) {
            return errors
        }
    },

    findAll: async (options) => {
        try {
            let student = await Student.findAll({
                where: options,
                include: [
                    {
                        model: StudyPlanCard,
                        as: "studyPlanCard",
                        attributes: ["fullName", "phoneNumber", "studyProgram", "semester", "classRoom",],
                    }], distinct: true,
            });

            return student;
        } catch (errors) {
            console.log(errors)
            return errors
        }
    },

    create: async (payload, transaction) => {
        await Student.create(payload, {
            transaction
        });
    },

    update: async (payload, options) => {
        await Student.update(payload, {
            where: options
        });
    },

    destroy: async (options) => {
        await Student.destroy({
            where: options
        });
    },
}