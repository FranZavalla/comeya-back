const Router = require("express");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { v4: uuid } = require("uuid");
require("dotenv").config();

module.exports = (app) => {
  const User = app.db.models.Users;
  const usersRouter = Router();

  const colors = ["#f29e4c", "#efea5a", "#83e377", "#0db39e"];

  // GET - PROFILE;
  usersRouter.get("/profile/:token", async (req, res) => {
    const token = req.params.token;
    if (!token) return res.status(403).json({ status: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;

      const user = await User.findOne({ where: { id: req.userId } });
      if (!user) return res.status(404).json({ status: "User not found" });

      const username = user.dataValues.username;
      const name = user.dataValues.name;
      const image = user.dataValues.image;
      const color = user.dataValues.color;
      res
        .status(200)
        .json({ auth: true, user: { username, name, image, color } });
    } catch (e) {
      res
        .status(500)
        .json({ status: "There was a problem getting information", error: e });
    }
  });

  // POST - SING UP
  usersRouter.post("/signup", async (req, res) => {
    try {
      const { username, password, name } = req.body;

      if (username && password && name) {
        const someUser = await User.findOne({ where: { username: username } });
        if (someUser)
          return res
            .status(201)
            .json({ auth: false, status: "Your username already exist" });

        if (username.length < 5) {
          return res
            .status(200)
            .json({ auth: false, status: "Username must be 5 chars at least" });
        }

        const hashPassword = await bcryptjs.hash(password, 8);

        const user = new User({
          id: uuid(),
          username: username,
          password: hashPassword,
          name: name,
          image: null,
          color: colors[Math.floor(Math.random() * 4)],
        });

        await user.save();

        const token = jwt.sign(
          { id: user.dataValues.id },
          process.env.JWT_SECRET
        );

        res.status(201).json({ auth: true, token });
      } else {
        return res.status(200).json({
          auth: false,
          status: "Username, password and name are required",
        });
      }
    } catch (e) {
      res
        .status(500)
        .json({ status: "There was a problem registering your user" });
    }
  });

  // POST - LOG IN
  usersRouter.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (username && password) {
        const user = await User.findOne({ where: { username: username } });

        if (
          user == null ||
          !(await bcryptjs.compare(
            password.toString(),
            user.dataValues.password
          ))
        ) {
          return res
            .status(200)
            .json({ auth: false, status: "Incorrect username or password" });
        } else {
          const token = jwt.sign(
            { id: user.dataValues.id },
            process.env.JWT_SECRET
          );
          res.status(200).json({ auth: true, token });
        }
      } else {
        res
          .status(200)
          .json({ auth: false, status: "Missing password or username" });
      }
    } catch (e) {
      res.status(500).json({ status: "There was a problem logging" });
    }
  });

  // PUT - UPDATE DATA
  usersRouter.put("/update_profile", async (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) return res.status(403).json({ status: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;

      const user = await User.findOne({ where: { id: req.userId } });
      if (!user) return res.status(404).json({ status: "User not found" });

      const { name, image, address } = req.body;
      user.name = name;
      user.image = image;
      user.address = address;
      user.color = colors[Math.floor(Math.random() * 4)];

      user.save();

      res.status(200).json({
        auth: true,
        user: {
          name: user.dataValues.name,
          address: user.dataValues.address,
          image: user.dataValues.image,
          color: user.dataValues.color,
        },
        status: "Profile updated!",
      });
    } catch (e) {
      res.status(500).json({ status: "There was a problem updating" });
    }
  });

  return usersRouter;
};
