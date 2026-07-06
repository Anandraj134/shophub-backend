var db = require('../config/config')
const fs = require('fs');
const { result } = require('lodash');
const path = require('path');
var Product = db.product

const modifiedProducts = (array) => {
    // console.log(" array is ", array)
    if (!Array.isArray(array)) {
        console.error("The argument passed to modifiedProducts is not an array.");
        return []; // Return an empty array or handle the error as appropriate
    }
    const modifiedProducts = array.map(product => {
        const modifiedProduct = { ...product.dataValues }; // Create a copy of the product object
        modifiedProduct.image = JSON.parse(product.dataValues.image); // Parse the image JSON
        return modifiedProduct;
    });
    return modifiedProducts;
}
// var updateProductDetailById = async (req, res) => {
//     try{
//         // console.log("req.body is -----------------------------------",req.body);
//         var image = []
//         var newObj ;
//         // console.log("req.file is ***********************************",req.files);
//         if(req.files.length!=0){

//             req.files.forEach((img) => {
//                 image.push(img.filename);
//             })
//             newObj = {
//                 ...req.body,
//                 price:parseInt(req.body.price),
//                 categ:parseInt(req.body.categ),
//                 subcateId:parseInt(req.body.subcateId),
//                 id:parseInt(req.body.id),
//                 image:image
//             }

//         } else {
//             newObj = {
//                 ...req.body,
//                 price:parseInt(req.body.price),
//                 categ:parseInt(req.body.categ),
//                 subcateId:parseInt(req.body.subcateId),
//                 id:parseInt(req.body.id),
//             }
//         }
//         const st = await Product.update(newObj, {
//             where: {
//                 id:req.params.id
//             }
//         })
//         console.log("update pro ctrl ",st)
//         const sendResp = { 
//             status:st[0],
//             data:newObj
//         }
//         return res.status(200).json(sendResp);
//     }catch(err){
//         console.log("error in update product detail by id",err)
//         throw err;
//     }
// }
var updateProductDetailById = async (req, res) => {
    try {
        // console.log("req.body is -----------------------------------",req.body);
        var image = []
        var newObj;
        // console.log("req.file is ***********************************",req.files);
        if (req.files.length != 0) {

            req.files.forEach((img) => {
                image.push(img.filename);
            })
            newObj = {
                ...req.body,
                price: parseInt(req.body.price),
                categ: parseInt(req.body.categ),
                subcateId: parseInt(req.body.subcateId),
                id: parseInt(req.body.id),
                image: image
            }
            // console.log("immg array is ",newObj)

        } else {
            newObj = {
                ...req.body,
                price: parseInt(req.body.price),
                categ: parseInt(req.body.categ),
                subcateId: parseInt(req.body.subcateId),
                id: parseInt(req.body.id),
            }
            // console.log('req.body in else &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& ',newObj)
        }
        const st = await Product.update(newObj, {
            where: {
                id: req.params.id
            }
        })
        // console.log("update pro ctrl ",st)
        const sendResp = {
            status: st[0],
            data: newObj
        }
        return res.status(200).json(sendResp);
    } catch (err) {
        console.log("error in update product detail by id", err)
        throw err;
    }
}
var updateProductImgById = async (req, res) => {
    // console.log("req.body ",req.body)
    try {

        const oldImg = await Product.findOne({
            where: {
                id: req.params.id
            }
        })
        var imgArr = [];
        JSON.parse(oldImg.dataValues.image).forEach(element => {
            imgArr.push(element)
        })
        req.files.forEach(element => {
            // console.log("ele ",element)
            imgArr.push(element.filename)
        })
        const newUpdatedObj = {
            ...oldImg,
            image: imgArr
        }
        // console.log("newUpdatedObj ",newUpdatedObj)
        const updateProductById = await Product.update(newUpdatedObj, {
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json(updateProductById);
    } catch (error) {
        console.log("error in update product by id ", error);
        return res.status(500).json({ "message": "Something went wrong in update Product by id ctrl" });
    }
}
var addProduct = async (req, res) => {
    try {
        console.log(" in add Product ", req.body)
        // console.log(" image_name ", req.files[0].filename)
        var image = []
        req.files.forEach(element => {
            image.push(element.filename)
            // console.log("name is ",element.filename);
        });
        const addData = {
            ...req.body,
            image: image
        }
        // console.log(" addData ", addData)
        const addNewProduct = await Product.create(addData);
        return res.status(200).json(addNewProduct);
    } catch (error) {
        console.log("error in add product ", error);
        return res.status(500).json({ "message": "Something went wrong in add Product ctrl" });
    }
}

const getAllProduct = async (req, res) => {
    try {
        // console.log("this is test");
        const getAllProducts = await Product.findAll();
        // console.log("getAllProducts ", getAllProducts);
        const newModifyedArray = modifiedProducts(getAllProducts)
        return res.status(200).json(newModifyedArray);
    } catch (error) {
        throw (error)
        // return res.status(500).json({ "message": "Something went wrong in get all Product ctrl" });
    }
}

var getProductById = async (req, res) => {
    try {
        // console.log("req.params.id ", req.params.id)
        const getProductById = await Product.findOne({
            where: {
                id: req.params.id
            }
        })
        // const newModifyedArray = modifiedProducts(getProductById)
        getProductById.image = JSON.parse(getProductById.image) // string  to array convert
        return res.status(200).json(getProductById);
    } catch (error) {
        console.log("error in get product by id ", error);
        return res.status(500).json({ "message": "Something went wrong in get Product by id ctrl" });
    }
}


var getProductByCategory = async (req, res) => {
    try {
        const getProductByCate = await Product.findAll({
            where: {
                categ: req.params.id
            }
        })
        const newModifyedArray = modifiedProducts(getProductByCate)
        return res.status(200).json(newModifyedArray);
    } catch (error) {
        console.log("error in get product by category ", error);
        return res.status(500).json({ "message": "Something went wrong in get Product by category ctrl" });
    }
}

var getProductByCategAndSubCate = async (req, res) => {
    try {
        // console.log("req.params.categ is ", req.params.categ, "id is", req.params.id)
        const getProductByCategAndSubCate = await Product.findAll({
            where: {
                subcateId: req.params.subcate,
                categ: req.params.categ
            }
        })
        const newModifyedArray = modifiedProducts(getProductByCategAndSubCate)
        return res.status(200).json(newModifyedArray);
    } catch (error) {
        console.log("error in get product by category and sub-categ")
    }
}

// var updateProductDetailById = async (req, res) => {
//     try{
//         const updateProductDetailById = await Product.update(req.body, {
//             where: {
//                 id:req.params.id
//             }
//         })
//         return res.status(200).json(updateProductDetailById);
//     }catch(err){
//         console.log("error in update product detail by id",err)
//         throw err;
//     }
// }

var updateProductImgById = async (req, res) => {
    // console.log("req.body ",req.body)
    try {
        const oldImg = await Product.findOne({
            where: {
                id: req.params.id
            }
        })
        // console.log("oldImg is ", oldImg)
        var imgArr = [];
        JSON.parse(oldImg.dataValues.image).forEach(element => {
            // console.log("img ",element)
            imgArr.push(element)
        })
        // console.log("img Arr before ",imgArr)
        // console.log("filename ",req.files[0])
        req.files.forEach(element => {
            // console.log("ele ",element)
            imgArr.push(element.filename)
        })
        // imgArr.push(req.files[0].filename)
        // console.log("img Array after",imgArr)
        // console.log("obj = ",oldImg.dataValues)
        const newUpdatedObj = {
            ...oldImg,
            image: imgArr
        }
        // console.log("newUpdatedObj ",newUpdatedObj)
        const updateProductById = await Product.update(newUpdatedObj, {
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json({ "message": "Updated  Successfully" });
    } catch (error) {
        console.log("error in update product by id ", error);
        return res.status(500).json({ "message": "Something went wrong in update Product by id ctrl" });
    }
}

var specificImgDelete = async (req, res) => {
    try {
        const specificImg = await Product.findOne({
            where: {
                id: req.params.id
            }
        })
        // console.log("specificImg ",specificImg.dataValues)
        // console.log("delete img ",JSON.parse(specificImg.dataValues.image)[req.params.index])
        const selectedImg = JSON.parse(specificImg.dataValues.image)[req.params.index];
        const imgPath = path.join(__dirname, '../uploads/' + selectedImg);
        fs.unlink(imgPath, (err) => {
            if (err) {
                console.log("error in unlink img ", err)
            }
        })
        const nn = JSON.parse(specificImg.dataValues.image)
        const imgArr = nn.splice(req.params.index, 1);

        // console.log("imgArr ",nn)
        const newProduct = {
            ...specificImg,
            image: nn
        }
        const updateProductById = await Product.update(newProduct, {
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json(updateProductById)
    } catch (err) {
        console.log("error in specific img ", err)
        return res.status(500).json({ "message": "Something went wrong in specific img ctrl" })
    }
}

var deleteProductById = async (req, res) => {
    try {
        const deleteProductById = await Product.destroy({
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json({ "message": "Item Deleted Succesfully" });
    } catch (error) {
        console.log("error in delete product by id ", error);
        return res.status(500).json({ "message": "Something went wrong in delete Product by id ctrl" });
    }
}

var getProductByVandor = async (req, res) => {
    try {
        // console.log("req.params.id ", req.params.id)
        console.log("user is ", req.query.vendor, "page not detail ", req.query.page, " total size ", req.query.pageSize)


        const page = parseInt(req.query.page);
        const pageSize = parseInt(req.query.pageSize);
        const startIndex = (page - 1) * pageSize
        const endIndex = page * pageSize

        // console.log("this is test1")

        var result 

        if(req.query.vendor == 'all'){
            result = await Product.findAll()
            // console.log("this is test2")
        } else {
            result = await Product.findAll({ where: { uploadby: req.query.vendor } })
            // console.log("result",result)
        }

        // const newModifyedArray = modifiedProducts(getProductById)
        // result.image = JSON.parse(result.image) // string  to array convert
        const modifyedresult = modifiedProducts(result)
        const paginatedProducts = modifyedresult.slice(startIndex, endIndex)
        const totalPages = Math.ceil(modifyedresult.length / pageSize)

        // console.log("mofifyedresult",modifiedProducts,"product in ",paginatedProducts,"totalpages",totalPages,)  
        res.status(200).json({
            products: paginatedProducts,
            total: totalPages,
            currentpage: page
        })

    } catch (error) {
        console.log("error in get product by id ", error);
        return res.status(500).json({ "message": "Something went wrong in get Product by id ctrl" });
    }
}

var getProManageByCate = async(req,res)=>{
    try {
        let key = req.params.id
        console.log("user is ", req.query.vandor, "page", req.query.page, " total size ", req.query.pageSize, "category is ", req.query.category);
        const page = parseInt(req.query.page);
        const pageSize = parseInt(req.query.pageSize)
        const startIndex = (page - 1) * pageSize
        const endIndex = page * pageSize

        const result = await Product.findAll({ where: { uploadby: req.query.vandor,categ: req.query.category  } })
        console.log("result in nextpage",result)

        const modifyedresult = modifiedProducts(result)
        const paginatedProducts = modifyedresult.slice(startIndex, endIndex)
        const totalPages = Math.ceil(modifyedresult.length / pageSize)
        res.status(200).json({
            products: paginatedProducts,
            total: totalPages,
            currentpage: page
        })

    } catch (error) {
        throw error
    }
}

var getProManageBySub = async (req, res) => {
    try {
        console.log("data---------------",req.query)
        console.log("user is ", req.query.vandor, "page", req.query.page, " total size ", req.query.pageSize, "category is ", req.query.category , "-------- ",req.query.subcate)

        const page = parseInt(req.query.page);
        const pageSize = parseInt(req.query.pageSize)
        const startIndex = (page - 1) * pageSize
        const endIndex = page * pageSize
        const result = await Product.findAll({ where: { uploadby: req.query.vandor,categ: req.query.category,subcateId: req.query.subcate} })

        const modifyedresult = modifiedProducts(result)
        const paginatedProducts = modifyedresult.slice(startIndex, endIndex)
        const totalPages = Math.ceil(modifyedresult.length / pageSize)
        res.status(200).json({
            products: paginatedProducts,
            total: totalPages,
            currentpage: page
        })
        // res.status(200).json(modifyedresult)
    } catch (error) {
        throw error
    }
}

var getProOnNext = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        console.log("page is ",page)
        const pageSize = parseInt(req.query.pageSize)
        const startIndex = (page - 1) * pageSize
        const endIndex = page * pageSize
        let result
        if (req.query.vendor != 'all') {
            // console.log("in vendor",req.query.vendor)
            result = await Product.findAll({ where: { uploadby: req.query.vendor } })
        } else if (req.query.vendor !="" && req.query.category != "") {
            // console.log("in vendor cate",req.query.category,"vendor is ",req.query.vendor)

            result = await Product.findAll({ where: { uploadby: req.query.vendor, categ: req.query.category }})
        } else if (req.query.vendor!="" && req.query.category!="" && req.query.subcate!="") {
            console.log("in vendor cate subcate")
            result = await Product.findAll({ where: { uploadby: req.query.vendor, categ: req.query.category, subcateId: req.query.subcate }})
        } else {
            console.log("in all vendor is ",req.query.vendor)
            result = await Product.findAll()
        }
        const pro = modifiedProducts(result)
        // console.log("all product is ",pro)
        const paginatedProducts = pro.slice(startIndex, endIndex)
        const totalPages = Math.ceil(pro.length / pageSize)
        // console.log("paginated prod ",paginatedProducts)
        res.status(200).json({
            products: paginatedProducts,
            total: totalPages,
            currentpage: page
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    addProduct,
    getAllProduct,
    getProductById,
    getProductByCategory,
    getProductByCategAndSubCate,
    updateProductDetailById,
    updateProductImgById,
    specificImgDelete,
    deleteProductById,
    getProductByVandor,
    getProManageByCate,
    getProManageBySub,
    getProOnNext
}
