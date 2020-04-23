
"use strict";

let Joi = require("@hapi/joi");
const fetch = require("node-fetch");
let dotenv = require('dotenv');
dotenv.config();
var request = require('request');

const validateToken = async (token) => {
  let retVal = false;
  await fetch('https://api.github.com/user', {
    method: "GET",
    headers: {
      "Authorization": "token " + token
    }
  }).then(response => {
    if (response.status === 200) {
      retVal = true;
    }
  });
  return retVal;
};

module.exports = app => {
  /**
   * Log a user in
   *
   * @param {req.body.username} Username of user trying to log in
   * @param {req.body.password} Password of user trying to log in
   * @return { 200, {username, primary_email} }
   */
  app.post("/v1/session", async (req, res) => {
    // Validate incoming request has username and password, if not return 400:'username and password are required'
    let schema = Joi.object({
      username: Joi.string()
        .lowercase()
        .required(),
      password: Joi.string().required()
    });
    try {
      let data = await schema.validateAsync(req.body, { stripUnknown: true });
      // Search database for user
      let user = await app.models.User.findOne({ username: data.username });
      if (!user) res.status(401).send({ error: "unauthorized" });
      // If found, compare hashed passwords
      else if (user.authenticate(data.password)) {
        // Regenerate session when signing in to prevent fixation
        req.session.regenerate(() => {
          req.session.user = user;
          console.log(`Session.login success: ${req.session.user.username}`);
          // If a match, return 201:{ username, primary_email }
          res.status(200).send({
            username: user.username,
            primary_email: user.primary_email
          });
        });
      } else {
        res.status(401).send({ error: "unauthorized" });
      }
    } catch (err) {
      console.log(err);
      const message = err.details[0].message;
      console.log(`Session.login validation failure: ${message}`);
      res.status(400).send({ error: message });
    }
  });

  /**
   * Log a user out
   *
   * @return { 204 if was logged in, 200 if no user in session }
   */
  app.delete("/v1/session", (req, res) => {
    if (req.session.user) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(200).end();
    }
  });

  app.post("/v1/github/:code", async (req, res) => {
    let code = req.params.code;
    request({
      method: 'POST',
      url: 'https://github.com/login/oauth/access_token',
      json: true,
      body: {
        client_id: 'Iv1.14af91395975e449',
        client_secret: process.env.client_secret,
        code: code,
      }
    }, function (error, response, body) {
      if(error){
        return res.sendStatus(500);
      } else {
        let token = body.access_token;
        return res.status(200).send({ token: token });
      }
    });
  });

  app.post("/v1/githubLogin", async (req, res) => {
    let schema = Joi.object({
      username: Joi.string()
          .lowercase()
          .required(),
      token: Joi.string().required()
    });
    try {
      let data = await schema.validateAsync(req.body, { stripUnknown: true });
      // Search database for user
      let user = await app.models.User.findOne({ username: data.username });
      if (!user) res.status(401).send({ error: "unauthorized" });
      else if (await validateToken(req.body.token)) {
        // Regenerate session when signing in to prevent fixation
        req.session.regenerate(() => {
          req.session.user = user;
          console.log(`Session.login success: ${req.session.user.username}`);
          // If a match, return 201:{ username, primary_email }
          res.status(200).send({
            username: user.username,
            primary_email: user.primary_email
          });
        });
      } else {
        res.status(401).send({ error: "unauthorized" });
      }
    } catch (err) {
      console.log(err);
      const message = err.details[0].message;
      console.log(`Session.login validation failure: ${message}`);
      res.status(400).send({ error: message });
    }
  })
};
