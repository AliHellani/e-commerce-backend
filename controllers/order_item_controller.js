const orderItemRepository = require("../repositories/order_item_repository");
const validator = require("validator");

// Create Order Item
async function createOrderItem(req, res) {
  const { quantity, orders_id, plant_id } = req.body;

  if (!quantity || !orders_id || !plant_id) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  if (
    !validator.isInt(String(quantity)) ||
    !validator.isInt(String(orders_id)) ||
    !validator.isInt(String(plant_id))
  ) {
    return res.status(400).json({ error: "Invalid data types!" });
  }

  try {
    const result = await orderItemRepository.saveOrderItem({
      quantity,
      orders_id,
      plant_id,
    });

    return res.status(201).json({
      message: "Order item created successfully",
      orderItemId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create order item",
      details: error.message,
    });
  }
}

// Get All Order Items
async function getAllOrderItems(req, res) {
  try {
    const orderItems = await orderItemRepository.findAllOrderItems();

    return res.status(200).json(orderItems);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve order items",
      details: error.message,
    });
  }
}

// Get Order Item By ID
async function getOrderItemById(req, res) {
  const { id } = req.params;
  try {
    const orderItem = await orderItemRepository.findOrderItemById(id);

    return res.status(200).json(orderItem);
  } catch (error) {
    return res.status(404).json({
      error: "Order item not found",
      details: error.message,
    });
  }
}

// Update Order Item
async function updateOrderItem(req, res) {
  const { id } = req.params;
  const { quantity, orders_id, plant_id } = req.body;

  if (quantity !== undefined && !validator.isInt(String(quantity))) {
    return res.status(400).json({ error: "Invalid Quantity!" });
  }

  if (orders_id !== undefined && !validator.isInt(String(orders_id))) {
    return res.status(400).json({ error: "Invalid Orders ID!" });
  }

  if (plant_id !== undefined && !validator.isInt(String(plant_id))) {
    return res.status(400).json({ error: "Invalid Plant ID!" });
  }

  try {
    const result = await orderItemRepository.updateOrderItem(id, {
      quantity,
      orders_id,
      plant_id,
    });

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
      error: "Failed to update order item",
      details: error.message,
    });
  }
}

// Delete Order Item
async function deleteOrderItem(req, res) {
  const { id } = req.params;
  try {
    await orderItemRepository.deleteOrderItem(id);

    return res.status(200).json({ message: "Order item deleted successfully" });
  } catch (error) {
    return res.status(404).json({
      error: "Failed to delete order item",
      details: error.message,
    });
  }
}

module.exports = {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem,
};
