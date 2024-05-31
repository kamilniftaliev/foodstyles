# FoodStyles

You can type in the terminal in order to run the search with `extractEntities` function.

### Screenshots

Coming...

### Setup

1. Install `PosgresSQL` and create a database with some username and password;
2. Add those credentials to the `.env` file. Copy-paste the `.env.example` file;
3. Run `yarn migrate` - to create the "Entities" table;
4. Run `yarn seed` - to fill the "Entities" table with some data from json files;
5. Run `yarn` - to install all the dependencies;
6. Run `yarn dev` - to run the app

### More details

Reason why I kept all types of entities in the same "entities" table is because they all have same structure and it's a lot easier and faster to select everything that matches a given keyword.
