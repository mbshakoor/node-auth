const businessService = require('./businessService');
const appConfig = require('../../config/env');
const { response } = require('express');
const db = require('../../library/db');
const common = require('../../common');
const constants = require('../../constants');
const messages = require('../../messages');

const addBusiness = async (req, res, next) => {
    try {
      const { body } = req;
        const business = await businessService.addBusiness({body})
      res.status(200).json({ user, refreshToken });
    } catch (error) {
      console.log(error);
      res.status(409).json({ error: error.message });
    }
  };

  const searchBusiness = async (req, res, next) => {
    try {
        const business = await businessService.searchBusiness()
      res.status(200).json({ user, refreshToken });
    } catch (error) {
      console.log(error);
      res.status(409).json({ error: error.message });
    }
  };
  const searchBusinessByID = async (req, res, next) => {
    try {
      const { body } = req;
        const business = await businessService.searchBusinessByID(body)
      res.status(200).json({ user, refreshToken });
    } catch (error) {
      console.log(error);
      res.status(409).json({ error: error.message });
    }
  };


module.exports = {
    addBusiness,
    searchBusiness
}