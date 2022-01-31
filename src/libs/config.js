if (process.env.NODE_ENV == "test") {
  module.exports = {
    database: "comeya_test",
    username: "",
    password: "",
    params: {
      dialect: "sqlite",
      storage: "comeya_test.sqlite",
      operatorAliases: false,
    },
  };
} else {
  module.exports = {
    database: "comeya",
    username: "",
    password: "",
    params: {
      dialect: "sqlite",
      storage: "comeya.sqlite",
      operatorAliases: false,
    },
  };
}
