const db = require("../database/config");

async function add(newUser) {
  const [id] = await db("users").insert(newUser);

  return findById(id);
}
function find() {
  return db("users").select("id", "username");
}

function findBy(filter) {
  return db("users").select("id", "username", "password").where(filter).first();
}

function findById(id) {
  return db("users").select("id", "username").where({ id }).first();
}

module.exports = {
  add,
  findBy,
  findById,
  find,
};
