var db = require('../config/config');
var bcrypt = require("bcrypt");
var { hashSync, compare, compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');

var User = db.user;

//Create User
var createUser = async (req, res) => {
    try {
        // console.log("req.body is ", req.body.data)
        const userExist = await User.findOne({
            where: {
                email: req.body.data.email
            }

            // res.status(200).send("user already exist");
        });
        if (!userExist) {
            // console.log("in backend sign ", req.body.data);
            const data = {
                ...req.body.data,
                password: hashSync(req.body.data.password, 10)
            }
            let newUser = await User.create(data);
            const newRes = {
                message: 'user created successfully',
                status: 1
            }
            return res.status(200).send(newRes);
        } else {
            // console.log("user already exist");
            const newRes = {
                message: 'user already exist',
                status: 0
            }
            return res.status(200).send(newRes);
        }
    } catch (err) {
        const newRes = {
            message: 'Error in sign up',
            status: 1
        }
        return res.status(500).send(newRes);
    }
}


var loginUser = async (req, res) => {
    try {
        // console.log("in backend login ", req.body.data);
        const user = await User.findOne({ where: { email: req.body.data.email } });

        console.log("login user res", req.body.data);

        if (req.body.data.loginVia) {
            if (!user) {
                const res = await User.create(req.body.data)
                console.log("login new user res ", user)
            }
            const payload = {
                name: req.body.data.name,
                email: req.body.data.email
            }
            // console.log("payload is ", payload)
            const token = jwt.sign(payload, "Random String", { expiresIn: "1m" })
            // to set the generated token to header
            const val = 'Bearer ' + token;
            console.log("val is token ", val)
            return res.status(200).json({
                message: "Authenticated!,User Login Successfuly",
                token: "Bearer " + token,
                status: true
            })
        }

        if (user) {
            await User.update({ status: 1 }, { where: { email: req.body.data.email } })
            let comparePassword = await bcrypt.compare(req.body.data.password, user.password);
            if (comparePassword) {
                const payload = {
                    name: user.name,
                    id: user.id,
                    email: user.email,
                }
                console.log("payload is ", payload)
                const token = jwt.sign(payload, "Random String", { expiresIn: "1d" })
                // to set the generated token to header
                const val = 'Bearer ' + token;
                // console.log("val is ", val)
                return res.status(200).json({
                    // sucess: true,
                    message: "Authenticated!,User Login Successfuly",
                    token: "Bearer " + token,
                    status: true,
                    role: user.role
                })
            } else {
                console.log("Password Incorrect");
                return res.status(200).json({
                    message: 'Password Incorrect',
                    status: false
                })
            }
        } else {
            res.status(200).json({
                message: "User does not exist",
                status: false
            });
        }
    } catch (erroror) {
        console.log("er ", erroror)
        res.status(500).json({
            message: erroror,
            status: false
        });
    }
}

//Update User
var updateUser = async (req, res) => {
    try {
        const updatedData = {
            ...req.body,
            password: hashSync(req.body.password, 10)
        }

        var user = await User.update(updatedData, {
            where:
            {
                id: req.params.id
            }
        });
        res.status(200).json({ "message": "User Details Updated Successfully", data: user });
    } catch (error) {
        throw error;
    }
}

//Delete User
const deleteUser = async (req, res) => {
    try {
        console.log("id is ", req.params.id)
        const agent = await User.destroy({
            where: { id: req.params.id }
        })
        console.log("agent is ", agent)
        res.status(200).send({
            id: req.params.id,
            message: "User deleted successfully",
            success: true
        })
    } catch (error) {
        console.log("error in delete user ", error)
        res.status(500).send({
            message: "Error in deleting user",
            success: false
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users)
    } catch (error) {
        throw error
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.params.email}});
        return res.status(200).json(user)
    } catch (error) {
        throw error
    }
}

var roleUpdate = async (req, res) => {
    try {
        console.log("in backend editUser ", req.body)
        const accObj = {canManageProducts:req.body.canManageProducts,
            canManageCategory:req.body.canManageCategory,
            canManageSubCategory:req.body.canManageSubCategory,
            canManageUsers:req.body.canManageUsers,
            canManageOrders:req.body.canManageOrders}
        // const newObj = {
        //     "role": data.role,
        //     "canAccess":
        // }
        console.log("req.body in user ",req.body);
        const oldObj = await User.update({ role: req.body.role,canAccess:accObj }, { where: { id: req.params.id } })
        console.log(oldObj);
        if (oldObj[0] == 1) {
            return res.status(200).json({
                message: "Role updated successfully.",
                data: req.body,
                success: 1
            }
            );
        } else {
            return res.status(200).json({
                message: "Error in update role",
                success: 0
            })
        }
    } catch (error) {
        console.log("erroror:", error);
        return res.status(500).json({
            message: "Internal Server erroror editUser",
            success: 0
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    deleteUser,
    updateUser,
    getAllUser,
    roleUpdate,
    getUserById
}