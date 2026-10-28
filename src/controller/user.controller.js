import { User } from "../models/user.models.js";
import asyncHandler from "../utilis/asyncHandler.js"
import jwt from "jsonwebtoken";



const generateAccessAndRefreshToken = async (userId)=>{
    try{
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        
        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};
    }catch(err){
        console.log("Error occured while creating access and refresh token", err);
        throw new Error("Error occured while creating access and refresh token");
    }
}


const registerUser = asyncHandler(async (req, res)=>{
    const {fullName, email, password} = req.body;

    if(!fullName || !email || !password){
        return res.status(400).json({message: "All fields are required"});
    }
    if(password.length < 8){
        return res.status(400).json({message: "Password should contain atleast 8 letters"});
    }
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message: "User already exists"});
    }

    const newUser = await User.create({
        fullName,
        email,
        password
    })

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    if(!createdUser){
        return res.status(500).json({message: "Failed to create user"});
    }

    return res.status(200).json({
        message: "User registered successfully",
        data: createdUser
    })
})


const LoginUser = asyncHandler(async (req, res)=>{
    const {email, password}=req.body;

    if(!email || !password){
        return res.status(400).json({message: "All fields are required"});
    }

    const existingUser = await User.findOne({email});

    if(!existingUser){
        return res.status(400).json({message: "Invalid email or password"});
    }

    const isPasswordCorrect = await existingUser.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        return res.status(400).json({message: "Invalid email or password"});
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existingUser._id);

    const options = {
        httpOnly: true,
        secure: true
    }
    const loggedInUser = await User.findById(existingUser._id).select("-password -refreshToken");

    return res.status(200).cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            message: "User logged in successfully",
            data: loggedInUser, accessToken, refreshToken
        })
})

const logoutUser = asyncHandler(async(req, res)=>{
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, {
            $set: {
                refreshToken: null
            }
        },
        {
            new:true
        }
    );
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            message: "User logged out successfully"
        })
})


const viewProfile = asyncHandler(async(req, res)=>{
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password -refreshToken");

    if(!user){
        res.status(404).json({
            message: "User not found"
        })
    }
    return res.status(200).json({
        message: "User detailes fetched",
        sucess: true,
        data: user
    })
})


const refreshAccessToken = asyncHandler(async (req, res)=>{
    const incomingRefreshToken = req.body.refreshToken;

    if(!incomingRefreshToken){
        return res.status(400).json({message: "Refresh token is required"});
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);

    if(!user || user.refreshToken !== incomingRefreshToken){
        return res.status(401).json({message: "Invalid refresh token"});
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);
    
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            message: "Access token refreshed successfully",
            data: {
                accessToken,
                refreshToken
            }
        });
})


export {
    registerUser,
    LoginUser,
    logoutUser,
    viewProfile,
    refreshAccessToken
}