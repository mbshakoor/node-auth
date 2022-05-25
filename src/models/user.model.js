
const UserSchema = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize
  const { INTEGER, STRING } = DataTypes

  const User = sequelize.define('user', {
    id: {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: STRING
    },
    roleId: {
      type: INTEGER,
    }
  })

  const Role = sequelize.define('role', {
    id: {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: STRING,
      allowNull: false,
    }
  });

  // const UserRole = sequelize.define('user_role', {

  //   userId: {
  //     type: INTEGER,
  //     allowNull: false,
  //     primaryKey: true
  //   },
  //   roleId: {
  //     type: INTEGER,
  //     allowNull: false,
  //     primaryKey: true
  //   }
  // });

  // User.belongsToMany(Role, { through: UserRole, as: "role" })

  User.belongsTo(Role)
  return { User, Role }

}

module.exports = UserSchema;