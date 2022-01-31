module.exports = (app) => {
  let server;
  app.db.sequelize.sync().then(
    (server = app.listen(app.get("port"), () => {
      console.log(`Server on port: ${app.get("port")}`);
    }))
  );

  return server;
};
