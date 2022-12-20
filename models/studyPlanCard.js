module.exports = (sequelize, DataTypes) => {
    const StudyPlanCard = sequelize.define('StudyPlanCard', {
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        studyProgram: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        semester: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        classRoom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deleted: {
            type: DataTypes.DATE,
            allowNull: true
        },
    });

    StudyPlanCard.associate = function (models) {
        StudyPlanCard.belongsTo(models.Student, {
            foreignKey: 'studentId',
            as: 'studyPlanCard'
        });
    };

    StudyPlanCard.sync()

    return StudyPlanCard;
}