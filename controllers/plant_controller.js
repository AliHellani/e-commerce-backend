const plantRepository = require("../repositories/plant_repository");
const validator = require("validator");

async function createPlant(req, res) {
  const {
    plant_name,
    description,
    photo,
    price,
    pot,
    quantity,
    subcategory_id,
  } = req.body;

  if (
    !plant_name ||
    !description ||
    !photo ||
    !price ||
    !pot ||
    !quantity ||
    !subcategory_id
  ) {
    return res.status(400).json({ error: "All Fields are Required!" });
  }

  if (!validator.isDecimal(String(price))) {
    return res.status(400).json({ error: "Invalid Price Format!" });
  }

  if (!validator.isInt(String(quantity))) {
    return res.status(400).json({ error: "Invalid Quantity!" });
  }

  if (!validator.isInt(String(subcategory_id))) {
    return res.status(400).json({ error: "Invalid Subcategory ID!" });
  }

  try {
    const result = await plantRepository.savePlant({
      plant_name,
      description,
      photo,
      price,
      pot,
      quantity,
      subcategory_id,
    });

    return res.status(201).json({
      message: "Plant created successfully",
      plantId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create plant",
      details: error.message,
    });
  }
}

// Get All Plants
async function getAllPlants(req, res) {
  try {
    const plants = await plantRepository.findAllPlants();
    return res.status(200).json(plants);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve plants",
      details: error.message,
    });
  }
}

// Get Plant By ID
async function getPlantById(req, res) {
  const { id } = req.params;
  try {
    const plant = await plantRepository.findPlantById(id);
    return res.status(200).json(plant);
  } catch (error) {
    return res.status(404).json({
      error: "Plant not found",
      details: error.message,
    });
  }
}

//Update Plant
async function updatePlant(req, res) {
  const { id } = req.params;
  const plantData = req.body;

  try {
    const result = await plantRepository.updatePlant(id, plantData);

    if (result.success) {
      return res.status(200).json({
        message: "Plant updated successfully",
      });
    } else {
      return res.status(400).json({
        error: result.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update plant",
      details: error.message,
    });
  }
}

// Delete Plant
async function deletePlant(req, res) {
  const { id } = req.params;
  try {
    await plantRepository.deletePlant(id);
    return res.status(200).json({ message: "Plant deleted successfully" });
  } catch (error) {
    return res.status(404).json({
      error: "Failed to delete plant",
      details: error.message,
    });
  }
}

module.exports = {
  createPlant,
  getAllPlants,
  getPlantById,
  updatePlant,
  deletePlant,
};
