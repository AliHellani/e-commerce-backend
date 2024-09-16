const pool = require("../config/db");

// Create Category
async function saveCategory(categoryData) {
  const { category_name } = categoryData;
  try {
    const connection = await pool.getConnection();

    const query = `
      INSERT INTO category (category_name)
      VALUES (?)
    `;

    const [result] = await connection.execute(query, [category_name]);

    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

// Find All Categories
async function findAllCategories() {
  try {
    const connection = await pool.getConnection();

    const query = `
      SELECT * FROM category
    `;

    const [rows] = await connection.execute(query);

    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding categories:", error);
    throw error;
  }
}

// Find Category By ID
async function findCategoryById(categoryId) {
  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT * FROM category WHERE id = ?
    `;

    const [rows] = await connection.execute(query, [categoryId]);

    connection.release();

    if (rows.length === 0) {
      throw new Error("Category Not Found!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error finding category by ID:", error);
    throw error;
  }
}

// Update Category
async function updateCategory(categoryData) {
  const { id, category_name } = categoryData;
  try {
    const connection = await pool.getConnection();

    const query = `
      UPDATE category
      SET category_name = ?
      WHERE id = ?
    `;

    const [result] = await connection.execute(query, [category_name, id]);

    connection.release();

    if (result.affectedRows === 0) {
      throw new Error("Category Not Found or No Changes Made");
    }

    return result;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

// Delete Category
async function deleteCategory(categoryId) {
  try {
    const connection = await pool.getConnection();
    const query = `
      DELETE FROM category WHERE id = ?
    `;

    const [result] = await connection.execute(query, [categoryId]);

    connection.release();

    // Check if the category was actually deleted
    if (result.affectedRows === 0) {
      throw new Error("Category Not Found or Already Deleted");
    }

    return result;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

module.exports = {
  saveCategory,
  findAllCategories,
  findCategoryById,
  updateCategory,
  deleteCategory,
};
