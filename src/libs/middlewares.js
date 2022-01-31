const express = require("express");
const cors = require("cors");
require("dotenv").config();

module.exports = (app) => {
  //settings
  app.set("port", process.env.PORT || 4000);
  app.set("json spaces", 2);

  //middlewares
  app.use(express.json());
  app.use(cors());

  //routes
  app.use(app.routes.index);
  app.use(app.routes.users);
  app.use(app.routes.stores);
  app.use(app.routes.products);
  app.use(app.routes.orders);
  app.use(app.routes.auth);
};
