const Router = require("express");

module.exports = (app) => {
  const indexRouter = Router();

  indexRouter.get("/", (req, res) => {
    res
      .header("Access-Control-Allow-Origin", "*")
      .send({ status: `Welcome to ComeYa API` });
  });

  return indexRouter;
};
