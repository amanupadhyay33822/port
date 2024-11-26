const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { addToCart, checkout, getCartItems, removeCartItem } = require('../controllers/Cart');

router.post("/add", verifyToken,addToCart);
router.post("/checkout",verifyToken,checkout)
router.get("/get",verifyToken,getCartItems)
router.delete("/del",verifyToken,removeCartItem)


module.exports = router;