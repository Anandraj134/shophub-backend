module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // lastName: {
        //     type: DataTypes.STRING
        // },
        email: {
            type: DataTypes.STRING,
            allowNull: false,  // don't allow null values
        },
        phone: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        loginVia: {
            type: DataTypes.BOOLEAN
        },
        role: {
            type: DataTypes.ENUM("admin", "vandor","customer"),
            defaultValue: "customer"
        },
        canAccess:{
            type:DataTypes.JSON,
            defaultValue: {
                'canManageProducts':false,
                'canManageCategory':false,
                'canManageSubCategory':false,
                'canManageUsers':false,
                'canManageOrders':false,
            }   
        }

    }, {
        tableName: 'Users'
    })
    return User;
}