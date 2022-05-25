const express = require('express');
const Joi = require('joi');
const validateRequest = require('../../middlewares/validate-request');
const businessRouter = express.Router();

const { addBusiness, searchBusiness } = require('../../routes/business/businessController');

// function authenticateSchema(req, res, next) {
//     const schema = Joi.object({
//         name: Joi.string().required(),
//         category: Joi.string().required(),
//         contact: Joi.string().required(),
//         email: Joi.string().required(),
//         address: Joi.string().required(),
//         check_in: Joi.string().required(),
//         check_out: Joi.string().required(),
//     });
//     validateRequest(req, next, schema);
// }

businessRouter.post('/add', addBusiness)
businessRouter.get('/search', searchBusiness)

module.exports =businessRouter;
