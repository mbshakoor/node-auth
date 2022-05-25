const express = require('express');
const Joi = require('joi');
const validateRequest = require('../../middlewares/validate-request');
const authorize = require('../../middlewares/authorize');
const {checkToken} = require('../../services/jwt');
const authRouter = express.Router();

const { authenticate, signup, refreshToken, revokeToken, sendOTP, verifyOtp } = require('../../routes/auth/authController');

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        phone_number: Joi.string().required(),
        password: Joi.string().required(),
        location: Joi.required(),
        device_id: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

/* Post Login 
    * Method: POST
*/
authRouter.post('/login',authenticateSchema, authenticate)

/* Post User 
    * Method: POST
*/
// authRouter.post('/user',checkToken, authorize('admin'), createUser)
authRouter.post('/signup', signup)

/* Post Refresh Token 
    * Method: POST
*/
authRouter.post('/sendOtp',sendOTP)

authRouter.get('/verify-otp/:phone_number/:otp',verifyOtp)

authRouter.post('/refresh-token', refreshToken)

authRouter.post('/revoke-token', checkToken, authorize(), revokeTokenSchema, revokeToken);

function revokeTokenSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}
module.exports =authRouter;