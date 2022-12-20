const { StudentCourse } = require('../models');

module.exports = {
    findOne: async (options, withRelation = false) => {
        try {
            const params = {
                where: options,
            }
            const studentCourses = await StudentCourse.findOne(params);
            return studentCourses;
        } catch (errors) {
            return errors
        }
    },

    findAll: async (options) => {
        try {
            let studentCourse = await StudentCourse.findAll({
                where: options
            });

            return studentCourse;
        } catch (errors) {
            console.log(errors)
            return errors
        }
    },

    create: async (payload, transaction) => {
        await StudentCourse.create(payload, {
            transaction
        });
    },

    update: async (payload, options) => {
        await StudentCourse.update(payload, {
            where: options
        });
    },

    destroy: async (options, transaction) => {
        await StudentCourse.destroy({
            where: options, transaction,
        });
    },
}