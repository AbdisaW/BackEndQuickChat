const { DataTypes } = require("sequelize");
const sequelize = require('@quickchat/database');

const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    status: {
        type: DataTypes.ENUM("PENDING", "ACTIVE", "OFFLINE", "ONLINE"),
        defaultValue: "PENDING"
    },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    tableName: "users",
    timestamps: true,


});

module.exports = User;
