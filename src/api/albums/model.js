const db = require("../../config/database"); // Import the database connection

const readAll = () => {
  return db.query("SELECT * FROM albums");
};

const readOne = (id) => {
  return db.query("SELECT * FROM albums WHERE id = ?", [id]);
};

const readOneByAlbumId = (id) => {
  return db.query(
    "SELECT track.* FROM track JOIN albums ON track.id_album = albums.id WHERE albums.id = ?",
    [id],
  );
};

const insertOne = (album) => {
  const { title, genre, picture, artist } = album;
  return db.query(
    "INSERT INTO albums (title, genre, picture, artist) VALUES (?, ?, ?, ?)",
    [title, genre, picture, artist],
  );
};

const editOne = (id, album) => {
  return db.query("UPDATE albums SET ? WHERE id = ?", [album, id]);
};

const removeOne = (id) => {
  return db.query("DELETE FROM albums WHERE id = ?", [id]);
};

// add more function for each action you want to perform on the albums table

module.exports = {
  readAll,
  readOne,
  readOneByAlbumId,
  insertOne,
  editOne,
  removeOne,
};
