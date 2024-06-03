# Setting up an API with express & Harmonia

## Introduction

### Foreword :bookmark:

The objective of this workshop is firstly to review the implementation and configuration of an API and a complete CRUD with the ExpressJS micro-framework, then secondly to adapt our first implementation to Harmonia.

As you will have understood, the objective is above all to see each step of creating an API with nodejs independently of the architecture and framework used.

### Getting started :rocket:

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

### Project architecture :technologist:

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

### Automated tests :test_tube:

This workshop comes with integration tests on most of the routes, you can execute them to test your code using the following command : `npm test`

![testgif](./assets/tests.gif)

- :loud_sound: GET `/api/tracks`
- :loud_sound: GET `/api/tracks/1`
- :loud_sound: POST `/api/tracks`
- :loud_sound: PUT `/api/tracks`
- :loud_sound: DELETE `/api/tracks`
- :headphones: GET `/api/albums`
- :headphones: GET `/api/albums/1`
- :headphones: GET `/api/albums/1/tracks`
- :headphones: POST `/api/albums`
- :headphones: PUT `/api/albums`
- :headphones: DELETE `/api/albums`

The test result helps you know what return is expected for each route, the errors returned can help you debug your code more easily.
{:.alert-info}

### Rules :warning:

- :white_check_mark: Response bodies should be JSON.
- :white_check_mark: Request bodies should be JSON.
- :white_check_mark: `PUT` and `DELETE` request should return `204 no content`.
- :white_check_mark: `POST` request should return `201 created` with the associated created resource.

### Your mission :dart:

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


