const categoryRepository = require("../repositories/category_repository");

async function createCategory(req, res) {
  const { category_name } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: "Category name is required!" });
  }

  try {
    const result = await categoryRepository.saveCategory({ category_name });

    return res.status(201).json({
      message: "Category created successfully",
      categoryId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create category",
      details: error.message,
    });
  }
}

// Get All Categories
async function getAllCategories(req, res) {
  try {
    const categories = await categoryRepository.findAllCategories();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve categories",
      details: error.message,
    });
  }
}

// Get Category By ID
async function getCategoryById(req, res) {
  const { id } = req.params;
  try {
    const category = await categoryRepository.findCategoryById(id);
    return res.status(200).json(category);
  } catch (error) {
    return res.status(404).json({
      error: "Category not found",
      details: error.message,
    });
  }
}

// Update Category
async function updateCategory(req, res) {
  const { id } = req.params;
  const { category_name } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: "Category name is required!" });
  }

  try {
    const result = await categoryRepository.updateCategory({
      id,
      category_name,
    });

    if (result.success) {
      return res.status(200).json({
        message: "Category updated successfully",
      });
    } else {
      return res.status(400).json({
        error: result.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update category",
      details: error.message,
    });
  }
}

// Delete Category
async function deleteCategory(req, res) {
  const { id } = req.params;

  try {
    await categoryRepository.deleteCategory(id);
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(404).json({
      error: "Failed to delete category",
      details: error.message,
    });
  }
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
