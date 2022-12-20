const { StudyPlanCard } = require('../models');

module.exports = {
    findOne: async (options, withRelation = false) => {
        try {
            const params = {
                where: options,
            }
            const studyPlanCard = await StudyPlanCard.findOne(params);
            return studyPlanCard;
        } catch (errors) {
            return errors
        }
    },

    findAll: async (options) => {
        try {
            let studyPlanCard = await StudyPlanCard.findAll({
                where: options
            });

            return studyPlanCard;
        } catch (errors) {
            console.log(errors)
            return errors
        }
    },

    create: async (payload, transaction) => {
        await StudyPlanCard.create(payload, {
            transaction
        });
    },

    update: async (payload, options) => {
        await StudyPlanCard.update(payload, {
            where: options
        });
    },

    destroy: async (options, transaction) => {
        await StudyPlanCard.destroy({
            where: options, transaction,
        });
    },
}