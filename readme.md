

## \# Localhost Server Configuration Steps

1. Clone repository into local machine
2. Start PostgreSQL server
3. Create a .env file inside repo directory and setup the following environment variables (default):
  ```
  PGUSER=(process.env.USER)
  PGHOST=('localhost')
  PGPORT=(5432)
  PGDATABASE=(process.env.USER)
  PGPASSWORD=(null)
  ```
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