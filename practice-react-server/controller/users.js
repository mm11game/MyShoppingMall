const { Item, Like, LineItem, Opiton, Order, User } = require("../models");
const { verifyToken, getUserId, generateToken } = require("../token/token");
const { auth } = require("../middleware/auth");

module.exports = {
  login: async (req, res) => {
    const email = req.body.user.email;
    const password = req.body.user.password;

    let result = await User.findOne({
      attributes: ["id", "name", "email", "phone", "address"],
      where: { email: email, password: password },
    });
    try {
      if (!result) {
        res.send("없음");
      } else {
        let myToken = generateToken(email);
        res.status(200).send({ token: myToken });
      }
    } catch (err) {
      res.send(err);
    }
  },
  signup: async (req, res) => {
    const name = req.body.user.name;
    const email = req.body.user.email;
    const password = req.body.user.password;
    const address = req.body.user.address1;
    const phone = req.body.user.phone;

    try {
      const result = await User.findOne({
        attributes: ["id", "name", "email", "phone", "address"],
        where: {
          email,
        },
      });
      if (result) {
        res.send("이메일이 존재");
      } else {
        let info = await User.create({
          name,
          email,
          password,
          address,
          phone,
        });
        let myToken = generateToken(email);
        res.send({ token: myToken });
      }
    } catch (err) {
      res.send(err);
    }
  },
  logout: (req, res) => {
    res.send("로그아웃 완료");
  },
  userinfo: async (req, res) => {
    if (!req.userid) {
      res.send("로그인을 하세요");
    } else {
      let info = await User.findOne({
        where: {
          id: req.userid,
        },
      });
      res.send(info);
    }
  },
};
