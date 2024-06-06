const albumsModel = require("./model");

const getAll = async ({ res, next }) => {
  try {
    const [albums] = await albumsModel.readAll(); // Fetch all albums from the database
    res.json(albums); // Respond with the albums in JSON format
  } catch (err) {
    next(err); // Pass any errors to the error-handling middleware
  }
};

const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[album]] = await albumsModel.readOne(id);
    if (album) res.json(album);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

const getTracksByAlbumId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [albums] = await albumsModel.readOneByAlbumId(id);
    res.json(albums);
  } catch (error) {
    next(error);
  }
};

const postAlbums = async (req, res, next) => {
  try {
    const albumData = req.body;
    const [result] = await albumsModel.insertOne(albumData);
    const [[album]] = await albumsModel.readOne(result.insertId);
    res.status(201).json(album);
  } catch (error) {
    next(error);
  }
};

const updateAlbums = async (req, res, next) => {
  try {
    const { id } = req.params;
    const albumData = req.body;
    const [result] = await albumsModel.editOne(id, albumData);
    if (result.affectedRows > 0) res.sendStatus(204);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

const deleteAlbums = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await albumsModel.removeOne(id);
    if (result.affectedRows > 0) res.sendStatus(204);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getOne,
  getTracksByAlbumId,
  postAlbums,
  updateAlbums,
  deleteAlbums,
};
