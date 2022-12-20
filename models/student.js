module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accessToken: {
      type: DataTypes.TEXT
    },
    deleted: {
      type: DataTypes.DATE,
      allowNull: true
    },
  });

  Student.associate = function (models) {
    Student.hasOne(models.StudyPlanCard, {
      foreignKey: 'studentId',
      as: 'studyPlanCard'
    });
  };

  Student.sync()

  return Student;
}