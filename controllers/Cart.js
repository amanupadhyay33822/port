const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming userId is extracted from auth middleware
    const { productId } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    // Fetch product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Get the user's cart or create a new one
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If no cart exists, create a new one
      cart = new Cart({
        userId,
        items: [],
        totalPrice: { amount: 0 },
      });
    }

    // Check if the product already exists in the cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Product is already in the cart.",
      });
    }

    // Add the product to the cart
    cart.items.push({
      productId: product._id,
      price: {
        amount: product.price.amount,
      },
    });

    // Recalculate total price
    cart.totalPrice.amount = cart.items.reduce(
      (total, item) => total + item.price.amount,
      0
    );

    // Save the cart
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully.",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.checkout = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from authentication middleware
    const { items } = req.body;

    // Validate required inputs
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: " items are required.",
      });
    }

    const purchasedItems = [];

    // Iterate over each item in the request
    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message:
            "Each item must have a valid productId and quantity greater than 0.",
        });
      }

      // Find the product in the database
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${productId} not found.`,
        });
      }

      // Validate stock availability
      if (quantity > product.stock.available) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}. Available: ${product.stock.available}.`,
        });
      }

      // Calculate total price for the current item
      const totalPrice = product.price.amount * quantity;

      // Reduce stock availability
      product.stock.available -= quantity;
      await product.save();

      // Prepare item for purchase history
      purchasedItems.push({
        productId: product._id,
        quantity,
        totalPrice,
      });
    }

    // Update user's purchase history
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.itemsBought.push(...purchasedItems);
    await user.save();

    // Clear the user's cart (if applicable)
    await Cart.findOneAndDelete({ userId });

    return res.status(200).json({
      success: true,
      message:
        "Checkout successful. Items have been added to your purchase history.",
      purchasedItems,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is extracted from auth middleware

    // Find the cart for the user and populate product details
    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name price"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart items retrieved successfully.",
      cartItems: cart.items.map((item) => ({
        productId: item.productId._id,
        productName: item.productId.name,
        price: item.productId.price.amount,
       
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is extracted from auth middleware
    const { productId } = req.body; // Product ID to be removed

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Your cart is empty or does not exist.",
      });
    }

    // Remove the item with the given productId
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in the cart.",
      });
    }

    cart.items.splice(itemIndex, 1); // Remove the item from the cart
    await cart.save(); // Save the updated cart

    return res.status(200).json({
      success: true,
      message: "Item removed from the cart successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};