module.exports = (sequelize,DataTypes) =>{
    const Category = sequelize.define('category',{
        category_name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        uploadby:{
            type: DataTypes.STRING,
        }
        // image:{
        //     type:DataTypes.STRING,
        //     allowNull:false
        // }
    },{
        tableName:'categories'
    })
    return Category;
}