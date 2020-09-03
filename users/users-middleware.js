const bcrypt = require("bcryptjs");
const Users = require("./users-model");

function auth() {
  return async (req, res, next) => {
    try {
      if (!req.session || !req.session.user) {
        return res.status(401).json({ msg: "You need to be logged in" });
      }
      next();
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
}

module.exports = { auth };
