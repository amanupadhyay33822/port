const express = require('express');
const router = express.Router();
const productController = require('../controllers/Product');
const { verifyToken } = require('../middlewares/auth');

router.post('/create', productController.createProduct);
router.get('/get', productController.getProducts);
router.get('/get/:id', productController.getProductById);
router.put('/update/:id', productController.updateProduct);
router.delete('/del/:id', productController.deleteProduct);
router.post('/buy',verifyToken ,productController.buyItem);


module.exports = router;
