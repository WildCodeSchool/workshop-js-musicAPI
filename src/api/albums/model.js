const db = require("../../config/database"); // Import the database connection

const readAll = () => {
  return db.query("SELECT * FROM albums");
};

// add more function for each action you want to perform on the albums table

module.exports = {
  readAll,
};
