# Setting up an API with Monorepo

## Getting started

- Create a new Monorepo project : `npm create @this-is-to-learn/js-monorepo@latest workshop-monorepo`.
- Run `cd workshop-monorepo`.
- Run `npm install`.
- Setup your .env file in the `server` folder with your database crédentials.
- Copy and paste the content of the `dump.sql` file from the previous workshop into the `server/database/schema.sql` file and run the command `npm run db:migrate` to synchronize your database.
- Run `npm run dev:server` to start your api.

### Project architecture

Diagram allowing you to visualize the architecture of the server folder, certain parts have been deliberately omitted in this diagram to concentrate on the essentials

```sh
server
├── src # main folder of your api, contain all the logic of your api (routes, actions, repositories, middlewares)
│   │
│   ├── modules # folder who contain all the logics (actions, repositories) for each tables you gonna manipulate
│   ├── app.ts # app config : setup api routes & middlewares (main endpoint: /api, data-parsing, errorHandling)
│   ├── main.ts # file who contain import of your app config and run your api
│   ├── router.ts # file who contain all the routes of your API for each modules
│   │
├── bin # folder who contain some utility script for your app (database migration and seed)
│   │
│   ├── migrate.ts # script who help you to synchronize your database schema using the `schema.sql` file
│   ├── seed.ts # script who help you to insert some data for your test in your database using the fixture files located in `database/fixtures` folder
│   │
├── database # folder which contains everything that refers to the database (schema, fixtures, models, connection) 
│   │
│   ├── fixtures # folder who contain your seeder class who help you to insert test data in your database using the `seed.js` script located in the `bin` folder
│   ├── client.ts # setup database connection
│   ├── schema.sql # file who contain all the tables définition of your database, its used by the `migrate.js` script to synchronise your database structure
```


## Your mission

Take the code from the first steps of this workshop and implement it within harmonia, you can do it!

be careful no automated test is set up, use Postman to test the correct functioning of your different routes
{:.alert-warning}

[Postman get started](https://learning.postman.com/docs/getting-started/first-steps/sending-the-first-request/)


## Guideline

### Monorepo - Configuration

Nothing to do there all the configuration is already made :

- `src/app.ts` contain the configuration of the server express (main route & middlewares)
- `database/client.ts` Initialize a connection to a database using the env variables defined in `server/.env` file.

### Monorepo - Repositories

All the repository are located in the `server/src/modules` folder, each repository should be declared in a folder named as the corresponding table : 

You can use this example to define your repository classes for each of the tables in your project and delete it once done.

```js
import db from "../../../database/client";
import type { Result, Rows } from "../../../database/client";
import type { Potion } from "../../types/express";

const selectAll = async () => {
	return await db.query<Rows>("SELECT * FROM potion");
}

const selectOne = async (id: number) => {
	return await db.query<Rows>("SELECT * FROM potion WHERE id = ?", [id]);
}

const insertOne = async (potion: Potion) => {
	const { name } = potion;
	return await db.query<Result>("INSERT INTO potion (name) VALUES (?)", [name]);
}

const updateOne = async (potion: Potion, id: number) => {
	return await db.query<Result>("UPDATE potion set ? WHERE id = ?", [potion, id]);
}

const deleteOne = async (id: number) => {
	return await db.query<Result>("DELETE FROM potion WHERE id = ?", [id]);
}

export default { selectAll, selectOne, insertOne, updateOne, deleteOne };
```

- Import the database client connection
- Define your own methods depending of the actions your want to perform

### Monorepo - Actions

All your controllers middlewares should be declared into the `src/modules` folder, you'll define a controller file like `potionActions.ts` who serve as a example here for each table of your database.

The objective of a controller is to manage a request from a client by calling on a repository to communicate to the database and return a response adapted to the client, each controller will subsequently be associated with a route with an http method, depending on the type of actions we want to carry out.

```js
import type { RequestHandler } from "express";
import potionRepository from "./repository";

const getAll : RequestHandler = async (req, res) => {
	const [potions] = await potionRepository.selectAll();
	res.json(potions);
}

const getOne : RequestHandler = async (req, res) => {
	const id = Number(req.params.id);
	const [[potion]] = await potionRepository.selectOne(id);
	res.json(potion);
}

const post : RequestHandler = async (req, res) => {
	const potion = req.body;
	const [result] = await potionRepository.insertOne(potion);
	res.status(201).json(result.insertId);
}

const put : RequestHandler = async (req, res) => {
	const potion = req.body;
	const id = Number(req.params.id);
	const [result] = await potionRepository.updateOne(potion, id);
	result.affectedRows ? res.sendStatus(204) : res.sendStatus(404); 
}

const deleteOne : RequestHandler = async (req, res) => {
	const id = Number(req.params.id);
	const [result] = await potionRepository.deleteOne(id);
	result.affectedRows ? res.sendStatus(204) : res.sendStatus(404); 
}

export default { getAll, getOne, post, put, deleteOne };
```


### Monorepo - Routes

All the routes of your api is defined into the `src/router.ts` files and allow you to define routes for each tables of your project, each route should define the http method used, the endpoint and should be linked a controller function to perform his action.

1/ `router.ts`

Import all the routes previously defined for each of your tables by adding the corresponding endpoint

```js
import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

import potionAction from "./modules/potion/actions";

router.get("/potions", potionAction.getAll);
router.get("/potions/:id", potionAction.getOne);
router.post("/potions", potionAction.post);
router.put("/potions", potionAction.put);
router.delete("/potions", potionAction.deleteOne);

/* ************************************************************************* */

export default router;
```

- Import the Router from express
- Initalize a new router
- import all the routes previously defined for each of your tables by adding the corresponding endpoint
- Exports your router

This `router.js` file is imported in the `src/app.ts` file to apply the routes to our server adding the `/api` endpoint.

# May the force be with you !

If you have made it this far, congratulations! You are now a Jedi of code and setting up APIs no longer holds any secrets for you.
