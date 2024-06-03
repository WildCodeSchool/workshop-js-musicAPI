# Setting up an API with express

## Introduction

The objective of this workshop is firstly to review the implementation and configuration of an API and a complete CRUD with the ExpressJS micro-framework, then secondly to adapt our first implementation to Harmonia.

As you will have understood, the objective is above all to see each step of creating an API with nodejs independently of the architecture and framework used.

### Getting started

- Git clone this [project](https://github.com/WildCodeSchool/workshop-js-musicAPI)
- Run `npm install`
- Setup your .env file
- Run `npm run db:dump`
- Run `npm run dev`

In the project directory, you can run different scripts:

- `npm run dev` : Runs the app in the development mode using `nodemon` on port 8000 by default. You can change it by creating a `PORT` variable in your `.env` file. (You should create this file)
- `npm start`: Runs the app in production mode. This will **not re-start when you write your code !**
- `npm run lint` : This app came with basic ESLint config (Prettier + React), you can run a check every time using this script. :collision: BEWARE :collision: If you don't have Prettier installed in your Editor with format on save, you should run it with the next script
- `npm run prettier` : It runs Prettier on all your staged files. (only useful if you don't have Prettier installed in your editor)
- `npm test` : This is the most important command for this workshop. It will test your CRUDs with `jest`. More informations below.
- `npm run db:dump` : Generate the database structure and insert test data

### Project architecture

```sh
src
├── config
│   ├── server.js # setup api routes & middlewares
│   ├── database.js # setup database connection
├── api
│   ├── router.js # define api routes for all modules with the corresponding http method (get, post, put, delele)
│   ├── albums # albums module folder
│   │   ├── controller.js # define middlewares function associated to each routes defined to perform CRUD actions
│   │   ├── model.js # define function to perform action on the database
│   ├── tracks # tracks module folder
│   │   ├── controller.js # define middlewares function associated to each routes defined to perform CRUD actions
│   │   ├── model.js # define function to perform action on the database
├── app.js # launch the api
```

### Automated tests

This workshop comes with integration tests on most of the routes, you can execute them to test your code using the following command : `npm test`

![testgif](https://media.giphy.com/media/sECT307ocX509Gh9bI/giphy.gif)

- GET `/api/tracks`
- GET `/api/tracks/1`
- POST `/api/tracks`
- PUT `/api/tracks`
- DELETE `/api/tracks`
- GET `/api/albums`
- GET `/api/albums/1`
- GET `/api/albums/1/tracks`
- POST `/api/albums`
- PUT `/api/albums`
- DELETE `/api/albums`

The test result helps you know what return is expected for each route, the errors returned can help you debug your code more easily.
{:.alert-info}

## Your mission

All you have to do, is writing your own logic in each route file (`getAll`, `getOne`, `post`, `update`, `delete`).  
Here are some user stories about what you need to do:

- As a user, I need to be able to retrieve the full list of tracks
- As a user, I need to be able to retrieve one track by its ID
- As a user, I need to be able to create a new track
- As a user, I need to be able to update a track
- As a user, I need to be able to delete a track
- As a user, I need to be able to retrieve the full list of albums
- As a user, I need to be able to retrieve one album by its ID
- As a user, I need to be able to retrieve the tracks list of one album
- As a user, I need to be able to create a new album
- As a user, I need to be able to update an album
- As a user, I need to be able to delete an album

**Remember :** for the tests to work properly, you need an `album` with id `1` and a track with id `1` in your DB, in case you removed them just run again the following command to reset your database schema : `npm run db:dump`

### Rules

- Response bodies should be JSON.
- Request bodies should be JSON.
- `PUT` and `DELETE` request should return `204 no content`.
- `POST` request should return `201 created` with the associated created resource.


## Guideline

### API - Configuration

The `/src/config/` folder contains the express server configuration as well as the configuration to connect to the database

1/ `server.js`

```js
const express = require("express"); // import express
const router = require("../api/router"); // import the main router

const app = express(); // Initialize a express server
app.use(express.json()); // Apply a global middlewares to parse incoming request data to json
app.use("/api", router); // Apply the main router to the endpoint /api

const errorHandler = async (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Log the error to the console for debugging purposes
  console.error(err);
  console.error("on req:", req.method, req.path);

  res.status(500).json("Internal Server Error");
};

app.use(errorHandler); // Apply the error middleware globally

module.exports = app; // export your server config

```

- Initialize a http server
- Link the routes
- Apply middlewares (data parsing, error handling, etc...)
- export the server

2/ `database.js`

```js
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST, // address of the server
  port: process.env.DB_PORT, // port of the DB server (mysql), not to be confused with the nodeJS server PORT !
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = db;

```

- Initialize a connection to a database using the env variables defined in `.env` file.
- export the connection

### API - Models & Controllers

The `/src/api` contains a folder for each modules of your api (corresponding to your tables)
Each modules contains at least 2 files : 

1/ `model.js`

```js
const db = require("../../config/database"); // Import the database connection

const readAll = () => {
  return db.query("SELECT * FROM albums");
};

// add more function for each action you want to perform on the albums table

module.exports = {
  readAll,
};

```

- Import the database connection defined in `src/config/database.js`
- Define a function for each SQL query which returns the result
- Exports all your function in a object

2/ `controller.js`

```js
const albumsModel = require("./model");

const getAll = async ({ res, next }) => {
  try {
    const [albums] = await albumsModel.readAll(); // Fetch all albums from the database
    res.json(albums); // Respond with the albums in JSON format
  } catch (err) {
    next(err); // Pass any errors to the error-handling middleware
  }
};

// add more function for each action you want to perform

module.exports = {
  getAll,
  getOne,
  getTracksByAlbumId,
  postAlbums,
  updateAlbums,
  deleteAlbums,
};
```

- Import the corresponding `model`
- Define a middleware function for each action you want to perform
- In your function, call the corresponding model function
- If a error is catch call the next method passing the error in argument
- Otherwise, send a response with the corresponding status code and the data formated in json
- Exports all your function in a object

### API - Routing

The `src/api/router.js` file contains all the routes for each modules with the corresponding http method and controller.

`router.js`

```js
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

```

- Import the Router from express
- Initalize a new router
- Import your controller middlewares
- Define routes for each modules with the appropried http method (get, post, put, delete) and apply the corresponding controller middleware to it
- Exports your router

This `router.js` file is imported in the `src/config/server.js` file to apply the routes to our server adding the `/api` endpoint.


# Next step : Harmonia 

Before continuing with the next step where we will see the implementation of this API within the Harmonia framework, I advise you to take an overview to analyze your code and be sure to understand its progress.

[Setting up an API with Harmonia](./MORE.md)

