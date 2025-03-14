const isAdmin = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || user.role !== 'admin') {
            return res.status(403).json({success: false, message: "Access denied"});
        }

        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        });
    }
};

module.exports = isAdmin;
