module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        email: {
            type: DataTypes.STRING(40),
            allowNull: true,
            unique: false
        },
        nickname: {
            type: DataTypes.STRING(25),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(15),
            allowNull: true
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        provider: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local'
        },
        snsId: {
            type: DataTypes.STRING(30),
            allowNull: true
        }
    }, {
        timestamps: true,
        paranoid: true
    })
);