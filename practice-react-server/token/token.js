const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = {
  generateToken: (data) => {
    return jwt.sign(data, process.env.SECRET);
  },
  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.SECRET);
    } catch (err) {
      console.log(err);
    }
  },
  getUserId: async (email) => {
    let user = await User.findOne({
      where: {
        email: email,
      },
    });

    return user.id;
  },
};
