const { verify } = require("jsonwebtoken");
const {
  Item,
  Like,
  LineItem,
  Option,
  Order,
  User,
  Review,
  sequelize,
} = require("../models");
const lineitem = require("../models/lineitem");
const { verifyToken, getUserId, generateToken } = require("../token/token");
const fs = require("fs");
const review = require("../models/review");
const { Op } = require("sequelize");

module.exports = {
  homeSale: async (req, res) => {
    let result = await Item.findAll({
      include: [
        {
          model: Option,
          where: { [Op.not]: { sale: [1] } },
        },
      ],
    });

    if (!result) {
      res.send("아이템이 없습니다.");
    } else {
      res.send(result);
    }
  },
  list: async (req, res) => {
    let result = await Item.findAll({
      include: [
        {
          model: Option,
        },
      ],
    });

    if (!result) {
      res.send("아이템이 없습니다.");
    } else {
      res.send(result);
    }
  },

  //홈에서는 아무래도 여기서 가져올때 할인된거만 가져와서 뿌려줘야할거같음
  //listSale

  pushcart: async (req, res) => {
    let body = req.body.params;
    if (!req.userid) {
      res.send("로그인을 하세요");
    } else {
      if (body.option === "") {
        res.send("옵션을 추가해라");
      } else {
        const [order, created] = await Order.findOrCreate({
          where: {
            user_id: req.userid,
            state: "cart",
          },
          defaults: {
            user_id: req.userid,
            state: "cart",
          },
        });
        let optionInfo = await Option.findOne({
          where: {
            itemoption: body.option,
          },
        });

        let cartInfo = await LineItem.findOne({
          where: {
            order_id: order.id,
            option_id: optionInfo.id,
          },
        });

        if (!cartInfo) {
          let result = await LineItem.create({
            order_id: order.id,
            option_id: optionInfo.id,
            total: body.quantity * optionInfo.price,
            quantity: body.quantity,
            unitprice: optionInfo.price,
          });

          res.send(result);
        } else {
          let result = await LineItem.update(
            { quantity: body.quantity },
            {
              where: {
                order_id: order.id,
                option_id: optionInfo.id,
              },
            }
          );
          res.send("카트에 이미 있습니다.");
        }
      }
    }
  },
  cartchange: async (req, res) => {
    let body = req.body.params;
    if (!req.userid) {
      res.send("로그인을 하세요");
    } else {
      const order = await Order.findOne({
        where: {
          user_id: req.userid,
          state: "cart",
        },
      });
      let optionInfo = await Option.findOne({
        where: {
          itemoption: body.option,
        },
      });
      let result = await LineItem.update(
        { quantity: body.quantity, total: optionInfo.price * body.quantity },
        { where: { order_id: order.id, option_id: optionInfo.id } }
      );
      res.send(result);
    }
  },

  cartlist: async (req, res) => {
    try {
      if (!req.userid) {
        res.send("로그인을 하세요");
      } else {
        let result = await Order.findOne({
          where: {
            user_id: req.userid,
            state: "cart",
          },
          include: [
            {
              model: LineItem,
              include: [
                {
                  model: Option,
                  include: [
                    {
                      model: Item,
                      attributes: ["image", "name", "description"],
                    },
                  ],
                },
              ],
            },
          ],
        });
        res.send(result);
      }
    } catch (err) {
      res.send(err);
    }
  },
  cartlistdel: async (req, res) => {
    let body = req.body.params;

    try {
      if (!req.userid) {
        res.send("로그인을 하세요");
      } else {
        let order = await Order.findOne({
          where: {
            user_id: req.userid,
            state: "cart",
          },
        });

        let result = await LineItem.destroy({
          where: {
            order_id: order.id,
            option_id: body.option_id,
          },
        });
      }
      res.send("잘지워짐");
    } catch (err) {
      res.send(err);
    }
  },
  cartlistdelall: async (req, res) => {
    let body = req.body.params.lineitemid; //애는 라인아이템의 id값을 가진 배열을 가진다.
    try {
      if (!req.userid) {
        res.send("로그인을 하세요");
      } else {
        if (body.length === 0) {
          res.send("지울게 없다");
        } else {
          body.forEach((id) => {
            LineItem.destroy({
              where: { id: id },
            });
          });
          res.send("완료");
        }
      }
    } catch (err) {
      res.send(err);
    }
  },

  detail: async (req, res) => {
    let myParam = req.params.id;
    let result = await Item.findOne({
      where: { id: myParam },
      include: [
        {
          model: Option,
        },
        { model: Like },
        { model: Review },
      ],
    });
    res.send(result);
  },
  seeReviews: async (req, res) => {
    let myParam = req.params.id;
    let myLimit = req.body.params.limit;
    let myOffset = req.body.params.offset;

    console.log("확인", myOffset, myLimit);
    let result = await Review.findAll({
      limit: myLimit,
      offset: myOffset,
      where: { item_id: myParam },
    });
    res.send(result);
  },

  images: async (req, res) => {
    try {
      fs.readFile(
        `${__dirname}/../images/${req.params.name}.jpg`,
        (err, data) => {
          if (err) {
            throw err;
          } else {
            res.end(data);
          }
        }
      );
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },
  like: async (req, res) => {
    let itemId = req.body.params;
    if (!req.userid) {
      res.send("로그인을 하세요");
    } else {
      let result = await Like.findAll({
        where: { user_id: req.userid, item_id: itemId },
        attributes: ["id", "item_id", "user_id"],
      });
      if (result.length === 0) {
        const myLike = await Like.create({
          item_id: itemId,
          user_id: req.userid,
        });
        res.send(myLike);
      } else {
        await Like.destroy({
          where: { user_id: req.userid, item_id: itemId },
        });
        res.send([]);
      }
    }
  },
  payment: async (req, res) => {
    if (!req.userid) {
      res.send("로그인을 하세요");
    } else {
      let result = await Order.update(
        { state: "pay" },
        {
          where: {
            user_id: req.userid,
            state: "cart",
          },
        }
      );
      res.send(result);
    }
  },
  paystate: async (req, res) => {
    try {
      if (!req.userid) {
        res.send("로그인을 하세요");
      } else {
        let result = await Order.findAll({
          where: { user_id: req.userid, state: "pay" },
          include: [
            {
              model: LineItem,
              where: { reviewState: false },
              include: [
                {
                  model: Option,
                  include: [
                    {
                      model: Item,
                    },
                  ],
                },
              ],
            },
          ],
        });
        res.send(result);
      }
    } catch (err) {
      res.send(err);
    }
  },
  reviewed: async (req, res) => {
    let userId = req.userid;
    let title = req.body.params.title;
    let content = req.body.params.content;
    let star = req.body.params.star;
    let itemName = req.body.params.item.split(",")[0];
    let optionName = req.body.params.item.split(",")[1];

    let myOption = await Option.findOne({
      where: { itemoption: optionName },
    });
    let myItem = await Item.findOne({
      where: {
        name: itemName,
      },
    });

    const t = await sequelize.transaction();
    try {
      let myOrders = await Order.findAll({
        where: { user_id: userId, state: "pay" },
        include: [
          {
            model: User,
            where: { id: userId },
            required: true,
          },
          {
            model: LineItem,

            where: { reviewState: false },
            required: true,
            include: [
              {
                model: Option,
                required: true,
                where: { itemoption: optionName },
              },
            ],
          },
        ],
      });

      myOrders.forEach(async (myOrder) => {
        let myOrderId = myOrder.id;
        await LineItem.update(
          { reviewState: true },
          {
            where: {
              id: myOrders[0].LineItems[0].id,
              order_id: myOrderId,
              option_id: myOption.id,
            },
          }
        );
      });
      let result = await Review.create({
        title,
        content,
        user_id: userId,
        item_id: myItem.id,
        star,
      });
      res.send(result);
      await t.commit();
    } catch (err) {
      await t.rollback();
      res.send(err);
    }
  },
};
