const albumsModel = require("./model");

const getAll = async ({ res, next }) => {
  try {
    const [albums] = await albumsModel.readAll(); // Fetch all albums from the database
    res.json(albums); // Respond with the albums in JSON format
  } catch (err) {
    next(err); // Pass any errors to the error-handling middleware
  }
};

const getOne = (req, res) => {
  res.status(200).send("Get One route is OK");
};

const getTracksByAlbumId = (req, res) => {
  res.status(200).send("Get Albums route is OK");
};

const postAlbums = (req, res) => {
  res.status(200).send("Post route is OK");
};

const updateAlbums = (req, res) => {
  res.status(200).send("Update route is OK");
};

const deleteAlbums = (req, res) => {
  res.status(200).send("Delete route is Ok");
};

module.exports = {
  getAll,
  getOne,
  getTracksByAlbumId,
  postAlbums,
  updateAlbums,
  deleteAlbums,
};
