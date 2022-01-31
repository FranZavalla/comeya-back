const Router = require("express");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
require("dotenv").config();

module.exports = (app) => {
  const User = app.db.models.Users;
  const Store = app.db.models.Stores;
  const Order = app.db.models.Orders;
  const Product = app.db.models.Products;
  const OrderProduct = app.db.models.OrderProducts;
  const orderRouter = Router();

  // POST - NEW ORDER
  orderRouter.post("/new_order", async (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) return res.status(403).json({ status: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;

      const user = await User.findOne({ where: { id: req.userId } });
      if (!user) return res.status(404).json({ status: "User not found" });

      const { storeId, total_price, products } = req.body;

      if (storeId && total_price && products && products.length > 0) {
        if (total_price < 0) {
          res.status(500).json({
            status: "Price cannot be zero or negative",
          });
        }

        const store = await Store.findOne({ where: { id: storeId } });
        if (!store) return res.status(404).json({ status: "Store not found" });

        const order = new Order({
          id: uuid(),
          store_name: store.store_name,
          username: user.username,
          address: user.address,
          total_price: total_price,
          delivered: false,
          StoreId: store.id,
          UserId: user.id,
        });

        products.forEach(async (prod) => {
          if (prod.id && prod.product_name && prod.price) {
            const product = await Product.findOne({ where: { id: prod.id } });
            if (!product)
              return res.status(404).json({ status: "Product not found" });

            const orderProduct = new OrderProduct({
              id: uuid(),
              product_name: prod.product_name,
              description: prod.description,
              price: prod.price * prod.quantity,
              quantity: prod.quantity,
              OrderId: order.id,
              ProductId: product.id,
            });

            orderProduct.save();
          } else {
            res.status(500).json({
              status: "There was a problem with one of your products",
            });
          }
        });

        await order.save();
        res.status(201).json({ completed: true, status: "Order completed" });
      } else {
        res.status(500).json({
          status: "Store ID, price and products are required",
        });
      }
    } catch (e) {
      res.status(500).json({ status: "There was a problem in your order" });
    }
  });

  // GET - ALL ORDERS FOR A STORE
  orderRouter.get("/get_orders/:store_name", async (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) return res.status(403).json({ status: "No token provided" });

    const store_name = req.params.store_name;
    if (!store_name)
      return res.status(403).json({ status: "No store name provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.storeId = decoded.id;

      const store = await Store.findOne({ where: { id: req.storeId } });
      if (!store) return res.status(404).json({ status: "Store not found" });

      let orders = await Order.findAll({
        where: { store_name: store_name, delivered: 0 },
      });

      for (let i = 0; i < orders.length; i++) {
        const products = await OrderProduct.findAll({
          where: { OrderId: orders[i].dataValues.id },
        });
        orders[i].dataValues.products = products;
      }

      return res.status(200).json({ orders: orders });
    } catch (e) {
      res.status(500).json({ status: "There was a problem getting orders" });
    }
  });

  // POST - CANCEL AN ORDER
  orderRouter.post("/cancel_order", async (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) return res.status(403).json({ status: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.storeId = decoded.id;

      const store = await Store.findOne({ where: { id: req.storeId } });
      if (!store) return res.status(404).json({ status: "Store not found" });

      const { orderId } = req.body;

      const order = await Order.findOne({ where: { id: orderId } });
      if (!order) return res.status(404).json({ status: "Order not found" });

      order.destroy();

      res.status(200).json({ status: "Order removed successfully" });
    } catch (e) {
      res
        .status(500)
        .json({ status: "There was a problem removing the order" });
    }
  });

  // POST - ACCEPT AN ORDER
  orderRouter.post("/accept_order", async (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) return res.status(403).json({ status: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.storeId = decoded.id;

      const store = await Store.findOne({ where: { id: req.storeId } });
      if (!store) return res.status(404).json({ status: "Store not found" });

      const { orderId } = req.body;

      const order = await Order.findOne({ where: { id: orderId } });
      if (!order) return res.status(404).json({ status: "Order not found" });

      order.delivered = true;

      order.save();

      res.status(200).json({ status: "Order delivered!" });
    } catch (e) {
      res
        .status(500)
        .json({ status: "There was a problem accepting the order" });
    }
  });

  return orderRouter;
};
