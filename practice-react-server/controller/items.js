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
  Coupon,
  Destination,
} = require("../models");
const lineitem = require("../models/lineitem");
const { verifyToken, getUserId, generateToken } = require("../token/token");
const fs = require("fs");
const review = require("../models/review");
const { Op } = require("sequelize");

module.exports = {
  //get
  lists: async (req, res) => {
    let result = await Item.findAll({
      include: [
        {
          model: Option,
        },
        {
          model: Review,
        },
      ],
    });

    if (!result) {
      res.send("아이템이 없습니다.");
    } else {
      res.send(result);
    }
  },

  //get
  homeSales: async (req, res) => {
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

  //post
  pushCart: async (req, res) => {
    let body = req.body.params;
    let myItemId = req.body.itemId;
    let myQuantity = req.body.quantity;
    let myOption = req.body.option;

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
          item_id: body.itemId,
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
  },

  //patch
  cartChange: async (req, res) => {
    let body = req.body.params;
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
  },

  //get
  cartList: async (req, res) => {
    try {
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
                  },
                ],
              },
            ],
          },
        ],
      });
      res.send(result);
    } catch (err) {
      res.send(err);
    }
  },

  //delete
  cartListDel: async (req, res) => {
    let optionId = req.params.optionid;

    try {
      let order = await Order.findOne({
        where: {
          user_id: req.userid,
          state: "cart",
        },
      });

      let result = await LineItem.destroy({
        where: {
          order_id: order.id,
          option_id: optionId,
        },
      });

      res.send("잘지워짐");
    } catch (err) {
      res.send(err);
    }
  },

  //delete
  cartListDelAll: async (req, res) => {
    let makeItArray = req.params.line_item_ids.split(",");
    let line_Item_Ids = makeItArray;

    try {
      if (line_Item_Ids.length === 0) {
        res.send("지울게 없다");
      } else {
        line_Item_Ids.forEach((e) => {
          LineItem.destroy({
            where: { id: e },
          });
        });
        res.send("완료");
      }
    } catch (err) {
      res.send(err);
    }
  },

  //get /items/list/:id
  detail: async (req, res) => {
    let myParam = req.params.id;
    let userId = req.userid;
    if (!userId) {
      let result = await Item.findOne({
        where: { id: myParam },
        include: [
          {
            model: Option,
          },
          { model: Review },
        ],
      });

      res.send(result);
    } else {
      let result = await Item.findOne({
        where: { id: myParam },
        include: [
          {
            model: Option,
          },
          { model: Like, where: { user_id: userId } },
          { model: Review },
        ],
      });
      if (!result) {
        let resultOfNoLike = await Item.findOne({
          where: { id: myParam },
          include: [
            {
              model: Option,
            },
            { model: Review },
          ],
        });
        res.send(resultOfNoLike);
      } else {
        res.send(result);
      }
    }
  },

  //post /items/see_reviews/:id
  seeReviews: async (req, res) => {
    let myParam = req.params.id;
    let myLimit = req.body.params.limit;
    let myOffset = req.body.params.offset;

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
        `${__dirname}/../images/${req.params.category}/${req.params.name}.jpg`,
        (err, data) => {
          if (err) {
            throw err;
          } else {
            res.end(data);
          }
        }
      );
    } catch (err) {
      res.send(err);
    }
  },

  //post
  likes: async (req, res) => {
    let itemId = req.body.params;
    let userId = req.userid;

    let result = await Like.findAll({
      where: { user_id: userId, item_id: itemId },
    });

    if (result.length === 0) {
      const myLike = await Like.create({
        item_id: itemId,
        user_id: req.userid,
      });
      res.send([myLike]);
    } else {
      await Like.destroy({
        where: { user_id: userId, item_id: itemId },
      });
      res.send([]);
    }
  },

  //get
  userLikes: async (req, res) => {
    let userId = req.userid;
    let result = await Like.findAll({
      where: { user_id: userId },
      include: [{ model: Item }],
    });
    res.send(result);
  },

  //patch
  payment: async (req, res) => {
    let Name = req.body.params.name; // 주소지로 보낼사람 이름
    let Address1 = req.body.params.address1; //상품을 보낼 주소
    let Address2 = req.body.params.address2; //상품을 보낼 주소
    let OrderId = req.body.params.infos; //상품들
    let Phone = req.body.params.phone;
    let PriceToMileage = req.body.params.pricetomileage; //상품 전체 가격
    let UsedMileage = req.body.params.mileage;
    let MyCouponId = req.body.params.couponId;

    await Order.update(
      { state: "pay" },
      {
        where: {
          user_id: req.userid,
          state: "cart",
        },
      }
    );
    await Destination.create({
      name: Name,
      address1: Address1,
      address2: Address2,
      phone: Phone,
      order_id: OrderId,
    });

    let myUser = await User.findByPk(req.userid);
    let currrentMileage = myUser.mileage;
    let nextMileage = currrentMileage + PriceToMileage - UsedMileage;

    await User.update(
      { mileage: nextMileage },
      {
        where: {
          id: req.userid,
        },
      }
    );
    await Coupon.destroy({ where: { id: MyCouponId } });
    res.send("완료");
  },

  //get /items/payment
  payState: async (req, res) => {
    try {
      let result = await Order.findAll({
        order: [["createdAt", "DESC"]],
        where: { user_id: req.userid, [Op.not]: { state: ["cart"] } },
        include: [
          {
            model: LineItem,

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
    } catch (err) {
      res.send(err);
    }
  },

  //post
  reviewAbles: async (req, res) => {
    try {
      let orderId = req.body.params.order_id;

      console.log("===========", orderId);
      let result = await Order.findAll({
        where: { id: orderId, user_id: req.userid, state: "complete" },
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
    } catch (err) {
      res.send(err);
    }
  },

  //post
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
        where: { user_id: userId, state: "complete" },
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
      res.send(myOrders);
      await t.commit();
    } catch (err) {
      await t.rollback();
      res.send(err);
    }
  },

  //post /delivery
  deliveryFinish: async (req, res) => {
    let userId = req.userid;
    let orderId = req.body.params.myOrderId;
    let result = await Order.update(
      {
        state: "complete",
      },
      {
        where: {
          id: orderId,
          user_id: userId,
        },
      }
    );
    res.send(result);
  },

  //get
  coupons: async (req, res) => {
    let userId = req.userid;
    let result = await Coupon.findAll({
      where: { user_id: userId },
    });
    res.status(200).send(result);
  },
};
