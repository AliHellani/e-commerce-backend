CREATE TABLE plant (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plant_name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  photo VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  pot VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  subcategory_id INT NOT NULL,
  FOREIGN KEY (subcategory_id) REFERENCES subcategory(id) ON DELETE CASCADE
);
