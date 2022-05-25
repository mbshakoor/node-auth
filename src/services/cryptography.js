const AES = require('crypto-js/aes');
const Utf8 = require('crypto-js/enc-utf8');
const crypto = require('crypto');
const appConfig = require('../config/env');
const { AUTH_SECRET_KEY } = appConfig;

const encrypt = async (text) => {
    const enc = AES.encrypt(text, AUTH_SECRET_KEY);
    return enc.toString()
}

const decrypt = (cypheredText) => {
    const bytes = AES.decrypt(cypheredText, AUTH_SECRET_KEY);
    return Utf8.stringify(bytes)
}

const randomBytes = () => crypto.randomBytes(40).toString('hex')

module.exports = {
    encrypt,
    decrypt,
    randomBytes
}