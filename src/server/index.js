
"use strict";

const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const session = require("express-session");
const mongoose = require("mongoose");
const envConfig = require("simple-env-config");

const env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";

/**********************************************************************************************************/

const setupServer = async () => {
  // Get the app config
  const conf = await envConfig("./config/config.json", env);
  const port = process.env.PORT ? process.env.PORT : conf.port;

  // Setup our Express pipeline
  let app = express();
  if (env !== "test") app.use(logger("dev"));
  app.engine("pug", require("pug").__express);
  app.set("views", __dirname);
  app.use(express.static(path.join(__dirname, "../../public")));
  app.use(logger('dev'));
  // Setup pipeline session support
  app.store = session({
    name: "session",
    secret: "michael123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/"
    }
  });
  app.use(app.store);
  // Finish with the body parser
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Connect to MongoDB
  try {
    // Dont want to see MongooseJS deprecation warnings
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true );
    await mongoose.connect(conf.mongodb);
    console.log(`MongoDB connected: ${conf.mongodb}`);
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }

  // Import our Data Models
  app.models = {
    Game: require("./models/game"),
    Move: require("./models/move"),
    User: require("./models/user"),
    Data: require("./models/data")
  };

  // Import our routes
  require("./api")(app);

  // Give them the SPA base page
  app.get("*", (req, res) => {
    const user = req.session.user;
    console.log(`Loading app for: ${user ? user.username : "nobody!"}`);
    let preloadedState = user
      ? {
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          primary_email: user.primary_email,
          city: user.city,
          games: user.games
        }
      : {};
    preloadedState = JSON.stringify(preloadedState).replace(/</g, "\\u003c");
    res.render("base.pug", {
      state: preloadedState
    });
  });

  /*
  When hosting on a domain with https, uncomment the https code and renew the certificate for your domain,
  then define the path for the certificate
  Login with github only works if you are hosting on a domain
   */

  // Run the server itself
  //Https options
  /*let server;
  const options = {
    key: fs.readFileSync(conf.security.keyPath),
    cert: fs.readFileSync(conf.security.certPath),
    ca: fs.readFileSync(conf.security.caPath)
  };
  server = https.createServer(options, app).listen(port, () => {
    console.log(`Listening on: ${server.address().port}`);
  });
  http.createServer((req, res) => {
    const location = `https://michaelsawchuk.com`;
    res.writeHead(302, { Location: location });
    res.end();
  })
      .listen(80, () => {
        console.log(`Listening on 80 for HTTPS redirect`);
      });*/
  let server = app.listen(port, () => {
    console.log("App listening on " + server.address().port);
  });
};

/**********************************************************************************************************/

// Run the server
setupServer();
