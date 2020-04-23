
"use strict";
let Joi = require("@hapi/joi");

module.exports = app => {

  app.post("/info/:username", async (req, res) => {
    let user = await app.models.User.findOne({
      username: req.params.username.toLowerCase()
    });
    if (user && user.value1) {
      res.status(400).send({error: `user: ${req.params.username} already has gameplay info`});
    }
    let defaultInfo = {
      username: req.params.username.toLowerCase(),
      eventId: 0,
      value1: 0,
      value2: 0,
      value3: 0
    };
    let info = new app.models.Data(defaultInfo);
    try {
      await info.save();
      res.status(201).end();
    } catch (err) {
      res.status(400).send({error: `unable to save default info for user ${req.params.username}`});
    }
  });

  app.get("/info/:username", async (req, res) => {
    let data = await app.models.Data.findOne({
      username: req.params.username.toLowerCase()
    });
    if (!data) {
      res.status(404).send({error: `unknown user: ${req.params.username}`});
    } else {
      res.status(200).send({
        username: data.username,
        eventId: data.eventId,
        value1: data.value1,
        value2: data.value2,
        value3: data.value3 //todo name the values to correspond with events
      });
    }
  });

  app.put("/info/:username", async (req, res) => {
    const query = {username: req.session.user.username};
    try {
      req.session.user = await app.models.User.findOneAndUpdate(
          query,
          {$set: req.body},
          {new: true}
      );
      res.status(204).end();
    } catch (err) {
      res.status(500).send({error: `user: ${req.params.username} not found`});
    }
  });

  //todo switch to redis storage for a variety of events
  app.get("/event/:id", async (req, res) => {
    res.status(200).send({
      eventId: 0,
      backgroundImage: "nystreet",
      characterImages: [
        {path: "man", leftPos: 150, topPos: 200, size: 500, width: 350, height: 500},
        {path: "woman", leftPos: 650, topPos: 255, size: 300, width: 150, height: 300}],
      dialogue: [{
        text: "Good evening, your legs are looking nice",
        leftPos: 320,
        topPos: 250,
        boxWidth: 150,
        boxHeight: 50
      },
        {
          text: "Thank",
          leftPos: 610,
          topPos: 275,
          boxWidth: 50,
          boxHeight: 25
        }],
      nextEvent: 1
    });
  });
}