module.exports = (sequelize,DataTypes) =>{
    const SubCategory = sequelize.define('subcategory',{
        category_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{ 
                model:"categories",
                key:"id"
            }
        },
        subcategory_name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        uploadby:{
            type: DataTypes.STRING,
        }
    },{
        tableName:'subcategory'
    })
    return SubCategory;
}