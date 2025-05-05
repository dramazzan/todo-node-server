const User = require('../models/user');
const {body, validationResult} = require("express-validator");

exports.deleteUser = async (req, res) => {
    try {

        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({success: false, message: "error in deleting the user"});
        }

        return res.status(201).json({success: true, message: "user successfully deleted", user: deletedUser});


    } catch (err) {
        return res.status(500).json({success: false, message: "Something went wrong", error: err.message});
    }
}

exports.getUserList = async (req, res) => {
    try {
        const users = await User.find({ role: "user" });
        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found" });
        }
        return res.status(200).json({ success: true, users: users });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Error getting users", error: err.message });
    }
};




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

