const albumsModel = require("./model");

const browse = async ({ res, next }) => {
  try {
    const [albums] = await albumsModel.readAll(); // Fetch all albums from the database
    res.json(albums); // Respond with the albums in JSON format
  } catch (err) {
    next(err); // Pass any errors to the error-handling middleware
  }
};

const read = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [[album]] = await albumsModel.readOne(id);
    if (album) res.json(album);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

const readByAlbumId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [[album]] = await albumsModel.readOne(id);
    const [tracks] = await albumsModel.readTracks(id);
    album.tracks = tracks;
    if (album) res.json(album);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  try {
    const album = req.body;
    const [result] = await albumsModel.create(album);
    if (result.affectedRows) {
      const [[album]] = await albumsModel.readOne(result.insertId);
      res.status(201).json(album);
    } else res.sendStatus(400);
  } catch (error) {
    next(error);
  }
};

const edit = async (req, res, next) => {
  try {
    const id = req.params.id;
    const album = req.body;
    const [result] = await albumsModel.update(album, id);
    if (result.affectedRows) res.sendStatus(204);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [result] = await albumsModel.deleteOne(id);
    if (result.affectedRows) res.sendStatus(204);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  browse,
  read,
  readByAlbumId,
  add,
  edit,
  destroy,
};
