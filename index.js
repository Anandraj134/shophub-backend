const express = require('express');
const app = express();
var cors = require('cors');
const path = require('path');
const fs = require('fs');

// config
const sequelize = require('./config/config');

//Model
// const User = require('./Model/signup');
// const staffMembers = require('./Model/staffMember');

//Controller
var userCtrl = require('./controllers/userController');
var staffCtrl = require('./controllers/staffMemberController');
var categoryCtrl = require('./controllers/categoryController');
var customerOrderCtrl = require('./controllers/orderController');
var productCtrl = require('./controllers/productController');
var faqCtrl = require('./controllers/faqCtrl');
var contactCtrl = require('./controllers/contactController');
var subCategoryCtrl = require('./controllers/subCategoryController');

//Midelware 
const checkToken = require('./middleware/verifyToken');
const upload = require('./middleware/multer');
const subCategory = require('./Model/subCategory');

//data format
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/upload/images",express.static(path.join(__dirname,'/upload/images')))

//User (User Login && Signup)
app.post('/signup',userCtrl.createUser);
app.post('/login',userCtrl.loginUser);
app.patch('/updateuser/:id',userCtrl.updateUser);
app.delete('/deleteUser/:id',userCtrl.deleteUser);  
app.get('/getalluser',userCtrl.getAllUser)
app.get('/getuserbyid/:email',userCtrl.getUserById)
app.patch('/roleupdate/:id', userCtrl.roleUpdate)


//Staff CRUD
app.post('/addstaff',checkToken,staffCtrl.createstaffMember);
app.get('/getstaffs',staffCtrl.getstaffMember);
app.get('/getsinglestaff/:id',staffCtrl.getsinglestaffMember);
app.delete('/deletestaff/:id',staffCtrl.deletestaffMember);
app.patch('/updatestaff/:id',staffCtrl.updatestaffMember);


//Category CRUD
// app.post('/addcategory',upload.single('image'),categoryCtrl.createCategory);
app.post('/addcategory',categoryCtrl.createCategory);
app.get('/getallcategory',categoryCtrl.getCategory);
app.get('/getsignlecategory/:id',categoryCtrl.getsingleCategory);
app.delete('/deletecategory/:id',categoryCtrl.deleteCategory);
app.patch('/updatecategory/:id',categoryCtrl.updateCategory);

//SubCategory CRUD
app.post('/addsubcategory',subCategoryCtrl.AddSubCategory);
app.get('/getallsubcategory',subCategoryCtrl.getAllSubCategory);
app.get('/getsinglesubcat',subCategoryCtrl.getSingleSubCat);
app.delete('/removesubcate/:id',subCategoryCtrl.removeSubCat);
app.patch('/updatesubcat/:id',subCategoryCtrl.updateSubCat);

//Product CRUD
app.post('/addProduct',checkToken,upload.array('image'),productCtrl.addProduct)
app.get('/getSingleProduct/:id',productCtrl.getProductById)
app.get('/getAllProduct',productCtrl.getAllProduct)
app.get('/getProductByCate/:id',productCtrl.getProductByCategory)
app.get('/getProductByCategAndSubCate/:subcate/:categ',productCtrl.getProductByCategAndSubCate)
app.post('/updateProductImg/:id',upload.array('image'),productCtrl.updateProductImgById)
app.post('/specificImgDelete/:id/:index',productCtrl.specificImgDelete)
app.patch('/updateProductDetail/:id',upload.array('image'),productCtrl.updateProductDetailById)
app.delete('/deleteProduct/:id',productCtrl.deleteProductById)
// app.post('/uploadProductCSV',productCtrl.uploadProductFile);
app.get(`/getproductbyvandor`,productCtrl.getProductByVandor);
app.get('/getproManageByCate',productCtrl.getProManageByCate);
app.get('/getProManageBySub',productCtrl.getProManageBySub);
app.get('/getProOnNext',productCtrl.getProOnNext);



//Order CRUD
app.get('/getallorder',customerOrderCtrl.getAllCustomerOrders)
app.get('/getsingleorder/:id',customerOrderCtrl.getSingleCustomerOrder)
app.post('/addorder',customerOrderCtrl.addCustomerOrder);
app.delete('/deleteorder/:id',customerOrderCtrl.deleteCustomerOrder);
app.patch('/updateorder/:id',customerOrderCtrl.updateCustomerOrder);

app.post('/success',customerOrderCtrl.paymentCapture);

// faq CRUD
app.get('/getFaq/:id',faqCtrl.getFaq);
app.get('/getAllFaq',faqCtrl.getAllFaq);
app.post('/addFaq',faqCtrl.createFaq);
app.patch('/updateFaq/:id',faqCtrl.updateFaq);
app.delete('/deleteFaq/:id',faqCtrl.deleteFaq);

//Contact CRUD
app.get('/getAllcontact',contactCtrl.getAllContact);
app.get('/getcontact/:id',contactCtrl.getOneContact);
app.post('/addcontact',contactCtrl.addContact);
app.delete('/deletecontact/:id',contactCtrl.deleteContact);
app.patch('/updatecontact/:id',contactCtrl.updateContact);


app.listen(5001,()=>{
    console.log("Server is running on port 5001");
})
