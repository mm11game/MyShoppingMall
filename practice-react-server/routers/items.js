const express = require("express");
const router = express.Router();
const itemsController = require("../controller/items");
const { auth } = require("../middleware/auth");

router.get("/lists", itemsController.lists);
router.get("/lists/:id", auth, itemsController.detail);
router.get("/homesales", itemsController.homeSales); //

router.get("/images/:category/:name", itemsController.images);

router.get("/cart", auth, itemsController.cartList);
router.post("/cart", auth, itemsController.pushCart);
router.patch("/cart", auth, itemsController.cartChange);
router.delete("/cart/:optionid", auth, itemsController.cartListDel);
router.delete("/carts/:line_item_ids", auth, itemsController.cartListDelAll);

router.post("/likes", auth, itemsController.likes);
router.get("/likes", auth, itemsController.userLikes);

router.get("/payment", auth, itemsController.payState);
router.patch("/payment", auth, itemsController.payment);

router.post("/reviewables", auth, itemsController.reviewAbles);
router.post("/reviewed", auth, itemsController.reviewed);
router.post("/see_reviews/:id", itemsController.seeReviews);

router.patch("/delivery", auth, itemsController.deliveryFinish);

module.exports = router;
