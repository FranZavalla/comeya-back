module.exports = (sequelize, DataType) => {
  const Orders = sequelize.define("Orders", {
    id: {
      type: DataType.STRING,
      primaryKey: true,
    },
    username: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 30],
      },
    },
    address: {
      type: DataType.STRING,
      allowNull: true,
    },
    store_name: {
      type: DataType.STRING,
      allowNull: false,
    },
    total_price: {
      type: DataType.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: true,
        min: 1,
      },
    },
    delivered: {
      type: DataType.BOOLEAN,
      allowNull: false,
    },
  });

  Orders.associate = (models) => {
    Orders.belongsTo(models.Stores);
  };

  Orders.associate = (models) => {
    Orders.belongsTo(models.Users);
  };

  Orders.associate = (models) => {
    Orders.belongsToMany(models.Products, { through: models.OrderProducts });
  };

  return Orders;
};
