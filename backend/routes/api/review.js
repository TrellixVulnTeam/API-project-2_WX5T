const express = require("express");
const { handleValidationErrors } = require('../../utils/validation');
const { Sequelize, Model, DataTypes } = require("sequelize");
// const sequelize = new Sequelize("sqlite::memory:");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const {sequelize} = require("../../db/models")
const { Spots, Review, User, Image, Booking } = require("../../db/models");
// const spots = require('../../db/models/spots')
const router = express.Router();















module.exports = router;
