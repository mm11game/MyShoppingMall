const { Item, Like, LineItem, Opiton, Order, User } = require("../models");
const { verifyToken, getUserId, generateToken } = require("../token/token");

module.exports = {
  auth: async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      next();
      return;
    } else {
      let realToken = req.headers.authorization.split(" ")[1];
      if (!realToken) {
        return res.status(400).send("토큰이 부적절");
      } else {
        if (realToken === "null") {
          next();
          return;
        }
        let email = verifyToken(realToken);
        let userId = await getUserId(email);

        req.userid = userId;
        next();
      }
    }
  },
};
