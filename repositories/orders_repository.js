const pool = require("../config/db");

// Create Order
async function saveOrder(orderData) {
  const { customer_id } = orderData;
  try {
    const connection = await pool.getConnection();

    const query = `
      INSERT INTO orders (customer_id)
      VALUES (?)
    `;

    const [result] = await connection.execute(query, [customer_id]);

    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

// Find All Orders
async function findAllOrders() {
  try {
    const connection = await pool.getConnection();

    const query = `SELECT * FROM orders`;

    const [rows] = await connection.execute(query);

    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding orders:", error);
    throw error;
  }
}

// Find Order By ID
async function findOrderById(orderId) {
  try {
    const connection = await pool.getConnection();

    const query = `SELECT * FROM orders WHERE id = ?`;

    const [rows] = await connection.execute(query, [orderId]);

    connection.release();

    if (rows.length === 0) {
      throw new Error("Order Not Found!");
    }

    return rows[0];
  } catch (error) {
    console.error("Error finding order by ID:", error);
    throw error;
  }
}

// Update Order
async function updateOrder(orderId, orderData) {
  const { customer_id } = orderData;

  try {
    const connection = await pool.getConnection();

    const updates = [];
    const values = [];

    if (customer_id !== undefined) {
      updates.push("customer_id = ?");
      values.push(customer_id);
    }

    if (updates.length === 0) {
      connection.release();
      return { success: false, message: "No fields to update" };
    }

    const query = `
      UPDATE orders
      SET ${updates.join(", ")}
      WHERE id = ?
    `;
    values.push(orderId);

    const [result] = await connection.execute(query, values);

    connection.release();

    if (result.affectedRows === 0) {
      return { success: false, message: "Order Not Found or Not Updated" };
    }

    return { success: true, message: "Order updated successfully" };
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}

// Delete Order
async function deleteOrder(orderId) {
  try {
    const connection = await pool.getConnection();

    const query = `DELETE FROM orders WHERE id = ?`;

    const [result] = await connection.execute(query, [orderId]);

    connection.release();

    if (result.affectedRows === 0) {
      throw new Error("Order Not Found or Already Deleted");
    }

    return result;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}

module.exports = {
  saveOrder,
  findAllOrders,
  findOrderById,
  updateOrder,
  deleteOrder,
};
