

## \# Localhost Server Configuration Steps

1. Clone repository into local machine
2. Start PostgreSQL server and add ```users``` and ```login``` tables.<br> Command line     steps:
  ```
  psql -U {PGUSER}
  (enter {PGPASSWORD} if prompted)

  CREATE DATABASE {PGDATABASE};

  \l                  (to view all databases in the server)
  \c {PGDATABASE};    (switch to the newly created database)

  CREATE TABLE users(username text, firstname text, lastname text, cellnumber text);

  \d+ users;          (to view the table created with their columns)

  CREATE TABLE login(username text, password text);
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

4. Install dependencies listed in package.json. <br/> (Running the following command while on the root repo directory will automatically install all dependencies.)
  ```
  npm install
  ```
5. Create ```uploads``` folder in the root directory to hold user images

5. Start the development server
  ```
  npm run devStart
  ```

6. You're ready to send http requests

## \# Usage via HTTP

** Authorization via token in http header required for access.
> Login as a valid user to get a token (User Handling #2 below)

### User Handling
1. Register users

  * **Endpoint**: /register
  * **Method**: POST
  * **Payload**: { username (unique),password }
  * **Return**: { success , username } 
  * **Example**:  `[POST] /register`

2. Login users

  * **Endpoint**: /login
  * **Method**: POST
  * **Payload**: { username ,password }
  * **Return**: { success , token }
  * **Example**:  `[POST] /login`


3. Get all users

  * **Endpoint**: /users
  * **Method**: GET
  * **Return**: { success , users [ { firstname, lastname, cellnumber, username } ] }
  * **Example**:  `[GET] /users`

4. Get user by username

  * **Endpoint**: /users
  * **Method**: GET
  * **URL param**: username
  * **Return**: { success , user { firstname, lastname, cellnumber, username } }
  * **Example**:  `[GET] /users/bob123`

 5. Update user info

  * **Endpoint**: /users
  * **Method**: PATCH
  * **URL param**: username
  * **Payload**: { firstname, lastname, cellnumber, profilepicture }
  * **Return**: { success , user { firstname, lastname, cellnumber, username, profilepicture } }
  * **Example**:  `[PATCH] /users/bob123` 
  * **Note**: Any number of key:value pairs can be passed

6. Remove user

  * **Endpoint**: /users
  * **Method**: DELETE
  * **URL param**: username
  * **Return**: { success , user { firstname, lastname, cellnumber, username } }
  * **Example**:  `[DELETE] /users/bob123`

### Chat handling
1. Get all chats
  * **Endpoint**: /chats
  * **Method**: GET
  * **Return**: { success , chats [ { sender, message, receiver } ] }
  * **Example**:  `[GET] /chats`

2. Add chat
  * **Endpoint**: /chats
  * **Method**: POST
  * **Payload**: { sender, message, receiver }
  * **Return**: { success , chat { sender, message, receiver } }
  * **Example**:  `[POST] /chats`


3. Get chat by username
  * **Endpoint**: /chats
  * **Method**: GET
  * **URL param**: username
  * **Return**: { success , chats { sent [{sender, message,receiver}], received [{sender, message,receiver}] } }
  * **Example**:  `[GET] /chats/marty123`

4. Delete chat by username

  * **Endpoint**: /chats
  * **Method**: DELETE
  * **URL param**: username
  * **Return**: { success , chats { sent [{sender, message,receiver}], received [{sender, message,receiver}] } }
  * **Example**:  `[DELETE] /chats/marty123`
  * **Note**: This request deletes messages both sent and received by the user


## \# Usage via Sockets
### User Handling
1. Register users

  * **Emit**: register
  * **Payload**: { username (unique),password }
  * **Listen for**: register-response
  * **Return**: { success, username }
  * **Example**: 
  ```js
  const handleRegistration = user => {
    socket.emit('registration',user);
  }

  socket.on('registration-response', result => {
      // do something
  });
  ```

2. Login users

  * **Emit**: login
  * **Payload**: { username ,password }
  * **Listen for**: login-success/failure
  * **Return**: { success , token }
  * **Example**: 
  ```js
  const handleLogin = user => {
    socket.emit('login',user);
  }

  socket.on('login-response', result => {
      // do something
  })
  ```

3. Get user by username

  * **Emit**: get-user
  * **Payload**: { userToken }
  * **Listen for**: get-user-response
  * **Return**: { success , { user } }
  * **Example**: 
  ```js
  const getUserProfile = userToken => {
      socket.emit('get-user', userToken);
  };

  socket.on('get-user-response', user => {
      // do something
  })
  ```