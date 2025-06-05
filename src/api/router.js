const { Router } = require("express"); // Import the router from express

const router = Router(); // Initialize a new router

// Import your controller middlewares
const albums = require("./albums/controller");

router.get("/albums", albums.browse);
router.get("/albums/:id", albums.read);
router.get("/albums/:id/tracks", albums.readByAlbumId);
router.post("/albums", albums.add);
router.put("/albums/:id", albums.edit);
router.delete("/albums/:id", albums.destroy);

// define tracks routes here

module.exports = router;
