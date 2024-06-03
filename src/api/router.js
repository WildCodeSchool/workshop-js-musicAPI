const { Router } = require("express"); // Import the router from express

const router = Router(); // Initialize a new router

// Import your controller middlewares
const albums = require("./albums/controller");

router.get("/albums", albums.getAll);
router.get("/albums/:id", albums.getOne);
router.get("/albums/:id/tracks", albums.getTracksByAlbumId);
router.post("/albums", albums.postAlbums);
router.put("/albums/:id", albums.updateAlbums);
router.delete("/albums/:id", albums.deleteAlbums);

// define tracks routes here

module.exports = router;
