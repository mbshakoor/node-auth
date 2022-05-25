const db = require('../../library/db');
const cryptography = require('../../services/cryptography');
const {signJWT} = require('../../services/jwt');
const appConfig = require('../../config/env');
const messages = require('../../messages');
const {response} = require('express');
const otpGenerator = require('otp-generator');
const axios = require("axios");
const moment = require('moment');


const generateRefreshToken= async (user, ipAddress)=> {
    // create a refresh token that expires in 7 days
    const token = randomTokenString()
    let refreshToken= await db("refresh_token").insert({ user_id:user.user_id, token, expires:new Date(Date.now() + appConfig.REFRESH_TOKEN_EXPIRATION), created_by_IP:ipAddress === '::1' ? "127.0.0.1" : ipAddress }).returning("*")
    if (refreshToken) {
        refreshToken = refreshToken[0];
      }
    return refreshToken
}

function randomTokenString() {
    return cryptography.randomBytes();
}

const generateJwtToken = (data) => {
    return signJWT(data)
}

const authenticate = async ({ phone_number, password, ipAddress }) => {
    try {
        user = await db("users as u")
                        .innerJoin("roles as r", "r.id", "u.role_id")
                        .select(["u.*","r.name as role"])
                        .where({phone_number, 'u.is_deleted':'false' }).first()
    if (!user || (cryptography.decrypt(user.password) === password)) {
        const data = {
            userId: user.id,
            username: user.username,
            phone_number:user.phone_number,
            role: user.role
        }

        const token = generateJwtToken(data);
        const refreshToken = await generateRefreshToken(data, ipAddress);
        console.log('a');
        return {
            ...data,
            token,
            refreshToken: refreshToken.token
        }

    } else {
        throw {message:messages.CUSTOM_ERROR.INCORRECT_CREDENTIALS};
    }
    } catch (error) {
        throw error
    }

}

const createUser = async ({ body, ipAddress }) => {
  try {
    const { username, password, role_id, phone_number } = body;

    const encryptedPass = await cryptography.encrypt(password);

    let user = await db("users")
      .insert({ username, role_id, phone_number, password: encryptedPass })
      .returning("*");
    if (user.length) {
      user = user[0];
    }
    const data = {
      userId: user.id,
      username: user.username,
      role_id: user.role_id,
    };

    const token = generateJwtToken(data);
    const refreshToken = await generateRefreshToken(data, ipAddress);
    
    return {
      ...data,
      token,
      refreshToken: refreshToken.token,
    };
  } catch (error) {
    if (error.message.includes(messages.DEFAULT_ERROR.DUPLICATE_KEY)) {
      throw { message: messages.CUSTOM_ERROR.ALREADY_REGISTERED };
    }
  }
};

async function getRefreshToken(token) {
    const refreshToken = await db.RefreshToken.findOne({ token }, {
        include: {
            model: db.User
        }
    });
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

async function refreshToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);
    const { user } = refreshToken;

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(user, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // await db.RefreshToken.update({
    //     revoked: Date.now(),
    //     revokedByIp: ipAddress,
    //     replacedByToken: newRefreshToken,
    // }, {
    //     where: {
    //         token: refreshToken.token
    //     }
    // })

    // generate new jwt
    const jwtToken = generateJwtToken(user);

    // return basic details and tokens
    return { 
        ...user,
        token: jwtToken,
        refreshToken: newRefreshToken.token
    };
}

async function revokeToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);

    // revoke token and save
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}

const insertOtp = async (phone_number,otp) => {
    try {
        let insertedOtp = await db("mobile_verifications")
      .insert({ phone_number,otp })
      .returning("*");
    return insertedOtp;
    } catch (error) {
        throw { message: error.message }
    }
};

const sendMessage = async (mobile, code) => {
    try {
        const data = await axios.get(`https://pk.eocean.us/APIManagement/API/RequestAPI?user=99095_streamline&pwd=AI%2bsKoFF3f18aMnzldAXUgc5dsk8G8nG1lBz57ElXHFLtP9VMHegc3oIHmF%2fln%2bErg%3d%3d&sender=99095&reciever=${mobile}&msg-data=YOUR OTP IS ${code}&response=json`,{});
        return data
    } catch (error) {
      throw { message: "Couldn't send OTP, Please try again" }
    }
}

const verifyOtp = async (phone_number, otp) => {
  try {
    let Otp = await db("mobile_verifications")
      .select(["phone_number", "otp", "created_at","is_used"])
      .where({ is_deleted: false, phone_number })
      .orderBy("created_at", "desc")
      .first();
    const currentTime = moment().format();
    const expiryTime = moment(Otp.created_at).add(5, "minutes").format();
    if (Otp) {
      if (Otp.otp !== otp)
        throw { message: "Your OTP is invalid--401" };
      if (currentTime > expiryTime)
        throw { message: "Your OTP is expired--401" };
      if(Otp.is_used===true)
        throw { message: "You have already used this OTP--406" }
      const updatedOtp = await db("mobile_verifications")
      .update({ is_used:true })
      .where({phone_number,otp})
      .returning("*");
      return { message: "OTP is valid", valid: true, status: 200 };
    } else {
      throw { message: "OTP not found--404"};
    }
  } catch (error) {
    throw { message: error.message };
  }
};

const createSessions= async (body)=> {
    try {
        let session = await db("sessions")
      .insert(body)
      .returning("*");
      return session;
    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    authenticate,
    createUser,
    refreshToken,
    revokeToken,
    createSessions,
    insertOtp,
    sendMessage,
    verifyOtp
}
