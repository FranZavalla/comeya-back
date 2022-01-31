module.exports = (sequelize, DataType) => {
  const Stars = sequelize.define("Stars", {
    id: {
      type: DataType.STRING,
      primaryKey: true,
    },
    vote: {
      type: DataType.FLOAT,
      validate: {
        min: 0,
        max: 5,
      },
    },
  });

  Stars.associate = (models) => {
    Stars.belongsTo(models.Stores);
  };

  Stars.associate = (models) => {
    Stars.belongsTo(models.Users);
  };

  return Stars;
};
