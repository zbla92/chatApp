"use strict";
const bcrypt = require("bcrypt");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.RefreshToken, {
        as: "refreshToken",
        foreignKey: "userId",
        onDelete: "cascade",
      });
    }
  }

  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      profilePicture: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.prototype.validPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  User.beforeSave(async (user, options) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(5);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  return User;
};
