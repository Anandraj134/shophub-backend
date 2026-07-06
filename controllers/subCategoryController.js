var db = require('../config/config');
var subcategory = db.subcategory;

var AddSubCategory = async (req, res) => {
    try {
        const data = req.body;
        var result = await subcategory.create(data);
        if (!result) throw "Error in Saving Record";
        res.status(200).json(result);
    } catch (error) {
        throw error
    }
}

var getAllSubCategory = async (req, res) => {
    try {
        let data = await subcategory.findAll({
            include:[
                {
                    model:db.category
                }
            ]
        });
        res.status(200).json(data);
    } catch (error) {
        console.log("error in get all subCategory", error)
        throw error
    }
}

var getSingleSubCat = async (req, res) => {
    try {
        let data = await subcategory.findOne({
            where: { id: req.params.id }
        });
        res.status(200).json(data);
    } catch (error) {
        console.log("error in get single subCategory", error)
        throw error
    }
}

var removeSubCat = async (req, res) => {
    try {
        let data = await subcategory.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json(data);
    } catch (error) {
        throw error
    }
}

var updateSubCat = async (req, res) => {
    try {
        let updateData = await subcategory.update(req.body, {where: { id: req.params.id } });
        const mewResp ={
            status:updateData[0],
            data:req.body
        }
        res.status(200).json(mewResp);
    } catch (error) {
        console.log("error in update subcategory", error)
        throw error
    }
}

module.exports = {
    AddSubCategory,
    getAllSubCategory,
    getSingleSubCat,
    removeSubCat,
    updateSubCat
}