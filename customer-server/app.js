let express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config"); // importing config file
const cron = require("node-cron");
const bcrypt = require("bcrypt");
let common = require("./global/common");

require("dotenv").config();
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
//scema fetch

//end

let app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, GET, POST, DELETE, HEAD, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//app.use(fileUpload()); / Parsers
app.use(logger("dev"));
app.use(express.json({ limit: "200mb" }));
app.use(
  express.urlencoded({
    limit: "200mb",
    extended: true,
    parameterLimit: 50000000000,
  })
);

app.use(cors());
let originsWhitelist = [
  //this is my front-end url for development

  "http://localhost:4200",
];

let corsOptions = {
  origin: function (origin, callback) {
    let isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true,
};
//here is the cors magic
app.use(cors(corsOptions));

async function run() {
  try {
    mongoose.connect(config.CONNECTION_URL, {
      //  dbName: config.DATABASE_NAME, // Specify the database name here
      // Other options can be added here based on your requirements
    });
    const db = mongoose.connection;

    db.on("error", console.error.bind("MongoDB connection error:"));
    db.once("open", () => {
      //end
      console.log("Connected to MongoDB");
      require("./routes")(app, db);
      app.use(express.static(path.join(__dirname, "dist")));
      // Catch all other routes and return the index file
      app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "dist/index.html"));
      });
      // Initialize the app
      let server = app.listen(process.env.PORT || 3001, function () {
        let port = server.address().port;
        console.log("App now running on http://localhost", +port);
      });
    });
  } catch (error) {
    console.error("Error connecting to Oracle:", error);
  }
}
run();
