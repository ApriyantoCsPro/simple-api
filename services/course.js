const { Course } = require('../models');

module.exports = {
    findOne: async (options, withRelation = false) => {
        try {
            const params = {
                where: options,
            }
            const course = await Course.findOne(params);
            return course;
        } catch (errors) {
            return errors
        }
    },

    findAll: async (options) => {
        try {
            let course = await Course.findAll({
                where: options
            });

            return course;
        } catch (errors) {
            console.log(errors)
            return errors
        }
    },

    create: async (payload, transaction) => {
        await Course.create(payload, {
            transaction
        });
    },

    update: async (payload, options) => {
        await Course.update(payload, {
            where: options
        });
    },

    destroy: async (options, transaction) => {
        await Course.destroy({
            where: options, transaction,
        });
    },
}