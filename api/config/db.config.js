module.exports = {
    HOST: "localhost",
    USER: "super",
    PASSWORD: "cheerup2022",
    DB: "contacts",
    PORT: "4566",
    dialect: "mssql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
};