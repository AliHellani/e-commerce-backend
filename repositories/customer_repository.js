const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");

//Create Customer
async function saveCustomer(customerData) {
  const { name, phone_number, email, password, type } = customerData;
  try {
    const connection = await pool.getConnection();

    //Hashed Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = ` 
    INSERT INTO customer(name, phone_number, email, password, type)
    VALUES(?,?,?,?,?)
    `;

    const [result] = await connection.execute(query, [
      name,
      phone_number,
      email,
      hashedPassword,
      type,
    ]);

    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

//Find All Customer
async function findAllCustomer() {
  try {
    const connection = await pool.getConnection();

    const query = ` SELECT * FROM customer`;

    const [rows] = await connection.execute(query);

    connection.release();
    return rows;
  } catch (error) {
    console.error("Error Finding Users:", error);
    throw error;
  }
}

//Find Customer By ID
async function findCustomerById(customerId) {
  try {
    const connection = await pool.getConnection();
    const query = ` SELECT * FROM customer WHERE id = ?`;

    const [rows] = await connection.execute(query, [customerId]);

    connection.release();

    if (rows.length === 0) {
      throw new Error("Customer Not Found!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
}

//Update Customer
async function updateCustomer(customerId, customerData) {
  const { name, phone_number, email, password, type } = customerData;

  try {
    const connection = await pool.getConnection();

    const updates = [];
    const values = [];

    if (email) {
      const checkQuery = `
        SELECT * FROM customer WHERE email = ? AND id != ?
      `;
      const [existingCustomer] = await connection.execute(checkQuery, [
        email,
        customerId,
      ]);

      if (existingCustomer.length > 0) {
        connection.release();
        return { success: false, message: "Email already exists" };
      }
    }

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }

    if (phone_number !== undefined) {
      updates.push("phone_number = ?");
      values.push(phone_number);
    }

    if (email !== undefined) {
      updates.push("email = ?");
      values.push(email);
    }

    if (password !== undefined) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updates.push("password = ?");
      values.push(hashedPassword);
    }

    if (type !== undefined) {
      updates.push("type = ?");
      values.push(type);
    }

    if (updates.length === 0) {
      connection.release();
      return { success: false, message: "No fields to update" };
    }

    const query = `
      UPDATE customer
      SET ${updates.join(", ")}
      WHERE id = ?
    `;
    values.push(customerId);

    const [result] = await connection.execute(query, values);

    connection.release();

    if (result.affectedRows === 0) {
      return { success: false, message: "Customer Not Found or Not Updated" };
    }

    return { success: true, message: "Customer updated successfully" };
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
}

//Delete Customer
async function deleteCustomer(customerId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM customer WHERE id = ?`;

    const [result] = await connection.execute(query, [customerId]);

    connection.release();

    // Check if the customer was actually deleted
    if (result.affectedRows === 0) {
      throw new Error("Customer Not Found or Already Deleted");
    }

    return result;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
}

module.exports = {
  saveCustomer,
  findAllCustomer,
  findCustomerById,
  updateCustomer,
  deleteCustomer,
};
