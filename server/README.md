# MOVIE BOOKING APP - Backend

add json config files in config folder.

- yarn install
- yarn test
- yarn server

### development.json

```
{
  "server": {
    "port": 5000,
    "host": "localhost",
    "BASE_URL": "http://localhost:5000",
    "BASE_FRONT_URL": "http://localhost:3000"
  },
  "db": {
    "port": 27017,
    "host": "127.0.0.1",
    "username": "tarun",
    "password": "password",
    "name": "movie-booking"
  },
  "auth": {
    "JWT_SECRET": "RAMRAM",
    "JWT_ADMIN_SECRET": "RAMRAMRAM",
    "EMAIL_ID": "************@gmail.com",
    "PSWD": "************"
  }
}
```

### test.json

```
{
  "server": {
    "port": 5001,
    "host": "localhost",
    "BASE_URL": "https://localhost:5001",
    "BASE_FRONT_URL": "https://localhost:3000"
  },
  "db": {
    "port": 27017,
    "host": "127.0.0.1",
    "username": "tarun",
    "password": "password",
    "name": "movie-booking-test"
  },
  "auth": {
    "JWT_SECRET": "RAMRAM",
    "JWT_ADMIN_SECRET": "RAMRAMRAM",
    "EMAIL_ID": "************@gmail.com",
    "PSWD": "**************"
  }
}
```
