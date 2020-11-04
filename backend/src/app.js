const express = require("express");
const passport = require("passport");
const logger = require ("morgan");
const index = require('./api/index');
const kanbanBoardRouter = require ('./api/kanbanBoard')
const authRouter = require("./api/auth")
const setup = require("./utility/passport");
const cors = require ('cors')
const app = express();

setup();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger("dev"));
app.use(passport.initialize());
app.use("/api", kanbanBoardRouter);
app.use("/api",authRouter);
app.use(index)

module.exports = app
