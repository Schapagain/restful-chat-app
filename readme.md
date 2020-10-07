

## \# Localhost Server Configuration Steps

1. Clone repository into local machine
2. Start PostgreSQL server and add ```users``` and ```login``` tables.<br> Command line     steps:
  ```
  psql -U {PGUSER}
  (enter {PGPASSWORD} if prompted)

  CREATE DATABASE {PGDATABASE};

  \l                  (to view all databases in the server)
  \c {PGDATABASE};    (switch to the newly created database)

  CREATE TABLE users(username text, firstname text, lastname text);

  \d+ users;          (to view the table created with their columns)

  CREATE TABLE login(username text, lastname text);
                      (\d to view all created tables)
  ```
3. Create a .env file inside repo directory and setup the following environment variables (default):
  ```
  PGUSER=(process.env.USER)
  PGHOST=('localhost')
  PGPORT=(5432)
  PGDATABASE=(process.env.USER)
  PGPASSWORD=(null)
  ```
3. 

4. Install dependencies listed in package.json. <br/> (Running the following command while on the root repo directory will automatically install all dependencies.)
  ```
  npm install
  ```

5. Start the development server
  ```
  npm run devStart
  ```

6. You're ready to send http requests

## \# Usage via HTTP

1. Add users

  * **Endpoint**: /register
  * **Method**: POST
  * **Payload**: { username (unique),password }
  * **Return**: { message, result { username} }
  * Example:  `[POST] /register`