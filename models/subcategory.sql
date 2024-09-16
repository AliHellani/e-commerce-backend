CREATE TABLE subcategory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subcategory_name VARCHAR(100) NOT NULL,
  category_id INT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);
