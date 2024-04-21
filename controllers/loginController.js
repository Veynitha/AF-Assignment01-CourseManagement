const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/usersModel');

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Username and password are required." });

    const foundUser = await User.findOne({ email: email });
    
    if (!foundUser) return res.status(401).json({message: "User does not exist!"}); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const role = foundUser.role;
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email,
                    "role": role
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '300s' }
        );
        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        const updatedUser = await User.findByIdAndUpdate(
            { _id: foundUser._id },
            { refreshToken: refreshToken },
            { new: true }
        );
        if(updatedUser){
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            res.json({ accessToken });
        }
        
    } else {
        res.send(401).json({ message: "Invalid password!" }); //Unauthorized
    }
    } catch (error) {
        console.log(error)
        res.status(500).json("Something went wrong. Please try again.")
    }
    
}

module.exports = { handleLogin };