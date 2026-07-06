module.exports = (sequelize,DataTypes) =>{
    const Faq = sequelize.define("Faq", {
        title:{
            type: DataTypes.STRING,
            allowNull: false
        },
        ques:{
            type: DataTypes.STRING,
            allowNull: false
        },
        ans:{
            type: DataTypes.STRING,
            allowNull:true
        }
    })
    return Faq;
}