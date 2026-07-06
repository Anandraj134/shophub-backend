var db = require('../config/config');
var bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


var category = db.category;

var createCategory = async (req, res) => {
    try {
        console.log("this  is the req body", req.body);
        // console.log("this  is the req file",req.file.originalname);
        const details = {
            ...req.body,
            // image:req.file.filename
        }
        let data = await category.create(details);
        res.status(200).json({ message: 'Category has been created successfully', data: data });
    } catch (error) {
        console.log("error in create category", error);
        throw error
    }
}

var getCategory = async (req, res) => {
    try {
        let data = await category.findAll();
        if (!data) {
            return res.status(404).json({ message: 'No Category Found' });
        } else {
            return res.status(200).json(data);
        }
    } catch (error) {
        console.log("error in get category", error);
        throw error
    }
}

var getsingleCategory = async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id);
        let data = await category.findAll({ where: { id: id } });
        res.status(200).json(data);
    } catch (error) {
        console.log("error in create single category", error);
        throw error
    }
}

var deleteCategory = async (req, res) => {
    try {
        let id = req.params.id;
        let data = await category.destroy({ where: { id: id } });
        if (!data) {
            return res.status(400).json({ message: "No such Category found." })
        } else {
            return res.status(200).json({ message: "Category Deleted Succesfully" })
        }
    } catch (error) {
        console.log("error in delete category", error);
        throw error
    }
}

var updateCategory = async (req, res) => {
    try {
        let id = req.params.id;
        console.log("res.body ", req.body);
        console.log("id in updatecate",id);
        const {category_name} = req.body
        const data = await category.update({category_name},{where: {id : id}}) 
        return res.status(200).json(data)
    // const data = await category.findAll({
    //     where: {
    //         id: req.params.id
    //     }
    // });
    // if (!data) {
    //     return res.status(400).json({ message: 'Update failed!' });
    // } else {
    //     console.log("in data ", data[0].dataValues.image);
    //     const exestingFile = path.join(__dirname, '../upload/images', data[0].dataValues.image);
    //     console.log(exestingFile);
    //     fs.unlinkSync(exestingFile, (error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    //     const newData = {
    //         ...req.body,
    //         image: req.file.filename
    //     }
    //     console.log(newData, "New Data");
    //     const result = await category.update(newData, { where: { id: id } });
    //     if (!result) {
    //         return res.status(400).json({ message: 'Failed to Update' })
    //     } else if (result <= 0) {
    //         return res.status(400).json({ message: 'Category not exist.' })
    //     } else {
    //         return res.status(200).json({ message: 'Updated Successfully!', data: result });
    //     }
    // }
    } catch (error) {
        console.log("error in update category", error);
        throw error
    }
}

module.exports = {
    createCategory,
    getCategory,
    getsingleCategory,
    updateCategory,
    deleteCategory
}