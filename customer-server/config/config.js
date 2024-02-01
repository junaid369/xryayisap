require("dotenv").config();

module.exports = {
  //Live  DB
  DATABASE_NAME: "isapxray_db",
  CONNECTION_URL: "mongodb+srv://baqalath:bMP5OsI0znIqiYOl@cluster0.tbm8gxh.mongodb.net/isapxray_db?retryWrites=true&w=majority",
  PORT: 4001,
  USER_COLLECTION:"cln_user",
ADMIN_LOGIN_COLLECTION:"cln_login",
  JWT_SECRET: "xray1?%$$is%$",
};
