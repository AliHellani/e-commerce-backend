const pool = require("../config/db");
const validator = require("validator");

// Create Subcategory
async function saveSubcategory(subcategoryData) {
  const { subcategory_name, category_id } = subcategoryData;
  try {
    const connection = await pool.getConnection();

    const query = `
      INSERT INTO subcategory (subcategory_name, category_id)
      VALUES (?, ?)
    `;

    const [result] = await connection.execute(query, [
      subcategory_name,
      category_id,
    ]);

    connection.release();

    return result;
  } catch (error) {
    console.error("Error creating subcategory:", error);
    throw error;
  }
}

// Find All Subcategories
async function findAllSubcategories() {
  try {
    const connection = await pool.getConnection();

    const query = `SELECT * FROM subcategory`;

    const [rows] = await connection.execute(query);

    connection.release();

    return rows;
  } catch (error) {
    console.error("Error finding subcategories:", error);
    throw error;
  }
}

// Find Subcategory By ID
async function findSubcategoryById(subcategoryId) {
  try {
    const connection = await pool.getConnection();

    const query = `SELECT * FROM subcategory WHERE id = ?`;

    const [rows] = await connection.execute(query, [subcategoryId]);

    connection.release();

    if (rows.length === 0) {
      throw new Error("Subcategory Not Found!");
    }

    return rows[0];
  } catch (error) {
    console.error("Error finding subcategory by ID:", error);
    throw error;
  }
}

//Update Subcategory
async function updateSubcategory(subcategoryData) {
  const { id, subcategory_name, category_id } = subcategoryData;

  try {
    const connection = await pool.getConnection();

    const updates = [];
    const values = [];

    if (subcategory_name !== undefined) {
      updates.push("subcategory_name = ?");
      values.push(subcategory_name);
    }

    if (category_id !== undefined) {
      if (!validator.isInt(String(category_id))) {
        connection.release();
        return { success: false, message: "Invalid Category ID!" };
      }
      updates.push("category_id = ?");
      values.push(category_id);
    }

    if (updates.length === 0) {
      connection.release();
      return { success: false, message: "No fields to update" };
    }

    const query = `UPDATE subcategory SET ${updates.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result] = await connection.execute(query, values);

    connection.release();

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "Subcategory Not Found or Not Updated",
      };
    }

    return { success: true, message: "Subcategory updated successfully" };
  } catch (error) {
    console.error("Error updating subcategory:", error);
    throw error;
  }
}

// Delete Subcategory
async function deleteSubcategory(subcategoryId) {
  try {
    const connection = await pool.getConnection();

    const query = `DELETE FROM subcategory WHERE id = ?`;

    const [result] = await connection.execute(query, [subcategoryId]);

    connection.release();

    if (result.affectedRows === 0) {
      throw new Error("Subcategory Not Found or Already Deleted");
    }

    return result;
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    throw error;
  }
}

module.exports = {
  saveSubcategory,
  findAllSubcategories,
  findSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
};
