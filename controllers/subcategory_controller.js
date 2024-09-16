const subcategoryRepository = require("../repositories/subcategory_repository");
const validator = require("validator");

//Create Subcategory
async function createSubcategory(req, res) {
  const { subcategory_name, category_id } = req.body;

  if (!subcategory_name || !category_id) {
    return res.status(400).json({ error: "All Fields are Required!" });
  }

  if (!validator.isInt(String(category_id))) {
    return res.status(400).json({ error: "Invalid Category ID!" });
  }

  try {
    const result = await subcategoryRepository.saveSubcategory({
      subcategory_name,
      category_id,
    });

    return res.status(201).json({
      message: "Subcategory created successfully",
      subcategoryId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create subcategory",
      details: error.message,
    });
  }
}

// Get All Subcategories
async function getAllSubcategories(req, res) {
  try {
    const subcategories = await subcategoryRepository.findAllSubcategories();

    return res.status(200).json(subcategories);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve subcategories",
      details: error.message,
    });
  }
}

// Get Subcategory By ID
async function getSubcategoryById(req, res) {
  const { id } = req.params;
  try {
    const subcategory = await subcategoryRepository.findSubcategoryById(id);

    return res.status(200).json(subcategory);
  } catch (error) {
    return res.status(404).json({
      error: "Subcategory not found",
      details: error.message,
    });
  }
}

//Update Subcategory
async function updateSubcategory(req, res) {
  const { id } = req.params;
  const { subcategory_name, category_id } = req.body;

  if (subcategory_name === undefined && category_id === undefined) {
    return res.status(400).json({
      error:
        "At least one field (subcategory_name or category_id) is required!",
    });
  }

  if (category_id !== undefined && !validator.isInt(String(category_id))) {
    return res.status(400).json({ error: "Invalid Category ID!" });
  }

  try {
    const result = await subcategoryRepository.updateSubcategory({
      id,
      subcategory_name,
      category_id,
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
      error: "Failed to update subcategory",
      details: error.message,
    });
  }
}

// Delete Subcategory
async function deleteSubcategory(req, res) {
  const { id } = req.params;
  try {
    await subcategoryRepository.deleteSubcategory(id);

    return res
      .status(200)
      .json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    return res.status(404).json({
      error: "Failed to delete subcategory",
      details: error.message,
    });
  }
}

module.exports = {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
};
