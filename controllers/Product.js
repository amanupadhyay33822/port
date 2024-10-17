const Product = require('../models/Product');
const User = require('../models/User');
const nodemailer = require("nodemailer")



const transporter = nodemailer.createTransport({
  host : process.env.MAIL_HOST,
  auth:{
      pass : process.env.MAIL_PASS,
      user : process.env.MAIL_USER,
  }
});

// Function to send email
async function sendEmail(sellerEmail, itemDetails) {
  const mailOptions = {
    from: 'amanupadhyay33822@gmail.com',
    to: sellerEmail, 
    subject: `New Purchase - ${itemDetails.name}`,
    text: `An item has just been purchased:
      - Item: ${itemDetails.name}
      - Price: ${itemDetails.price.amount} ${itemDetails.price.currency}
      
      Please ship the item promptly!`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}




// Create Product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    return res.status(200).json({
      success: true,
      product,
      message: "product created successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.buyItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
  
    // const userId = req.user.id;
    
    if (!productId || !quantity ) {
      return res
        .status(400)
        .json({ message: " Product ID, and Quantity are required and email" });
    }
    // const user = await User.findById(userId);
    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }
    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Check if enough stock is available
    if (product.stock.available < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }
    // Update the product stock
    product.stock.available -= quantity;
    await product.save();
    
    const sellerEmail = product.vendor.email;
    // Optionally, you could also save the order details in the User's purchased items
    // await User.findByIdAndUpdate(userId, {
    //   $push: { itemsBought: productId },
    // });


    await sendEmail(sellerEmail, product);
    return res.status(200).json({
      message: "Order placed successfully",
      product: product.name,
      quantity,
      remainingStock: product.stock.available,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 // Import the Product model

// Add item to cart
exports.addItemToBoughtList = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    // Find the product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate price and subtotal
    const price = product.discountedPrice || product.price; // Use discounted price if available
    const subtotal = price * quantity;

    // Create the itemBought entry to be added
    const itemBought = {
      productId: product._id,
      name: product.name,
      quantity,
      price,
      subtotal,
      purchasedAt: new Date(), // Optional: store the purchase date
    };

    // Add the item to the user's itemsBought array
    await User.findByIdAndUpdate(userId, {
      $push: { itemsBought: itemBought },
    });

    return res.status(200).json({
      success: true,
      message: 'Item added to purchased list successfully!',
      itemBought,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getItemsBought = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from the auth middleware

    // Find the user by ID and retrieve only the 'itemsBought' field
    const user = await User.findById(userId).populate('itemsBought');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has purchased any items
    if (!user.itemsBought || user.itemsBought.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No items have been purchased yet.',
        itemsBought: [],
      });
    }

    // Return the list of items bought
    return res.status(200).json({
      success: true,
      itemsBought: user.itemsBought,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving purchased items.',
      error: error.message,
    });
  }
};
