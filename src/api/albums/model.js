const db = require("../../config/database"); // Import the database connection

const readAll = () => {
  return db.query("SELECT * FROM albums");
};

const readOne = (id) => {
  return db.query("SELECT * FROM albums WHERE id = ?", [id]);
};

const readTracks = (id) => {
  return db.query(
    "SELECT track.* FROM albums JOIN track ON albums.id = track.id_album WHERE albums.id = ?",
    [id]
  );
};

const create = (album) => {
  return db.query(
    "INSERT INTO albums (title, genre, picture, artist) VALUES (?, ?, ?, ?)",
    [album.title, album.genre, album.picture, album.artist]
  );
};

const update = (album, id) => {
  return db.query("UPDATE albums SET ? WHERE id = ?", [album, id]);
};

const deleteOne = (id) => {
  return db.query("DELETE FROM albums WHERE id = ?", [id]);
};

// add more function for each action you want to perform on the albums table

module.exports = {
  readAll,
  readOne,
  readTracks,
  create,
  update,
  deleteOne,
};
