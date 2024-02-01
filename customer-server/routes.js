module.exports = function (app, db) {
  require("./controlller/user")(app, db);
};
