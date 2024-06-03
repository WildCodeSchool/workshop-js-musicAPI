require("dotenv").config(); // import dotenv to allow access to .env variables
const app = require("./config/server");
const db = require("./config/database");

const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await db.getConnection();
    await app.listen(PORT);
    console.info(`Server started at : http://localhost:${PORT}`);
  } catch (error) {
    console.error(error);
  }
})();
