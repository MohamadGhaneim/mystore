const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const crypto = require("crypto");

const upload = require("./uploadMiddleware");

const app = express();
app.use(cors());
app.use(express.json());
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mystore",
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Missing username or password" });

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  try {
    const [results] = await db
      .promise()
      .query("SELECT * FROM managers WHERE username = ? AND password = ?", [
        username,
        hashedPassword,
      ]);

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const data = results[0];
    res.json({
      success: true,
      id: data.id,
      display_name: data.display_name,
      username: data.username,
      phone: data.phone,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/products", upload.single("image"), (req, res) => {
  const { managerid, title, price, quantity } = req.body;

  if (!managerid || !title || !price || !quantity || !req.file) {
    return res.status(400).json({ error: "Missing data" });
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  const sql = `
    INSERT INTO products (title, price, quantity, image_url, manager_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, price, quantity, imageUrl, managerid],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({
        success: true,
        message: "Product added successfully",
        imageUrl,
      });
    }
  );
});

app.get("/products", (req, res) => {
  const sql = `
    SELECT p.id, p.title, p.price, p.quantity, p.image_url, m.display_name AS manager_name
    FROM products p
    JOIN managers m ON p.manager_id = m.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: "Database error" });
    }

    const products = results.map((product) => ({
      ...product,
      image_url: `${req.protocol}://${req.get("host")}${product.image_url}`,
    }));

    res.json({ success: true, products });
  });
});

app.delete("/products/:id", (req, res) => {
  const productId = req.params.id;
  //console.log("Deleting product with ID:", productId);
  if (!productId) {
    return res.status(400).json({ error: "Missing product ID" });
  }

  const sql = "DELETE FROM products WHERE id = ?";

  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted successfully" });
  });
});

app.put("/products", upload.single("image"), (req, res) => {
  const { id, title, price, quantity } = req.body;

  if (!id || !title || !price || !quantity) {
    return res.status(400).json({ error: "Missing data" });
  }

  let sql = "UPDATE products SET title = ?, price = ?, quantity = ?";
  const values = [title, price, quantity];
  if (req.file) {
    const imageUrl = `/uploads/${req.file.filename}`;
    sql += ", image_url = ?";
    values.push(imageUrl);
  }

  sql += " WHERE id = ?";
  values.push(id);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    //console.log("quantity:", quantity);
    //console.log("id product:", id);
    res.json({
      success: true,
      message: "Product updated successfully",
      ...(req.file && { imageUrl: `/uploads/${req.file.filename}` }),
    });
  });
});


app.put("/products/quantities", (req, res) => {
  const { products } = req.body;

  if (!Array.isArray(products)) {
    return res.status(400).json({ error: "Invalid products data" });
  }

  const updates = products.map(({ id, newQuantity  }) => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE products SET quantity = ? WHERE id = ?";
      db.query(sql, [newQuantity , id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });

  Promise.all(updates)
    .then(() => {
      res.json({ success: true, message: "Quantities updated successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Database error" });
    });
});



app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
