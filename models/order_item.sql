CREATE TABLE order_item (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quantity INT NOT NULL,
  orders_id INT NOT NULL,
  plant_id INT NOT NULL,
  FOREIGN KEY (orders_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (plant_id) REFERENCES plant(id) ON DELETE CASCADE
);
