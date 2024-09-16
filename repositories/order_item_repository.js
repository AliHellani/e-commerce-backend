const pool = require("../config/db");

// Create Order Item
async function saveOrderItem(orderItemData) {
  const { quantity, orders_id, plant_id } = orderItemData;
  try {
    const connection = await pool.getConnection();

    const query = `
      INSERT INTO order_item (quantity, orders_id, plant_id)
      VALUES (?, ?, ?)
    `;

    const [result] = await connection.execute(query, [
      quantity,
      orders_id,
      plant_id,
    ]);

    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating order item:", error);
    throw error;
  }
}

// Find All Order Items
async function findAllOrderItems() {
  try {
    const connection = await pool.getConnection();

    const query = `SELECT * FROM order_item`;

    const [rows] = await connection.execute(query);

    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding order items:", error);
    throw error;
  }
}

// Find Order Item By ID
async function findOrderItemById(orderItemId) {
  try {
    const connection = await pool.getConnection();

    const query = `SELECT * FROM order_item WHERE id = ?`;

    const [rows] = await connection.execute(query, [orderItemId]);

    connection.release();

    if (rows.length === 0) {
      throw new Error("Order Item Not Found!");
    }

    return rows[0];
  } catch (error) {
    console.error("Error finding order item by ID:", error);
    throw error;
  }
}

// Update Order Item
async function updateOrderItem(orderItemId, orderItemData) {
  const { quantity, orders_id, plant_id } = orderItemData;

  try {
    const connection = await pool.getConnection();

    const updates = [];
    const values = [];

    if (quantity !== undefined) {
      updates.push("quantity = ?");
      values.push(quantity);
    }

    if (orders_id !== undefined) {
      updates.push("orders_id = ?");
      values.push(orders_id);
    }

    if (plant_id !== undefined) {
      updates.push("plant_id = ?");
      values.push(plant_id);
    }

    if (updates.length === 0) {
      connection.release();
      return { success: false, message: "No fields to update" };
    }

    const query = `
      UPDATE order_item
      SET ${updates.join(", ")}
      WHERE id = ?
    `;
    values.push(orderItemId);

    const [result] = await connection.execute(query, values);

    connection.release();

    if (result.affectedRows === 0) {
      return { success: false, message: "Order Item Not Found or Not Updated" };
    }

    return { success: true, message: "Order Item updated successfully" };
  } catch (error) {
    console.error("Error updating order item:", error);
    throw error;
  }
}

// Delete Order Item
async function deleteOrderItem(orderItemId) {
  try {
    const connection = await pool.getConnection();

    const query = `DELETE FROM order_item WHERE id = ?`;

    const [result] = await connection.execute(query, [orderItemId]);

    connection.release();

    if (result.affectedRows === 0) {
      throw new Error("Order Item Not Found or Already Deleted");
    }

    return result;
  } catch (error) {
    console.error("Error deleting order item:", error);
    throw error;
  }
}

module.exports = {
  saveOrderItem,
  findAllOrderItems,
  findOrderItemById,
  updateOrderItem,
  deleteOrderItem,
};
