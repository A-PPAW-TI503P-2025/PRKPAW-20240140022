const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Presensi = sequelize.define('Presensi', {
        id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        checkIn: { 
            type: DataTypes.DATE, 
            allowNull: true, 
        },
        checkOut: { 
            type: DataTypes.DATE, 
            allowNull: true, 
        },
        latitude: {
            type: DataTypes.DECIMAL(15,8),
            allowNull: true, 
        },
        longitude: {
            type: DataTypes.DECIMAL(15,8),
            allowNull: true, 
        },
    }, {
        tableName: 'presensis',
        freezeTableName: true,
    });

    Presensi.associate = function(models) {
        Presensi.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
            onDelete: 'CASCADE',
        });
    };

    return Presensi;
};