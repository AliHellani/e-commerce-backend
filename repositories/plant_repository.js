const pool = require("../config/db");
const validator = require("validator");

// Create Plant
async function savePlant(plantData) {
  const {
    plant_name,
    description,
    photo,
    price,
    pot,
    quantity,
    subcategory_id,
  } = plantData;

  try {
    const connection = await pool.getConnection();

    const query = `
      INSERT INTO plant (plant_name, description, photo, price, pot, quantity, subcategory_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.execute(query, [
      plant_name,
      description,
      photo,
      price,
      pot,
      quantity,
      subcategory_id,
    ]);

    connection.release();

    return result;
  } catch (error) {
    console.error("Error creating plant:", error);
    throw error;
  }
}

// Find All Plants
async function findAllPlants() {
  try {
    const connection = await pool.getConnection();

    const query = `SELECT * FROM plant`;

    const [rows] = await connection.execute(query);

    connection.release();

    return rows;
  } catch (error) {
    console.error("Error finding plants:", error);
    throw error;
  }
}

// Find Plant By ID
async function findPlantById(plantId) {
  try {
    const connection = await pool.getConnection();

    const query = `SELECT * FROM plant WHERE id = ?`;

    const [rows] = await connection.execute(query, [plantId]);

    connection.release();

    if (rows.length === 0) {
      throw new Error("Plant Not Found!");
    }

    return rows[0];
  } catch (error) {
    console.error("Error finding plant by ID:", error);
    throw error;
  }
}

async function updatePlant(plantId, plantData) {
  const {
    plant_name,
    description,
    photo,
    price,
    pot,
    quantity,
    subcategory_id,
  } = plantData;

  try {
    const connection = await pool.getConnection();

    const updates = [];
    const values = [];

    if (plant_name !== undefined) {
      updates.push("plant_name = ?");
      values.push(plant_name);
    }

    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }

    if (photo !== undefined) {
      updates.push("photo = ?");
      values.push(photo);
    }

    if (price !== undefined) {
      if (!validator.isDecimal(String(price))) {
        throw new Error("Invalid Price Format!");
      }
      updates.push("price = ?");
      values.push(price);
    }

    if (pot !== undefined) {
      updates.push("pot = ?");
      values.push(pot);
    }

    if (quantity !== undefined) {
      if (!validator.isInt(String(quantity))) {
        throw new Error("Invalid Quantity!");
      }
      updates.push("quantity = ?");
      values.push(quantity);
    }

    if (subcategory_id !== undefined) {
      if (!validator.isInt(String(subcategory_id))) {
        throw new Error("Invalid Subcategory ID!");
      }
      updates.push("subcategory_id = ?");
      values.push(subcategory_id);
    }

    if (updates.length === 0) {
      throw new Error("No fields to update!");
    }

    const query = `
        UPDATE plant
        SET ${updates.join(", ")}
        WHERE id = ?
      `;
    values.push(plantId);

    const [result] = await connection.execute(query, values);

    connection.release();

    if (result.affectedRows === 0) {
      throw new Error("Plant Not Found or Not Updated");
    }

    return result;
  } catch (error) {
    console.error("Error updating plant:", error);
    throw error;
  }
}

// Delete Plant
async function deletePlant(plantId) {
  try {
    const connection = await pool.getConnection();

    const query = `DELETE FROM plant WHERE id = ?`;

    const [result] = await connection.execute(query, [plantId]);

    connection.release();

    if (result.affectedRows === 0) {
      throw new Error("Plant Not Found or Already Deleted");
    }

    return result;
  } catch (error) {
    console.error("Error deleting plant:", error);
    throw error;
  }
}

module.exports = {
  savePlant,
  findAllPlants,
  findPlantById,
  updatePlant,
  deletePlant,
};
