module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        courseCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        course: {
            type: DataTypes.STRING,
            allowNull: false
        },
        academicCreditSystem: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        deleted: {
            type: DataTypes.DATE,
            allowNull: true
        },
    });

    Course.associate = function (models) {
        Course.hasMany(models.StudentCourse, {
            foreignKey: 'courseId',
            as: 'courseId'
        });
    };

    Course.sync()

    return Course;
}