const Router = require("express");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
require("dotenv").config();

module.exports = (app) => {
  const Product = app.db.models.Products;
  const Store = app.db.models.Stores;
  const productsRouter = Router();

  // POST - NEW PRODUCT
  productsRouter.post("/new_product", async (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) return res.status(403).json({ status: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.storeId = decoded.id;

      const store = await Store.findOne({ where: { id: req.storeId } });
      if (!store) return res.status(404).json({ status: "Store not found" });

      const { product_name, description, price, image } = req.body;

      if (product_name && price) {
        if (price <= 0) {
          res
            .status(200)
            .json({ added: false, status: "Price must be higher than 0" });
        }
        if (description && description.length > 31) {
          res.status(200).json({
            added: false,
            status: "The description must be less than 32 characters",
          });
          return;
        }

        const product = new Product({
          id: uuid(),
          product_name: product_name,
          description: description ? description : null,
          price: price,
          image: image,
          StoreId: req.storeId,
        });

        await product.save();

        res.status(201).json({ added: true, status: "Product added" });
      } else {
        res.status(200).json({
          added: false,
          status: "Product name and price are required",
        });
      }
    } catch (e) {
      res
        .status(500)
        .json({ status: "There was a problem adding a new product" });
    }
  });

  // PUT - DELETE PRODUCT
  // NOTE: DELETE DON'T READ HEADERS, THEN USE PUT
  productsRouter.put("/del_product", async (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) return res.status(403).json({ status: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.storeId = decoded.id;

      const store = await Store.findOne({ where: { id: req.storeId } });
      if (!store) return res.status(404).json({ status: "Store not found" });

      const { id } = req.body;

      const product = await Product.findOne({
        where: { id: id, StoreId: req.storeId },
      });

      if (!product)
        return res.status(404).json({ status: "Product not found" });

      product.destroy();

      res.status(200).json({
        status: "Product deleted!",
      });
    } catch (e) {
      return res
        .status(500)
        .json({ status: "There was a problem deleting", error: e });
    }
  });

  // PUT - EDIT PRODUCT
  productsRouter.put("/edit_product", async (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) return res.status(403).json({ status: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.storeId = decoded.id;

      const store = await Store.findOne({ where: { id: req.storeId } });
      if (!store) return res.status(404).json({ status: "Store not found" });

      const { id, product_name, description, price, image } = req.body;

      if (price <= 0) {
        res
          .status(200)
          .json({ edited: false, status: "Price must be higher than 0" });
      }
      if (description && description.length > 31) {
        res.status(200).json({
          edited: false,
          status: "The description must be less than 32 characters",
        });
        return;
      }

      const product = await Product.findOne({
        where: { id: id, StoreId: req.storeId },
      });
      if (!product)
        return res.status(404).json({ status: "Product not found" });

      product.product_name = product_name;
      product.description = description ? description : null;
      product.price = price;
      product.image = image;
      product.save();

      res.status(200).json({
        edited: true,
        status: "Product edited!",
      });
    } catch (e) {
      return res.status(500).json({ status: "There was a problem updating" });
    }
  });

  // GET - GET ALL PRODUCTS FOR A STORE
  productsRouter.get("/get_products/:store_name", async (req, res) => {
    try {
      const store_name = req.params.store_name;

      const store = await Store.findOne({ where: { store_name: store_name } });
      if (!store) return res.status(404).json({ status: "Store not found" });

      const allProducts = await Product.findAll({
        where: { StoreId: store.dataValues.id },
      });

      return res.status(200).send(allProducts);
    } catch (e) {
      return res
        .status(500)
        .json({ status: "There was a problem getting information" });
    }
  });

  return productsRouter;
};
