module.exports = (sequelize, DataType) => {
  const OrderProducts = sequelize.define("OrderProducts", {
    id: {
      type: DataType.STRING,
      primaryKey: true,
    },
    product_name: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataType.STRING,
      allowNull: true,
      validate: {
        len: [0, 31],
      },
    },
    price: {
      type: DataType.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: true,
        min: 1,
      },
    },
    quantity: {
      type: DataType.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        min: 1,
      },
    },
  });

  return OrderProducts;
};
