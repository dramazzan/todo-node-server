const User = require("../models/user");
const bcrypt = require("bcrypt");
const {body, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("../config/db");

exports.registerUser = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("login").notEmpty().withMessage("Login is required"),
    body("password").isLength({min: 8}).withMessage("Password must be at least 8 characters"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success: false, errors: errors.array()});
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
            return res.status(400).json({success: false, errors: errors.array()});
        }

        const {login, password} = req.body;

        try {
            const user = await User.findOne({login});

            if (!user) {
                return res.status(400).json({success: false, message: "User not found"});
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({success: false, message: "Wrong username or password"});
            }

            const token = jwt.sign({id: user._id}, config.secretKey, {expiresIn: "1d"});

            return res.json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    login: user.login,
                    email: user.email
                }
            });
        } catch (err) {
            return res.status(500).json({success: false, message: "Server error", error: err.message});
        }
    }
];


exports.getUsers = async (req, res) => {
    try {
        const users = await User.find()
        if (!users.length) {
            return res.status(404).json({success: false, message: "No users found"});
        }
        return res.status(200).json({success: true, users: users})
    } catch (err) {
        return res.status(500).json({success: false, message: "Error getting users", err: err.message});
    }
}

exports.getUserById = async (req, res) => {
    try {
        const user_id = req.params.id;

        const user = await User.findOne({_id: user_id});

        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        return res.status(200).json({success: true, user});

    } catch (err) {
        return res.status(500).json({success: false, message: "Error getting user", error: err.message});
    }
};

exports.getUserByLogin = [body('login').notEmpty().withMessage("error getting user by login"), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array().map((v) => v.msg),
                errors: errors.array()
            });
        }

        const user_login = req.body.login

        const user = await User.findOne({login: user_login});

        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        return res.status(200).json({success: true, user});

    } catch (err) {
        return res.status(500).json({success: false, message: "Error getting user", err: err.message});
    }
}];

exports.getUserByEmail = [body('email').isEmail().withMessage("error getting user by email"), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array().map((v) => v.msg),
                errors: errors.array()
            });
        }

        const user_email = req.body.email

        const user = await User.findOne({email: user_email});

        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        return res.status(200).json({success: true, user});

    } catch (err) {
        return res.status(500).json({success: false, message: "Error getting user", err: err.message});
    }
}];



