const customerRepository = require("../repositories/customer_repository");
const validator = require("validator");

//Create Customer
async function createCustomer(req, res) {
  const { name, phone_number, email, password, type } = req.body;

  if (!name || !phone_number || !email || !password || !type) {
    return res.status(400).json({ error: "All Fields are Require!" });
  }

  if (!["User", "Company"].includes(type)) {
    return res.status(400).json({ error: "Invalid Customer Type!" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid Email Format!" });
  }

  if (!validator.isMobilePhone(phone_number)) {
    return res.status(400).json({ error: "Invalid Phone Number!" });
  }

  try {
    const result = await customerRepository.saveCustomer({
      name,
      phone_number,
      email,
      password,
      type,
    });

    return res.status(201).json({
      message: "Customer created successfully",
      customerId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create customer",
      details: error.message,
    });
  }
}

//Get All Customer
async function getAllCustomer(req, res) {
  try {
    const customers = await customerRepository.findAllCustomer();
    return res.status(200).json(customers);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to retrieve customers", details: error.message });
  }
}

//Get Customer By ID
async function getCustomerById(req, res) {
  const { id } = req.params;
  try {
    const customer = await customerRepository.findCustomerById(id);
    return res.status(200).json(customer);
  } catch (error) {
    return res
      .status(404)
      .json({ error: "Customer not found", details: error.message });
  }
}

//Update Customer
async function updateCustomer(req, res) {
  const { id } = req.params;
  const customerData = req.body;

  if (customerData.email && !validator.isEmail(customerData.email)) {
    return res.status(400).json({ error: "Invalid email format!" });
  }

  if (
    customerData.phone_number &&
    !validator.isMobilePhone(customerData.phone_number)
  ) {
    return res.status(400).json({ error: "Invalid phone number!" });
  }

  try {
    const result = await customerRepository.updateCustomer(id, customerData);

    if (result.success) {
      return res.status(200).json({
        message: "Customer updated successfully",
      });
    } else {
      return res.status(400).json({
        error: result.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update customer",
      details: error.message,
    });
  }
}

//Delete Customer
async function deleteCustomer(req, res) {
  const { id } = req.params;

  try {
    await customerRepository.deleteCustomer(id);
    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    return res.status(404).json({
      error: "Failed to delete customer",
      details: error.message,
    });
  }
}

module.exports = {
  createCustomer,
  getAllCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
