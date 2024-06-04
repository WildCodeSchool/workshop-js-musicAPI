# Setting up an API with Harmonia

## Getting started

- Create a new Harmonia project : `npm create harmonia@latest workshop-harmonia`.
- Run `cd workshop-harmonia`.
- Run `npm install`.
- Setup your .env file in the `server` folder with your database crédentials.
- Copy and paste the content of the `dump.sql` file from the previous workshop into the `server/database/schema.sql` file and run the command `npm run db:migrate` to synchronize your database.
- Run `npm run dev:server` to start your api.

### Project architecture

Diagram allowing you to visualize the architecture of the server folder, certain parts have been deliberately omitted in this diagram to concentrate on the essentials

```sh
server
├── app # main folder of your api, contain all the logic of express (routes, controllers, middlewares)
│   │
│   ├── controllers # folder who contain all the controller middleware for each modules
│   ├── routers # folder who contain all the routes of your API for each modules
│   ├── services # folder who contain others middlewares services (data validator, email service, etc..)
│   ├── config.js # setup api routes & middlewares (main endpoint: /api, data-parsing, errorHandling)
│   │
├── bin # folder who contain some utility script for your app (database migration and seed)
│   │
│   ├── migrate.js # script who help you to synchronize your database schema using the `schema.sql` file
│   ├── seed.js # script who help you to insert some data for your test in your database using the fixture files located in `database/fixtures` folder
│   │
├── database # folder which contains everything that refers to the database (schema, fixtures, models, connection) 
│   │
│   ├── fixtures # folder who contain your seeder class who help you to insert test data in your database using the `seed.js` script located in the `bin` folder
│   ├── models # folder who contain your models class where you can define all methods to communicate and perform actions on your database
│   ├── client.js # setup database connection
│   ├── schema.sql # file who contain all the tables définition of your database, its used by the `migrate.js` script to synchronise your database structure
│   ├── tables.js # file that import and instanciate all your models class, you can import this file in your controllers to get access to any model and his methods
```


## Your mission

Take the code from the first steps of this workshop and implement it within harmonia, you can do it!

be careful no automated test is set up, use Postman to test the correct functioning of your different routes
{:.alert-warning}

[Postman get started](https://learning.postman.com/docs/getting-started/first-steps/sending-the-first-request/)


## Guideline

### Harmonia - Configuration

Nothing to do there all the configuration is already made :

- `app/config.js` contain the configuration of the server express (main route & middlewares)
- `database/client.js` Initialize a connection to a database using the env variables defined in `server/.env` file.

### Harmonia - Models

All the models class are located in the `server/database/models` folder, in this folder you'll find at least 2 files : 

1/ `AbstractRepository.js` 

The class from which all your models must inherit, this first allows you to recover the connection to the database via the `database/client.js` file and allowing you to define the methods to perform the CRUD actions common to all your models

```js
// Import database client
const database = require("../client");

// Provide database access through AbstractRepository class
class AbstractRepository {
  constructor({ table }) {
    // thx https://www.codeheroes.fr/2017/11/08/js-classes-abstraites-et-interfaces/
    if (this.constructor === AbstractRepository) {
      throw new TypeError(
        "Abstract class 'AbstractRepository' cannot be instantiated directly"
      );
    }

    // Store the table name
    this.table = table;

    // Provide access to the database client
    this.database = database;
  }
}

// Ready to export
module.exports = AbstractRepository;
```

2/ `ItemRepository.js` 

Class serving as an example, this inherits from the parent class AbstractRepository and allows you to define all the methods allowing you to perform CRUD type actions on the table to which it is attached

You can use this example to define your repository classes for each of the tables in your project and delete it once done.

```js
const AbstractRepository = require("./AbstractRepository");

class ItemRepository extends AbstractRepository {
  constructor() {
    // Call the constructor of the parent class (AbstractRepository)
    // and pass the table name "item" as configuration
    super({ table: "item" });
  }

  // The C of CRUD - Create operation

  async create(item) {
    // Execute the SQL INSERT query to add a new item to the "item" table
    const [result] = await this.database.query(
      `insert into ${this.table} (title, user_id) values (?, ?)`,
      [item.title, item.user_id]
    );

    // Return the ID of the newly inserted item
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific item by its ID
    const [rows] = await this.database.query(
      `select * from ${this.table} where id = ?`,
      [id]
    );

    // Return the first row of the result, which represents the item
    return rows[0];
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all items from the "item" table
    const [rows] = await this.database.query(`select * from ${this.table}`);

    // Return the array of items
    return rows;
  }

}

module.exports = ItemRepository;
```

- Declare a class corresponding to a table in your database
- Extends this class from the AbstractRepository class to get the database connection
- Define your own methods depending of the actions your want to perform

### Harmonia - Controllers

All your controllers middlewares should be declared into the `app/controllers` folder, you'll define a controller file like `itemActions.js` who serve as a example here for each table of your database.

The objective of a controller is to manage a request from a client by calling on a model to communicate to the database and return a response adapted to the client, each controller will subsequently be associated with a route with an http method, depending on the type of actions we want to carry out.

```js
// Import access to database tables
const tables = require("../../database/tables");

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    // Fetch all items from the database
    const items = await tables.item.readAll();

    // Respond with the items in JSON format
    res.json(items);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    // Fetch a specific item from the database based on the provided ID
    const item = await tables.item.read(req.params.id);

    // If the item is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the item in JSON format
    if (item == null) {
      res.sendStatus(404);
    } else {
      res.json(item);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
// This operation is not yet implemented

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the item data from the request body
  const item = req.body;

  try {
    // Insert the item into the database
    const insertId = await tables.item.create(item);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted item
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
// This operation is not yet implemented

// Ready to export the controller functions
module.exports = {
  browse,
  read,
  // edit,
  add,
  // destroy,
};
```

### Harmonia - Routes

All the routes of your api is defined into the `app/routers/api` folder and allow you to define routes for each tables of your project, each route should define the http method used, the endpoint and should be linked a controller function to perform his action.

1/ `router.js`

Import all the routes previously defined for each of your tables by adding the corresponding endpoint

```js
const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Import And Use Routers Here
/* ************************************************************************* */

const itemsRouter = require("./items/router");

router.use("/items", itemsRouter);

/* ************************************************************************* */

module.exports = router;
```

- Import the Router from express
- Initalize a new router
- import all the routes previously defined for each of your tables by adding the corresponding endpoint
- Exports your router

This `router.js` file is imported in the `app/config.js` file to apply the routes to our server adding the `/api` endpoint.


2/ `items/router.js` 

This file act as a example and allow you to define routes for the corresponding table with the appropried http method (get, post, put, delete) and apply the corresponding controller function middleware to it

```js
const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import item-related actions
const { browse, read, add } = require("../../../controllers/itemActions");

// Route to get a list of items
router.get("/", browse);

// Route to get a specific item by ID
router.get("/:id", read);

// Route to add a new item
router.post("/", add);

/* ************************************************************************* */

module.exports = router;
```

# May the force be with you !

If you have made it this far, congratulations! You are now a Jedi of code and setting up APIs no longer holds any secrets for you.