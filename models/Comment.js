const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}
Comment.init(
    {
        // id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     primaryKey: true,
        //     autoIncrement: true,
        // },
        body: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // },        userId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {
        //         model: 'user',
        //         key: 'id',
        //     },
        // },
        // postId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {
        //         model: 'post',
        //         key: 'id',
        //     },

    },
    {
        sequelize,
        freezeTableName: true,
        modelName: 'comment',
    }
);

module.exports = Comment;