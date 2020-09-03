const express = require("express");
const Users = require("./users-model");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.get("/users"),
  async (req, res, next) => {
    try {
      res.json(await Users.find());
    } catch (err) {
      next(err);
    }
  };

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await Users.findBy({ username });

    if (user) {
      return res.status(401).json({ msg: "Username is already taken" });
    }

    const newUser = await Users.add({
      username,
      password: await bcrypt.hash(password, 14),
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
