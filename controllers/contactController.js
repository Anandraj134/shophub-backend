var db = require('../config/config');
const cors = require('cors');

var contact = db.contact;

var addContact = async (req, res) => {
    try {
        let data = await contact.create(req.body);
        res.status(201).json({ message: 'Message has been sended succesfully', data });
    } catch (error) {
        throw error
    }
}

var getAllContact = async (req, res) => {
    try {
        let data = await contact.findAll(req.body);
        res.status(201).json(data);
    } catch (error) {
        throw error
    }
}

var getOneContact = async (req, res) => {
    const id = req.params.id;
    try {
        let data = await contact.findOne({
            where: { id: id }
        });
        res.status(201).json(data);
    } catch (error) {
        throw error
    }
}


var deleteContact = async (req, res) => {
    const id = req.params.id;
    try {
        let data = await contact.destroy({
            where: { id: id }
        });
        res.status(201).json({ Message: 'data deleted succesfully', data });
    } catch (error) {
        throw error
    }
}

var updateContact = async (req, res) => {
    const id = req.params.id;
    try {
        let data = await contact.findOne({
            where: { id: id }
        });
        console.log(data)
        if (data) {
            let updatedData = await contact.update(req.body,{ where: { id: id }});
            res.status(201).json({ Message: "Data Updated Successfully", updatedData });
        }else{
            res.status(401).json({Message:"User not found"});
        }
    } catch (error) {
        throw error
    }
}


module.exports = {
    addContact,
    getAllContact,
    getOneContact,
    deleteContact,
    updateContact
}
