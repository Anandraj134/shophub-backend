var db = require('../config/config');
var Faq = db.faq;

const getFaq = async (req,res) => {
    try{
        const faq = await Faq.findAll({
            where:{
                id:req.params.id
            }
        });
        return res.status(200).json(faq);
    }catch(err){
        console.log("Error in get Faq",err);
        throw err;
    }
}

const getAllFaq = async (req,res) => {
    try{
        const faqs = await Faq.findAll();
        return res.status(200).json(faqs);
    }catch(err){
        console.log("Error in get Faq",err);
        throw err;
    }
}

const createFaq = async (req,res) => {
    try{
        const faq = await Faq.create(req.body);
        return res.status(200).json(faq);
    }catch(err){
        console.log("Error in create Faq",err);
        throw err;
    }
}

const updateFaq = async (req,res) => {
    try{
        const updatefaq = await Faq.update(req.body,{
            where:{
                id:req.params.id      
            }
        })
        return res.status(200).json({ "message": "Faq Updated Successfully" });
    }catch(err){
        console.log("Error in update Faq",err);
        throw err;
    }
}

const deleteFaq = async (req,res) => {
    try{
        const deletefaq = await Faq.destroy({
            where:{
                id:req.params.id
            }
        })
        return res.status(200).json({ "message": "Deleted succesfully" });
    }catch(err){
        console.log("Error in delete Faq",err);
        throw err;
    }
}

module.exports = {
    getFaq,
    getAllFaq,
    createFaq,
    updateFaq,
    deleteFaq
}