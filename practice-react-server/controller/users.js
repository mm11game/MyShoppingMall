const { Item, Like, LineItem, Opiton, Order, User } = require("../models");
const { verifyToken, getUserId, generateToken } = require("../token/token");
const { auth } = require("../middleware/auth");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body.user;
    let me = await User.findOne({
      where: { email: email },
    });
    if (!me) {
      res.send("해당유저없음");
    }

    bcrypt.compare(password, me.password, (err, result) => {
      if (result) {
        let myToken = generateToken(email);
        res.status(200).send({ token: myToken });
      } else {
        res.send("실패");
      }
    });
  },
  signup: async (req, res) => {
    const { name, email, password, address1, address2, phone } = req.body.user;
    try {
      const result = await User.findOne({
        where: {
          email,
        },
      });
      if (result) {
        res.send("이메일이 존재");
      } else {
        bcrypt.genSalt(saltRounds, (err, salt) => {
          bcrypt.hash(password, salt, async (err, hash) => {
            let hashedPassword = hash;
            let info = await User.create({
              name,
              email,
              password: hashedPassword,
              address1,
              address2,
              phone,
            });
            let myToken = generateToken(email);
            res.send({ token: myToken });
          });
        });
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
