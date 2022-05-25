const authService = require('./authService');
const appConfig = require('../../config/env');
const Role = require('../../utils/role');
const { response } = require('express');
const db = require('../../library/db');
const otpGenerator = require('otp-generator');
const common = require('../../common');
const constants = require('../../constants');
const messages = require('../../messages');

async function setTokenCookie(res, token) {
  // create http only cookie with refresh token that expires in 7 days
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + appConfig.REFRESH_TOKEN_EXPIRATION),
  };
  res.cookie(constants.REFRESH_TOKEN, token, cookieOptions);
}

const authenticate = async (req, res, next) => {
  try {
    const { body:{phone_number, password,location,device_id},device:{type:device_type}, ip } = req;

    const { refreshToken, ...user } = await authService.authenticate({
      phone_number,
      password,
      ipAddress: ip,
    });
    const {token,userId:user_id}=user
    const {session:{cookie},sessionID} = req;
    res.cookie('session cookie',sessionID,cookie)
    await setTokenCookie(res, refreshToken);
    const sessionBody = {session_id:sessionID,device_id,token,device_type,location,user_id,refresh_token:refreshToken}
    const session= await authService.createSessions(sessionBody)
    res.status(200).json({ user, refreshToken });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

// const test = async (req, res, next) => {
//   try {
//     const device=req.device.type
//     const s = req.session;
//     res.cookie('mycookie',s.id,s.cookie)
//     res.status(200).json({message:"login Succesfull"});
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({ error: error.message });
//   }
// };

const sendOTP = async (req, res) => {
  try {
    const { phone_number } = req.body;
    const phone_number_without_plus = await common.removePlusSign(phone_number);
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });

    const insertOtp = db.transaction((trx) => {
      const otpPromise = authService.insertOtp(phone_number, otp);
      const message = authService.sendMessage(phone_number_without_plus, otp);
      const a = Promise.all([otpPromise, message])
        .then(trx=>{
            trx.commit
            res.status(200).json({message:messages.AUTH_MESSAGES.OTP_SUCCESSFUL});
        })
        .catch(error=>{
          // error.rollback
          console.log(error.message)
          res.status(401).json({error:error.message})
        });
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

const verifyOtp = async (req, res) => {
    try {
      let { phone_number,otp } = req.params;
    //   phone_number = await common.removePlusSign(phone_number)
      const verification = await authService.verifyOtp(phone_number,otp);
      res.status(200).json(verification);
    } catch (error) {
    const errorArray=error.message.split('--')
    const message= errorArray[0]
    const status= errorArray[1]
      console.log(error);
      res.status(status).json({ error:message });
    }
  };

// const test2 = async (req, res, next) => {
//     try {
//       req.session.destroy();
//       res.status(200).send("logout");
//     } catch (error) {
//       console.log(error);
//       res.status(401).json({ error: error.message });
//     }
//   };

  // const test3 = async (req, res, next) => {
  //   try {
  //     res.status(200).send("in session");
  //   } catch (error) {
  //     console.log(error);
  //     res.status(401).json({ error: error.message });
  //   }
  // };

const signup = async (req, res, next) => {
  try {
    const { body, ip } = req;

    const { refreshToken, ...user } = await authService.createUser({
      body,
      ipAddress: ip,
    });
    await setTokenCookie(res, refreshToken);
    res.status(200).json({ user, refreshToken });
  } catch (error) {
    console.log(error);
    res.status(409).json({ error: error.message });
  }
};

const refreshToken = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  const ipAddress = req.ip;
  authService
    .refreshToken({ token, ipAddress })
    .then(({ refreshToken, ...user }) => {
      setTokenCookie(res, refreshToken);
      res.json(user);
    })
    .catch(next);
};

function revokeToken(req, res, next) {
    // accept token from request body or cookie
    const token = req.body.token || req.cookies.refreshToken;
    const ipAddress = req.ip;

    if (!token) return res.status(400).json({ message: 'Token is required' });

    // users can revoke their own tokens and admins can revoke any tokens
    if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    authService.revokeToken({ token, ipAddress })
        .then(() => res.json({ message: 'Token revoked' }))
        .catch(next);
}


module.exports = {
    authenticate,
    signup,
    refreshToken,
    revokeToken,
    // test,
    // test2,
    // test3,
    sendOTP,
    verifyOtp
}