const express = require("express");
const connectDB = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./Model/userModel");
const app = express();
const port = 3000;

connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Prakash and sachin");
});
app.get("/users", async (req, res) => {
  try {
    let user = await User.find({});
    res.send({ user, message: "all the users are fetched" });
  } catch (error) {
    res.send({ error, message: "the req is denied" });
  }
});
app.post("/createUser", async (req, res) => {
  console.log(req);
  const { name, email, password } = req.body;
  try {
    let user = await new User({
      name,
      email,
      password,
    });
    await user.save();
    res.send({ user, message: "the new User is successfully created" });
  } catch (error) {
    res.send({ error, message: "the req is denied" });
  }
});
app.patch("/patch/:id", async (req, res) => {
  try {
    console.log(req.params);
    console.log(req.query);
    let AllTheUsers = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send({ AllTheUsers, message: "this is successfully patched" });
  } catch (error) {
    res.send({ error, message: "the req is denied" });
  }
});
app.put("/put/:id", async (req, res) => {
  try {
    console.log(req.params);
    console.log(req.query);
    let AllTheUsers = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send({ AllTheUsers, message: "this is successfully patched" });
  } catch (error) {
    res.send({ error, message: "the req is denied" });
  }
});
app.delete("/delete/:id", async (req, res) => {
  try {
    let AllTheUsers = await User.findByIdAndDelete(req.params.id);
    res.send({ message: "this is successfully deleted" });
  } catch (error) {
    res.send({ error, message: "the req is denied" });
  }
});
app.post("/register", async (req, res) => {
  console.log(req?.body?.email);
  // 1- check whether the user already registered or not
  const emailCheck = await User.find({ email: req?.body?.email });
  console.log(emailCheck, "emailCheck");
  if (emailCheck.length > 0) {
    return res.status(400).send({ message: "the User is Already Exists " });
  }
  const salt = await bcrypt.genSalt(10);
  console.log(salt, "salt");
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  console.log(hashPassword, "hashPassword");

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const savedUser = await newUser.save();
    res.send({ savedUser, message: "the user is saved Successfully" });
  } catch (error) {
    res.send({ error, message: "the req is denied" });
  }
});
app.post("/login", async (req, res) => {
  const existingUser = await User.findOne({ email: req?.body?.email });
  console.log(existingUser, "existingUser");
  if (!existingUser) {
    return res
      .status(400)
      .send({ message: "the User Does not exists please log in " });
  }
  const validatePassword = await bcrypt.compare(
    req.body.password,
    existingUser?.password
  );
  if (!validatePassword) {
    return res.status(400).send({ message: "the Password does not Match " });
  }
  const token = jwt.sign(
    {
      _id: existingUser._id,
    },
    process.env.SECRET_TOKEN,
    { expiresIn: "1h" }
  );
  res
    .header("auth-token", token)
    .send({
      token,
      existingUser: { name: existingUser.name, email: existingUser.email },
      message: "the user is logged in Successfully",
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
