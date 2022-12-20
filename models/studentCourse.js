module.exports = (sequelize, DataTypes) => {
    const StudentCourse = sequelize.define('StudentCourse', {
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        deleted: {
            type: DataTypes.DATE,
            allowNull: true
        },
    });

    StudentCourse.sync()

    return StudentCourse;
}