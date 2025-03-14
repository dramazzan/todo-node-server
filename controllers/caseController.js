const Case = require('../models/case');

exports.createCase = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const newCase = new Case({ title, description });
        const savedCase = await newCase.save();

        return res.status(201).json({success: true, savedCase});
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateCase = async (req, res) => {
    const {title, description} = req.body;

    try{
        const updateFields = {title, description}
        const updateCase = await Case.findByIdAndUpdate(req.params.id , updateFields , {new: true})
        if(!updateCase){
            return res.status(404).json({success: false, message:"No such case"});
        }
        return res.status(200).json({success: true, message:"Successfully updated case" , updateCase});
    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
    }

}

exports.deleteCase = async (req,res)=>{
    try{
        const deletedCase = await Case.findByIdAndDelete(req.params.id);
        if(!deletedCase){
            return res.status(404).json({success: false, message:"No such case"});
        }
        return res.status(200).json({success: true, message:"Successfully deleted case" , deletedCase});
    }catch(err){
        return res.status(500).json({success: false, message: err.message})
    }
}

exports.getCaseInfo = async (req, res) => {
    try{
        const selectedCase = await Case.findById(req.params.id)
        if(!selectedCase){
            return res.status(404).json({success: false, message:"No such case"});
        }
        return res.status(200).json({success: true, selectedCase});
    }catch(err){
        return res.status(404).json({success: false, message: err.message});
    }
}


exports.getAllCases = async (req, res) => {
    try {
        const cases = await Case.find();
        return res.status(200).json(cases);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};