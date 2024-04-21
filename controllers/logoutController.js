const Users = require('../models/usersModel');

const handleLogout = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.status(204).json({message: "No cookie present"}); //No content
        const refreshToken = cookies.jwt;

        // Is refreshToken in db?
        const foundUser = await Users.findOne({ refreshToken: refreshToken });
        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.status(204).json({message: "No user found with this token"});
        }

        // Delete refreshToken in db
        const updatedUser = await Users.findByIdAndUpdate(
            { _id: foundUser._id },
            { refreshToken: null },
            { new: true }
        );

        if(updatedUser){
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            res.status(200).json({message: "User logged out successfully"});
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something went wrong. Please try again."});
    }
    
}

module.exports = { handleLogout }