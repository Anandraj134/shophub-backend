const {Sequelize,DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    'e_commerce',
    'root',
    '12345678',
    {
        host:'localhost',
        logging: false, //false if you want to disable printing log
        dialect: "mysql"  //use mysql for production
    });
// --------------------------------------------------------
// const sequelize = new Sequelize(
//     'if0_36434267_e_commerce',
//     'if0_36434267',
//     'Infinity@4008',
//     {
//         host:'sql308.epizy.com',
//         logging: true, //false if you want to disable printing log
//         dialect: "mysql",  //use mysql for production
//         port:5001
//     });

try {
    sequelize.authenticate({alter:true});
    console.log("Connection has been established successfully.");
} catch (error) {
    console.error("Unable to connect to the database:", error);
}

const db = {};
db.Sequelize=Sequelize;
db.sequelize=sequelize;

//Model
db.user = require('../Model/signup')(sequelize,DataTypes);
db.staffMember = require('../Model/staffMember')(sequelize,DataTypes);
db.category = require('../Model/category')(sequelize,DataTypes);
db.customerOrder = require('../Model/customerOrder')(sequelize, DataTypes);
db.product = require('../Model/product')(sequelize, DataTypes);
db.faq = require('../Model/faq')(sequelize, DataTypes); 
db.contact = require('../Model/contact')(sequelize, DataTypes);
db.subcategory = require('../Model/subCategory')(sequelize, DataTypes);


db.sequelize.sync({alter:true}).then(() =>{
    console.log("Table created");
});
db.category.hasMany(db.subcategory,{
    foreignKey:'category_id',
});
db.subcategory.belongsTo(db.category,{
    foreignKey:'category_id',
});
module.exports =db;