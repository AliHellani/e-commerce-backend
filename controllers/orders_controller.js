const orderRepository = require("../repositories/orders_repository");
const validator = require("validator");

// Create Order
async function createOrder(req, res) {
  const { customer_id } = req.body;

  if (!customer_id) {
    return res.status(400).json({ error: "Customer ID is required!" });
  }

  if (!validator.isInt(String(customer_id))) {
    return res.status(400).json({ error: "Invalid Customer ID!" });
  }

  try {
    const result = await orderRepository.saveOrder({ customer_id });

    return res.status(201).json({
      message: "Order created successfully",
      orderId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create order",
      details: error.message,
    });
  }
}

// Get All Orders
async function getAllOrders(req, res) {
  try {
    const orders = await orderRepository.findAllOrders();

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve orders",
      details: error.message,
    });
  }
}

// Get Order By ID
async function getOrderById(req, res) {
  const { id } = req.params;
  try {
    const order = await orderRepository.findOrderById(id);

    return res.status(200).json(order);
  } catch (error) {
    return res.status(404).json({
      error: "Order not found",
      details: error.message,
    });
  }
}

// Update Order
async function updateOrder(req, res) {
  const { id } = req.params;
  const { customer_id } = req.body;

  if (customer_id !== undefined && !validator.isInt(String(customer_id))) {
    return res.status(400).json({ error: "Invalid Customer ID!" });
  }

  try {
    const result = await orderRepository.updateOrder(id, { customer_id });

    if (result.success) {
      return res.status(200).json({
        message: result.message,
      });
    } else {
      return res.status(400).json({
        error: result.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update order",
      details: error.message,
    });
  }
}

// Delete Order
async function deleteOrder(req, res) {
  const { id } = req.params;
  try {
    await orderRepository.deleteOrder(id);

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    return res.status(404).json({
      error: "Failed to delete order",
      details: error.message,
    });
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
