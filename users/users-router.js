const express = require("express");
const Users = require("./users-model");
const bcrypt = require("bcryptjs");
const router = express.Router();
const auth = require("./users-middleware");

router.get("/users", auth.auth(), async (req, res, next) => {
  try {
    res.json(await Users.find());
  } catch (err) {
    next(err);
  }
});

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

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await Users.findBy({ username });

    if (!user) {
      return res.status(401).json({
        msg: "Invalid Credentials",
      });
    }

    // compare body password to database password

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ msg: "You shall not pass" });
    }

    req.session.user = user;

    console.log(req.session);

    res.json({
      msg: `Welcome ${user.username}`,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/logout", async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.status(204).end();
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
