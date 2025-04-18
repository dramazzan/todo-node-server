const Case = require('../models/case');
const {body, validationResult} = require("express-validator");

exports.createCase = [body('title').notEmpty().withMessage("Title is required"),
    body('description').notEmpty().withMessage("Description is required"),
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors) {
            const errorMessage = errors.array().map(v => v.msg).join(", ");
            return res.status(404).json({success: false, message: errorMessage, errors: error.array()});
        }

        try {
            const {title, description} = req.body;
            const userId = req.user._id;

            if (!title) {
                return res.status(400).json({message: "Title is required"});
            }

            const newCase = new Case({title, description, userId});
            const savedCase = await newCase.save();

            return res.status(201).json({success: true, savedCase});
        } catch (err) {
            return res.status(500).json({success: false, message: err.message});
        }
    }];

exports.updateCase = [body('title').notEmpty().withMessage("Title is required"),
    body('description').notEmpty().withMessage("Description is required"), async (req, res) => {

        const errors = validationResult(req);

        if (!errors) {
            const errorMessage = errors.array().map(v => v.msg).join(", ");
            return res.status(404).json({success: false, message: errorMessage, errors: error.array()});
        }

        const {title, description, status, priority, favorite} = req.body;

        try {
            const updateFields = {title, description, status, priority, favorite}
            const updateCase = await Case.findByIdAndUpdate(req.params.id, updateFields, {new: true})
            if (!updateCase) {
                return res.status(404).json({success: false, message: "No such case"});
            }
            return res.status(200).json({success: true, message: "Successfully updated case", updateCase});
        } catch (err) {
            return res.status(500).json({success: false, message: err.message});
        }

    }];

exports.deleteCase = async (req, res) => {
    try {
        const deletedCase = await Case.findByIdAndDelete(req.params.id);
        if (!deletedCase) {
            return res.status(404).json({success: false, message: "No such case"});
        }
        return res.status(200).json({success: true, message: "Successfully deleted case", deletedCase});
    } catch (err) {
        return res.status(500).json({success: false, message: err.message})
    }
}


exports.getCaseInfo = async (req, res) => {
    try {
        const selectedCase = await Case.findById(req.params.id)
        if (!selectedCase) {
            return res.status(404).json({success: false, message: "No such case"});
        }
        return res.status(200).json({success: true, selectedCase});
    } catch (err) {
        return res.status(404).json({success: false, message: err.message});
    }
}


exports.getAllCases = async (req, res) => {
    try {
        const userId = req.user._id;

        const cases = await Case.find({userId});

        if (cases.length === 0) {
            return res.status(404).json({success: false, message: "No cases found for this user"});
        }

        return res.status(200).json({success: true, cases});

    } catch (err) {
        return res.status(500).json({success: false, message: err.message});
    }
};


exports.searchCases = async (req, res) => {
    try {
        const query = req.query.q;

        if (!query || query.trim() === "") {
            return res.status(400).json({success: false, message: "Search query is required and cannot be empty"});
        }

        if (!query) {
            return res.status(400).json({success: false, message: "Search query is required"});
        }

        const cases = await Case.find({
            $or: [
                {title: {$regex: query, $options: "i"}},
                {description: {$regex: query, $options: "i"}}
            ]
        });


        if (!cases.length) {
            return res.status(404).json({success: false, message: "No such cases found"});
        }

        return res.status(200).json({success: true, cases: cases});


    } catch (err) {
        return res.status(500).json({success: false, message: err.message});
    }
}