
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/***************** Data Model *******************/

let Data = new Schema(
    {
        username: { type: String, required: true, index: { unique: true } },
        eventId: { type: Number, default: 0 },
        value1: { type: Number, default: 0 },
        value2: { type: Number, default: 0 },
        value3: { type: Number, default: 0 }
    },
);

module.exports = mongoose.model("Data", Data);