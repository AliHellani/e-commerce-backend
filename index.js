require("dotenv").config({ path: "./secret.env" });

const express = require("express");
const app = express();
const pool = require("./config/db");
const PORT = process.env.PORT || 3001;

const customerController = require("./controllers/customer_controller");
const categoryController = require("./controllers/category.controller");
const subcategoryController = require("./controllers/subcategory_controller");
const plantController = require("./controllers/plant_controller");
const ordersController = require("./controllers/orders_controller");
const orderItemController = require("./controllers/order_item_controller");

app.use(express.json());

//Customer
app.post("/createCustomer", customerController.createCustomer);
app.get("/findAllCustomer", customerController.getAllCustomer);
app.get("/findCustomerById/:id", customerController.getCustomerById);
app.put("/updateCustomer/:id", customerController.updateCustomer);
app.delete("/deleteCustomer/:id", customerController.deleteCustomer);

//Category
app.post("/createCategory", categoryController.createCategory);
app.get("/findAllCategories", categoryController.getAllCategories);
app.get("/findCategoryById/:id", categoryController.getCategoryById);
app.put("/updateCategory/:id", categoryController.updateCategory);
app.delete("/deleteCategory/:id", categoryController.deleteCategory);

//Subcategory
app.post("/createSubcategory", subcategoryController.createSubcategory);
app.get("/findAllSubcategory", subcategoryController.getAllSubcategories);
app.get("/findSubcategoryById/:id", subcategoryController.getSubcategoryById);
app.put("/updateSubcategory/:id", subcategoryController.updateSubcategory);
app.delete("/deleteSubcategory/:id", subcategoryController.deleteSubcategory);

//Plants
app.post("/createPlant", plantController.createPlant);
app.get("/findAllPlants", plantController.getAllPlants);
app.get("/findPlantById/:id", plantController.getPlantById);
app.put("/updatePlant/:id", plantController.updatePlant);
app.delete("/deletePlant/:id", plantController.deletePlant);

//Orders
app.post("/createOrder", ordersController.createOrder);
app.get("/findAllOrders", ordersController.getAllOrders);
app.get("/findOrdersById/:id", ordersController.getOrderById);
app.put("/updateOrders/:id", ordersController.updateOrder);
app.delete("/deleteOrder/:id", ordersController.deleteOrder);

//Order Item
app.post("/createOrderItem", orderItemController.createOrderItem);
app.get("/findAllOrderItem", orderItemController.getAllOrderItems);
app.get("/findOrderItemById/:id", orderItemController.getOrderItemById);
app.put("/updateOrderItem/:id", orderItemController.updateOrderItem);
app.delete("/deleteOrderItem/:id", orderItemController.deleteOrderItem);

//TEST
app.get("/test", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT 1 + 1 AS result`);
    res.status(200).json({
      message: "Database connection is Active",
      result: rows[0].result,
    });
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
