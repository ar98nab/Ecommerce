import Order from '../models/Order.js';
import Product from '../models/Product.js';

const addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({ message: `Product not found: ${item.name}` });
    }
    if (product.countInStock < item.qty) {
      return res
        .status(400)
        .json({ message: `Not enough stock for ${product.name}` });
    }
  }

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    product.countInStock -= item.qty;
    await product.save();
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'Cash on Delivery',
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to cancel this order' });
  }

  if (order.isCancelled) {
    return res.status(400).json({ message: 'Order is already cancelled' });
  }

  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock += item.qty;
      await product.save();
    }
  }

  order.isCancelled = true;
  order.cancelledAt = new Date();

  const updated = await order.save();
  res.json(updated);
};

export { addOrderItems, getMyOrders, cancelOrder };