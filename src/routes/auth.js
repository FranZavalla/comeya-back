const Router = require("express");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
  const User = app.db.models.Users;
  const Store = app.db.models.Stores;
  const authRouter = Router();

  // GET - AUTH USERS WITH TOKEN
  authRouter.get("/auth_user/:token", async (req, res) => {
    const token = req.params.token;
    if (!token) return res.status(403).json({ status: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;

      const user = await User.findOne({ where: { id: req.userId } });
      if (!user) {
        return res.status(404).json({ auth: false, status: "User not found" });
      }

      res.status(200).json({ auth: true });
    } catch (e) {
      res.status(500).json({
        auth: false,
        status: "There was a problem getting information",
      });
    }
  });

  // GET - AUTH STORES WITH TOKEN
  authRouter.get("/auth_store/:token", async (req, res) => {
    const token = req.params.token;
    if (!token) return res.status(403).json({ status: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.storeId = decoded.id;

      const store = await Store.findOne({ where: { id: req.storeId } });
      if (!store)
        return res.status(404).json({ auth: false, status: "Store not found" });

      res.status(200).json({ auth: true });
    } catch (e) {
      res.status(500).json({
        auth: false,
        status: "There was a problem getting information",
      });
    }
  });

  return authRouter;
};
