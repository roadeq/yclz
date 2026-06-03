
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "stockhub_db"
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed");
        console.log(err);
    } else {
        console.log("MySQL Connected Successfully");
    }
});

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'manager'
)
`;

db.query(createUsersTable);


const createProductTable = `
CREATE TABLE IF NOT EXISTS product(
    productCode INT AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(100),
    category VARCHAR(100),
    quantityInStock INT,
    unitPrice DECIMAL(10,2),
    supplierName VARCHAR(100),
    dateReceived DATE
)
`;

db.query(createProductTable);

const createWarehouseTable = `
CREATE TABLE IF NOT EXISTS warehouse(
    warehouseCode INT AUTO_INCREMENT PRIMARY KEY,
    warehouseName VARCHAR(100),
    warehouseLocation VARCHAR(100)
)
`;

db.query(createWarehouseTable);

const createTransactionTable = `
CREATE TABLE IF NOT EXISTS stocktransaction(
    transactionID INT AUTO_INCREMENT PRIMARY KEY,
    transactionDate DATE,
    quantityMoved INT,
    transactionType VARCHAR(50),
    productCode INT,
    warehouseCode INT,

    FOREIGN KEY(productCode)
    REFERENCES product(productCode)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

    FOREIGN KEY(warehouseCode)
    REFERENCES warehouse(warehouseCode)
    ON UPDATE CASCADE
    ON DELETE CASCADE
)
`;

db.query(createTransactionTable);


const SECRET_KEY = "stockhub_secret_key";

// ===============================
// SIGNUP API
// ===============================
app.post("/api/signup", async (req, res) => {

    const { fullname, email, password } = req.body;

    try {

        // CHECK IF EMAIL EXISTS
        const checkEmail = "SELECT * FROM users WHERE email=?";

        db.query(checkEmail, [email], async (err, result) => {

            if (result.length > 0) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }

            // HASH PASSWORD
            const hashedPassword = await bcrypt.hash(password, 10);

            // INSERT USER
            const sql = `
            INSERT INTO users(fullname,email,password)
            VALUES(?,?,?)
            `;

            db.query(sql, [fullname, email, hashedPassword], (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.status(201).json({
                    message: "User Registered Successfully"
                });

            });

        });

    } catch (error) {
        res.status(500).json(error);
    }

});

// ===============================
// LOGIN API
// ===============================
app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email=?";

    db.query(sql, [email], async (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result[0];

        // COMPARE PASSWORD
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        // GENERATE TOKEN
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            SECRET_KEY,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login Successful",
            token
        });

    });

});

// ===============================
// TOKEN VERIFICATION MIDDLEWARE
// ===============================
function verifyToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(403).json({
            message: "Token Required"
        });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                message: "Invalid Token"
            });
        }

        req.user = decoded;

        next();

    });

}

// ===============================
// PRODUCT APIs
// ===============================

// ADD PRODUCT
app.post("/api/products", verifyToken, (req, res) => {

    const {
        productName,
        category,
        quantityInStock,
        unitPrice,
        supplierName,
        dateReceived
    } = req.body;

    const sql = `
    INSERT INTO product
    (productName,category,quantityInStock,unitPrice,supplierName,dateReceived)
    VALUES(?,?,?,?,?,?)
    `;

    db.query(sql, [
        productName,
        category,
        quantityInStock,
        unitPrice,
        supplierName,
        dateReceived
    ], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(201).json({
            message: "Product Added Successfully"
        });

    });

});

// GET ALL PRODUCTS
app.get("/api/products", verifyToken, (req, res) => {

    const sql = "SELECT * FROM product";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);

    });

});

// UPDATE PRODUCT
app.put("/api/products/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    const {
        productName,
        category,
        quantityInStock,
        unitPrice,
        supplierName,
        dateReceived
    } = req.body;

    const sql = `
    UPDATE product SET
    productName=?,
    category=?,
    quantityInStock=?,
    unitPrice=?,
    supplierName=?,
    dateReceived=?
    WHERE productCode=?
    `;

    db.query(sql, [
        productName,
        category,
        quantityInStock,
        unitPrice,
        supplierName,
        dateReceived,
        id
    ], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json({
            message: "Product Updated Successfully"
        });

    });

});

// DELETE PRODUCT
app.delete("/api/products/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM product WHERE productCode=?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json({
            message: "Product Deleted Successfully"
        });

    });

});

// ===============================
// WAREHOUSE APIs
// ===============================

// ADD WAREHOUSE
app.post("/api/warehouses", verifyToken, (req, res) => {

    const {
        warehouseName,
        warehouseLocation
    } = req.body;

    const sql = `
    INSERT INTO warehouse
    (warehouseName, warehouseLocation)
    VALUES(?,?)
    `;

    db.query(sql, [
        warehouseName,
        warehouseLocation
    ], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(201).json({
            message: "Warehouse Added Successfully"
        });

    });

});

// GET WAREHOUSES
app.get("/api/warehouses", verifyToken, (req, res) => {

    const sql = "SELECT * FROM warehouse";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);

    });

});

// ===============================
// STOCK TRANSACTION APIs
// ===============================

// ADD TRANSACTION
app.post("/api/transactions", verifyToken, (req, res) => {

    const {
        transactionDate,
        quantityMoved,
        transactionType,
        productCode,
        warehouseCode
    } = req.body;

    const sql = `
    INSERT INTO stocktransaction
    (
        transactionDate,
        quantityMoved,
        transactionType,
        productCode,
        warehouseCode
    )
    VALUES(?,?,?,?,?)
    `;

    db.query(sql, [
        transactionDate,
        quantityMoved,
        transactionType,
        productCode,
        warehouseCode
    ], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        // UPDATE STOCK AUTOMATICALLY
        if (transactionType === "Stock In") {

            const updateStock = `
            UPDATE product
            SET quantityInStock = quantityInStock + ?
            WHERE productCode=?
            `;

            db.query(updateStock, [
                quantityMoved,
                productCode
            ]);

        }

        if (transactionType === "Stock Out") {

            const updateStock = `
            UPDATE product
            SET quantityInStock = quantityInStock - ?
            WHERE productCode=?
            `;

            db.query(updateStock, [
                quantityMoved,
                productCode
            ]);

        }

        res.status(201).json({
            message: "Transaction Recorded Successfully"
        });

    });

});

// GET TRANSACTIONS
app.get("/api/transactions", verifyToken, (req, res) => {

    const sql = `
    SELECT 
    stocktransaction.*,
    product.productName,
    warehouse.warehouseName

    FROM stocktransaction

    JOIN product
    ON stocktransaction.productCode = product.productCode

    JOIN warehouse
    ON stocktransaction.warehouseCode = warehouse.warehouseCode
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);

    });

});

// ===============================
// REPORT API
// ===============================
app.get("/api/reports/inventory", verifyToken, (req, res) => {

    const sql = `
    SELECT
    productCode,
    productName,
    category,
    quantityInStock,
    unitPrice,
    (quantityInStock * unitPrice) AS totalValue
    FROM product
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);

    });

});

// ===============================
// DEFAULT ROUTE
// ===============================
app.get("/", (req, res) => {

    res.send("StockHub Backend API Running");

});

// ===============================
// SERVER
// ===============================
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});