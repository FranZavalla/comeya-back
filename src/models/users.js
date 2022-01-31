module.exports = (sequelize, DataType) => {
  const Users = sequelize.define("Users", {
    id: {
      type: DataType.STRING,
      primaryKey: true,
    },
    username: {
      type: DataType.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [5, 30],
      },
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    address: {
      type: DataType.STRING,
      allowNull: true,
    },
    image: {
      type: DataType.STRING,
      allowNull: true,
    },
    color: {
      type: DataType.ENUM("#f29e4c", "#efea5a", "#83e377", "#0db39e"),
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.Orders);
  };

  Users.associate = (models) => {
    Users.hasMany(models.Stars);
  };

  return Users;
};
