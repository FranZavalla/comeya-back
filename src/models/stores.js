module.exports = (sequelize, DataType) => {
  const Stores = sequelize.define("Stores", {
    id: {
      type: DataType.STRING,
      primaryKey: true,
    },
    store_name: {
      type: DataType.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    password: {
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
    phone_number: {
      type: DataType.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    image: {
      type: DataType.INTEGER,
      allowNull: true,
    },
    store_type: {
      type: DataType.ENUM("Restaurant", "Market", "Candy shop"),
      allowNull: false,
    },
    rating: {
      type: DataType.DECIMAL,
      allowNull: false,
      validate: {
        min: 0.0,
        max: 5.0,
      },
    },
    color: {
      type: DataType.ENUM("#f29e4c", "#efea5a", "#83e377", "#0db39e"),
    },
  });

  Stores.associate = (models) => {
    Stores.hasMany(models.Products);
  };

  Stores.associate = (models) => {
    Stores.hasMany(models.Orders);
  };

  Stores.associate = (models) => {
    Stores.hasMany(models.Stars);
  };

  return Stores;
};
