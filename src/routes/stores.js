const Router = require("express");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { v4: uuid } = require("uuid");
require("dotenv").config();

module.exports = (app) => {
  const Store = app.db.models.Stores;
  const User = app.db.models.Users;
  const Star = app.db.models.Stars;
  const storesRouter = Router();

  const colors = ["#f29e4c", "#efea5a", "#83e377", "#0db39e"];

  // POST - SING UP
  storesRouter.post("/signup_store", async (req, res) => {
    try {
      const { store_name, password, address, phone_number, image, store_type } =
        req.body;

      if (store_name && password && phone_number && store_type) {
        const someStore = await Store.findOne({
          where: { store_name: store_name },
        });
        if (someStore)
          return res
            .status(201)
            .json({ auth: false, status: "Your store name already exist" });

        const hashPassword = await bcryptjs.hash(password, 8);

        const store = new Store({
          id: uuid(),
          store_name: store_name,
          password: hashPassword,
          address: address,
          phone_number: parseInt(phone_number),
          image: image,
          store_type: store_type,
          rating: 0.0,
          color: colors[Math.floor(Math.random() * 4)],
        });

        const token = jwt.sign(
          { id: store.dataValues.id },
          process.env.JWT_SECRET
        );

        await store.save();

        res.status(201).json({ auth: true, token });
      } else {
        return res.status(200).json({
          auth: false,
          status: "Store name, password, phone and type are required",
        });
      }
    } catch (e) {
      res
        .status(500)
        .json({ status: "There was a problem registering your store" });
    }
  });

  // POST - LOG IN
  storesRouter.post("/login_store", async (req, res) => {
    try {
      const { store_name, password } = req.body;

      if (store_name && password) {
        const store = await Store.findOne({
          where: { store_name: store_name },
        });

        if (
          store == null ||
          !(await bcryptjs.compare(
            password.toString(),
            store.dataValues.password
          ))
        ) {
          return res
            .status(200)
            .json({ auth: false, status: "Incorrect store name or password" });
        } else {
          const token = jwt.sign(
            { id: store.dataValues.id },
            process.env.JWT_SECRET
          );
          res.status(200).json({ auth: true, token });
        }
      } else {
        res
          .status(200)
          .json({ auth: false, status: "Missing store name or username" });
      }
    } catch (e) {
      res.status(500).json({ status: "There was a problem logging" });
    }
  });

  // PUT - UDAPTE DATA
  storesRouter.put("/update_store_profile", async (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) return res.status(403).json({ status: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.storeId = decoded.id;

      const store = await Store.findOne({ where: { id: req.storeId } });
      if (!store) return res.status(404).json({ status: "Store not found" });

      const { address, phone_number, image, store_type } = req.body;

      store.address = address;
      store.phone_number = phone_number;
      store.image = image;
      store.store_type = store_type;
      store.color = colors[Math.floor(Math.random() * 4)];
      store.save();

      res.status(200).json({
        auth: true,
        store: {
          store_name: store.dataValues.store_name,
          address: store.dataValues.address,
          phone_number: store.dataValues.phone_number,
          image: store.dataValues.image,
          color: store.dataValues.color,
        },
        status: "Information updated!",
      });
    } catch (e) {
      res.status(500).json({ status: "There was a problem updating" });
    }
  });

  // GET - STORES BY TYPE
  storesRouter.get("/get_store/:type", async (req, res) => {
    try {
      let type = req.params.type;

      if (type != "Market" && type != "Restaurant" && type != "Candy Shop") {
        return res.status(403).json({ status: "Failed type of store" });
      }

      const stores = await Store.findAll({
        where: { store_type: type },
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        limit: 10,
        order: ["store_name"],
      });
      res.status(200).send(stores);
    } catch (e) {}
  });

  // GET - TOP STORES
  storesRouter.get("/top_stores", async (req, res) => {
    try {
      const top_stores = await Store.findAll({
        order: [["rating", "DESC"]],
        limit: 7,
      });
      return res.status(200).json({ status: "OK", stores: top_stores });
    } catch (e) {
      return res.status(500).json({ status: "Something went wrong" });
    }
  });

  // GET - STORE PROFILE
  storesRouter.get("/profile_store/:token", async (req, res) => {
    const token = req.params.token;
    if (!token) return res.status(403).json({ status: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.storeId = decoded.id;

      const store = await Store.findOne({ where: { id: req.storeId } });
      if (!store) return res.status(404).json({ status: "Store not found" });

      const store_name = store.dataValues.store_name;
      const address = store.dataValues.address;
      const phone_number = store.dataValues.phone_number;
      const image = store.dataValues.image;
      const color = store.dataValues.color;
      res.status(200).json({
        auth: true,
        store: { store_name, address, phone_number, image, color },
      });
    } catch (e) {
      res
        .status(500)
        .json({ status: "There was a problem getting information" });
    }
  });

  // POST - VOTE STORE
  storesRouter.post("/store_vote/:id", async (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) return res.status(403).json({ status: "No token provided" });

    const storeId = req.params.id;
    if (!storeId)
      return res.status(403).json({ status: "No store ID provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;

      const user = await User.findOne({ where: { id: req.userId } });
      if (!user) return res.status(404).json({ status: "User not found" });

      const store = await Store.findOne({ where: { id: storeId } });
      if (!store) return res.status(404).json({ status: "Store not found" });

      const { rating } = req.body;
      if (rating < 1 || rating > 5)
        return res.status(403).json({ status: "Incorrect value in rating" });

      const star = new Star({
        id: uuid(),
        vote: rating,
        UserId: req.userId,
        StoreId: store.id,
      });

      star.save();

      const totalStars = await Star.findAll({ where: { StoreId: store.id } });
      let sumStars = 0;
      totalStars.forEach((star) => {
        sumStars = sumStars + star.vote;
      });

      sumStars = sumStars / totalStars.length;

      store.rating = sumStars;
      store.save();

      res.status(200).json({ status: "Vote saved", rating: sumStars });
    } catch (e) {
      res.status(500).json({ status: "There was a problem voting" });
    }
  });

  return storesRouter;
};
