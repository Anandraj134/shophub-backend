module.exports = (sequelize,DataTypes) =>{
    const contact = sequelize.define("contact", {
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false
        },
        subject:{
            type: DataTypes.STRING,
            allowNull: false
        },
        message:{
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    return contact;
}