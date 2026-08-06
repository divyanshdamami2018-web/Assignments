const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const connectDB = require("./config/Database");
const UserModel = require("./AuthModel");
const ProductModel = require("./ProductModel");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "assignment_1_secret";

app.use(express.json());
app.use(cookieParser());

// ====================// veryfy-------------------

function verifyToken(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const verify = jwt.verify(token, JWT_SECRET);

    req.user = verify;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
}

// =========Registration========================

app.post("/registration", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.send("User Already Exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      name,
      email,
      password: hashPassword,
    });

    res.send("Registration Successful");
  } catch (err) {
    res.send(err.message);
  }
});

//==================login==========================

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.send("User Not Found");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.send("Wrong Password");
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res.cookie("token", token);

    res.send("Login Successful");
  } catch (err) {
    res.send(err.message);
  }
});

//======================Lpgout=========================

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

//============Create Product============================

app.post("/createProduct", verifyToken, async (req, res) => {
  try {
    const { name, SKU, description, price, category } = req.body;

    const product = await ProductModel.findOne({ SKU });

    if (product) {
      return res.send("Product Already Exists");
    }

    await ProductModel.create({
      name,
      SKU,
      description,
      price,
      category,
    });

    res.send("Product Created");
  } catch (err) {
    res.send(err.message);
  }
});

//================GetAllproduct===================================

app.get("/getAllProduct", verifyToken, async (req, res) => {
  try {
    const products = await ProductModel.find();

    res.send(products);
  } catch (err) {
    res.send(err.message);
  }
});

//=====================GetSingleProduct=====================================

app.get("/getSingleProduct/:id", verifyToken, async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    res.send(product);
  } catch (err) {
    res.send(err.message);
  }
});

//========================updateSingleProduct======================

app.patch("/updateSingleProduct/:id", verifyToken, async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,

      req.body,

      { new: true },
    );

    res.send(product);
  } catch (err) {
    res.send(err.message);
  }
});

//=================deleteSingleProduct========================

app.delete("/deleteSingleProduct/:id", verifyToken, async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.id);

    res.send("Deleted");
  } catch (err) {
    res.send(err.message);
  }
});

connectDB();

app.listen(PORT, () => {
  console.log("Server Started");
});
