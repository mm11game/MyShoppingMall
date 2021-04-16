const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const itemsController = require("../controller/items");

router.get("/list", itemsController.list);
router.get("/detail/:id", itemsController.detail);
router.get("/images/:name", itemsController.images);
router.get("/homeSale", itemsController.homeSale);

router.post("/pushcart", auth, itemsController.pushcart);
router.post("/cartchange", auth, itemsController.cartchange);
router.post("/cartlist", auth, itemsController.cartlist);
router.post("/cartlistdel", auth, itemsController.cartlistdel);
router.post("/cartlistdelall", auth, itemsController.cartlistdelall);

router.post("/like", auth, itemsController.like);

router.post("/payment", auth, itemsController.payment);
router.get("/paystate", auth, itemsController.paystate);
router.post("/reviewed", auth, itemsController.reviewed);
router.post("/seeReviews/:id", itemsController.seeReviews);

module.exports = router;
