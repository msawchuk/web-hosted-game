
"use strict";

const should = require("should");
const assert = require("assert");
const request = require("superagent");
const harness = require("./harness");
const data = require("./data");
let config = {};
let users = data.users;
let games = data.games;
const envConfig = require("simple-env-config");
const env = process.env.NODE_ENV ? process.env.NODE_ENV : "test";

/**************************************************************************/

describe("Game:", () => {

});
