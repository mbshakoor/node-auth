const jwt = require('jsonwebtoken');
const appConfig = require('../config/env');
const db = require('../../knexfile');

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        async (req, res, next) => {
            const { data } = jwt.verify(req.token, appConfig.JWT_SECRET_KET);
            const userId = Object.keys(req.body).length > 0 ? req.body.userId : req.params.userId;
            if (!roles.includes(data.role.name)) {
                if (data.userId !== Number(userId)) {
                    return res.status(401).json({ message: 'Unauthorized 00' });
                }
            }
            req.user = data;
            next()
        },

        // authorize based on user role
        async (req, res, next) => {
            const user = await db.User.findOne({where: {id: req.user.userId }, include: [db.Role]});

            if (!user || (roles.length && !roles.includes(user.role.name))) {
                // user no longer exists or role not authorized
                return res.status(401).json({ message: 'Unauthorized access' });
            }

            // authentication and authorization successful
            req.user.role = user.role.name;
            const refreshTokens = await db.RefreshToken.findAll({ userId: user.id });
            req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
            next();
        }
    ];
}