const express = require('express');
const router = express.Router();
const productController = require('../controllers/Product');
const { verifyToken } = require('../middlewares/auth');

router.post('/create', productController.createProduct);
router.get('/get', productController.getProducts);
router.get('/get/:id', productController.getProductById);
router.put('/update/:id', productController.updateProduct);
router.delete('/del/:id', productController.deleteProduct);
router.post('/buy',productController.buyItem);
router.get('/getitemsBought', verifyToken, productController.getItemsBought);
router.post('/addItem', verifyToken, productController.addItemToBoughtList);
router.delete('/delUserItem', verifyToken,productController.deleteItem); // Endpoint to delete an item
module.exports = router;
