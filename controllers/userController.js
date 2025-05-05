require('dotenv').config();

const User = require("../models/user");
const bcrypt = require("bcrypt");
const {body, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");

exports.registerUser = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("login").notEmpty().withMessage("Login is required"),
    body("password").isLength({min: 8}).withMessage("Password must be at least 8 characters"),
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorObj = {};
            errors.array().forEach(err => {
                errorObj[err.path] = err.msg;
            });

            return res.status(400).json({
                success: false,
                ...errorObj,
                errors: errors.array()
            });
        }


        const {name, email, login, password} = req.body;

        try {
            const existingUser = await User.findOne({$or: [{email}, {login}]});
            if (existingUser) {
                return res.status(400).json({success: false, message: "Email or login already exists"});
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({name, email, login, password: hashedPassword});
            await newUser.save();

            return res.status(201).json({success: true, message: "Successfully registered", user: newUser});
        } catch (err) {
            return res.status(500).json({success: false, message: "Failed to register user", error: err.message});
        }
    }
];

exports.loginUser = [
    body("login").notEmpty().withMessage("Login is required"),
    body("password").isLength({min: 8}).withMessage("Password must be at least 8 characters"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorObj = {};
            errors.array().forEach(err => {
                errorObj[err.path] = err.msg;
            });

            return res.status(400).json({
                success: false,
                ...errorObj,
                errors: errors.array()
            });
        }
        const {login, password} = req.body;

        try {
            const user = await User.findOne({login});

            if (!user) {
                return res.status(404).json({success: false, message: "User not found"});
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(404).json({success: false, message: "Wrong username or password"});
            }

            const token = jwt.sign({id: user._id , role:user.role}, process.env.JWT_SECRET, {expiresIn: "1d"});

            return res.json({
                success: true,
                token: token,
                user: {
                    id: user._id,
                    name: user.name,
                    login: user.login,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (err) {
            return res.status(500).json({success: false, message: "Server error", error: err.message});
        }
    }
];


exports.updateUser = [body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("login").notEmpty().withMessage("Login is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorObj = {};
            errors.array().forEach(err => {
                errorObj[err.path] = err.msg;
            });

            return res.status(400).json({
                success: false,
                ...errorObj,
                errors: errors.array()
            });
        }
        const {name, email, login} = req.body;

        try {
            const userId = req.user._id;

            if (!userId || userId == null) {
                return res.status(404).json({success: false, message: "User not found"});
            }

            const updatedFields = {name, email, login};
            const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {new: true})

            if (!updatedUser) {
                return res.status(404).json({success: false, message: "No such user"})
            }

            return res.status(200).json({success: true, message: "User updated successfully", user: updatedUser});

        } catch (err) {
            return res.status(500).json({success: false, message: "Something went wrong", error: err.message});
        }
    }
]


exports.deleteUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const deletedUser = await User.findByIdAndDelete(userId)
        if (!deletedUser) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        return res.status(200).json({success: true, message: "User deleted successfully", user: deletedUser});

    } catch (err) {
        return res.status(500).json({success: false, message: "Something went wrong", error: err.message});
    }
}


exports.getUserData = async (req, res) => {
    try {
        const user = req.user

        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }

        return res.status(200).json({success: true, user: user});

    }catch(err) {
        return res.status(500).json({success: false, message: "Something went wrong"});
    }
}



