const { Item, Like, LineItem, Opiton, Order, User } = require("../models");
const { verifyToken, getUserId, generateToken } = require("../token/token");

module.exports = {
  auth: async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      return res.send("토큰이없음");
    } else {
      let realToken = req.headers.authorization.split(" ")[1];
      if (!realToken) {
        return res.send("토큰이 부적절");
      } else {
        let email = verifyToken(realToken);
        let userId = await getUserId(email);

        req.userid = userId;
        next();
      }
    }
  },
};
