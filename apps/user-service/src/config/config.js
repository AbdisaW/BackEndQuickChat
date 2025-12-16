// src/config/config.js
module.exports = {
  development: {
    username: "root",
    password: "password",
    database: "quick_chat",
    host:  "mysql",
    port: 3306,
    dialect: "mysql",
    logging: false
  },
  test: {
    username: "root",
    password: "password",
    database: "quick_chat_test",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false
  },
  production: {
    username: "root",
    password: "password",
    database: "quick_chat",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false
  }
};
