var db = require('../config/config');
var bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
var { hashSync } = require('bcrypt');

var staffMember = db.staffMember;

//get ALl member
var getstaffMember = async (req, res) => {
    try {
        let data = await staffMember.findAll({});
        res.status(200).json(data);
    } catch (error) {
        console.log("error in get all member", error)
        throw error
    }
}

//get Single Member
var getsinglestaffMember = async (req, res) => {
    try {
        // console.log(req.params.id);
        let data = await staffMember.findOne({ where: { id: req.params.id } });
        console.log(data);
        res.status(200).json(data);
    } catch (error) {
        console.log("error in get all singlemember", error)
        throw error
    }
}

//Create member
var createstaffMember = async (req, res) => {
    try {
        // console.log(req.body);
        const memberExist = await staffMember.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!memberExist) {
            const data = {
                ...req.body,
                password: hashSync(req.body.password, 10)
            }
            // console.log(data); 
            let newMember = await staffMember.create(data);
            res.status(200).json({ message: "Staff Member Created Successfully", newMember });
        } else {
            res.status(500).json({ message: "Staff Member already exists" })
        }
    } catch (error) {
        console.log("error in create staffmemmber", error)
        throw error
    }
}


//Update member
var updatestaffMember = async (req, res) => {
    try {
        let updateData = {
            ...req.body,
            password: hashSync(req.body.password, 10)
        }
        let updatemember = await staffMember.update(updateData, { where: { id: req.params.id } });
        console.log("Updatemember===>", updatemember);
        if (updatemember[0] > 0) {
            res.status(200).json({ success: 1, message: 'Data updated Successfully' });
        } else {
            res.status(500).json({ success: 0, message: 'Data does not updated' });
        }
    } catch (error) {
        console.log("error in update member", error)
        throw error
    }
}

//Delete member
var deletestaffMember = async (req, res) => {
    try {
        let deletedmember = await staffMember.destroy({ where: { id: req.params.id } });
        console.log(deletedmember);
        res.status(200).json({ message: 'Deleted the user' });
    } catch (error) {
        console.log("error in delete member", error)
        throw error
    }
}

module.exports = {
    createstaffMember,
    deletestaffMember,
    updatestaffMember,
    getstaffMember,
    getsinglestaffMember

}