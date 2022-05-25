const RefreshTokenSchema = (sequelize, Sequelize, User) => {
    const { DataTypes } = Sequelize
    const { INTEGER, STRING, DATE, TEXT, VIRTUAL } = DataTypes

    const RefreshToken = sequelize.define('token', {
        id: {
            type: INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        token: {
            type: TEXT,
        },
        expires: {
            type: DATE
        },
        createdByIP: {
            type: STRING,
        },
        revoked: {
            type: DATE
        },
        revokedByIP: {
            type: STRING,
        },
        replacedByToken: {
            type: TEXT
        },
        userId: {
            type: INTEGER,
        },
        isExpired: {
            type: VIRTUAL,
            get() {
              return Date.now() >= this.expires;
            }
          },
          isActive: {
          type: VIRTUAL,
            get() {
              return !this.revoked && !this.isExpired;
            }
          },
    });

    RefreshToken.belongsTo(User)

    return { RefreshToken }
}

module.exports = RefreshTokenSchema;