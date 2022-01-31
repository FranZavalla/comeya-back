module.exports = (sequelize, DataType) => {
  const Products = sequelize.define("Products", {
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
    image: {
      type: DataType.STRING,
      allowNull: true,
    },
  });

  Products.associate = (models) => {
    Products.belongsToMany(models.Orders, { through: models.OrderProducts });
  };

  Products.associate = (models) => {
    Products.belongsTo(models.Stores);
  };

  return Products;
};
