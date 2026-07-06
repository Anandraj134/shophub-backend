module.exports = (sequelize, DataTypes) => {
    const StaffMember = sequelize.define('StaffMember',{
        // name,email,phone,password
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        phone:{
            type:DataTypes.STRING
        },
        password:{
            type:DataTypes.STRING
        }
    },{
        tableName: 'staffMembers'
    })
    return StaffMember;
}