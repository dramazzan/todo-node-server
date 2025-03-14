const User = require('../models/user');

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
        const users = await User.find()
        if (!users.length) {
            return res.status(404).json({success: false, message: "No users found"});
        }
        return res.status(200).json({success: true, users: users})
    } catch (err) {
        return res.status(500).json({success: false, message: "Error getting users", err: err.message});
    }
}