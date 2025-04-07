import { asyncHandler } from "../utils/async-handlers.js"
import { User } from "../models/user.models.js";
import { validate } from "../middlewares/validator.middleware.js";
import {crypto} from "crypto"
const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body
    if (!email || !username || !password) {
        return res.status(400).json({ message: "All field required" });
    }
    // check if user already exit 
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "user already exists" });
    }
    // create new user using create method 
    const newUser = await User.create({
        email,
        username,
        password,
        role: role || "user",
    });
    // genrateacess token for new user 
    const token = newUser.gnerateAcessToken();

    // Send Response 
    res.status(200).json({
        success: true,
        message: "User registered successfully",
        user: {
            _id: newUser._id,
            email: newUser.email,
            username: newUser.username,
            role: newUser.role,
        },
        token,
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body
    // validation 
    if (!email || !password) {
        return res.status(400).json({ message: "email and password required" });
    }

    // find the user 
    const user = await user.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "invalid email or password" })
    }
    // genrate token 
    const accessToken = user.gnerateAcessToken();
    const refreshToken = user.gnerateRefreshToken()
    // save refresh token in DB 
    user.refreshToken = { token: refreshToken };
    await user.save({ validateBeforeSave: false });

    // send response in response 
    res.status(200).json({
        message: "Login Successful",
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    });
});

const logoutUSer = asyncHandler(async (req, res) => {
    const {refreshToken} = req.body;

    // check if the token was sent 
    if(!refreshToken){
        return res.status(400).json({message : "Refresh token is required"});
    }
    // find the user with refresh token 
    const user = await user.findOne({"refreshToken.token": refreshToken});
    if(!user){
        return res.status(200).json({message : "user already logged out (token not foundn out in DB)"});
    }

    // clear the refresh token 
    user.refreshToken = {token : ""};
    await user.save({validateBeforeSave : false});

    // respond with logout success
    res.status(200).json({success : true , message : "Logout successful"});
});
const verifyEmail = asyncHandler(async (req, res) => {
    const { email } = req.body
    if(!email){
        return res.status(400).json({message: "email is required"});
    }

    // find the user 
    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({message :"user not found"});
    }
    if(user.isEmailVerified){
        return res.status(400).json({message : "email is already verified"});
    }
    // genrate the token 
    const {hashedToken,unHashedToken,tokenExpiry} = user.gnerateTemporaryToken()

    // store token in user model 
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpirey=tokenExpiry

    await user.save({validateBeforeSave : false});

    // respond with unhashed token 
    res.status(200).json({
        success : true,
        message :"Verification token genrated successful",
        verificationToken : unHashedToken,
    });
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
    const { email} = req.body
    if(!email){
        return res.status(400).json({message : "email is required"})
    }
    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({message : "user is invalid"})
    }
    if(user.isEmailVerified){
        return res.status(400).json({message : "user is already verified"});
    }
    const {hashedToken,unHashedToken,tokenExpiry} = user.gnerateTemporaryToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpirey=tokenExpiry;

    await user.save({validateBeforeSave : false})

    res.status(200).json({
        success : true,
        message : "Verifiaction token re-genarted successfully",
        token : unHashedToken,
    });
});

const refreshAccessTocken = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body


    // validation 
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body


    // validation 
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body


    // validation 
});

const getCurrentUSer = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body


    // validation 
});



export { registerUser,loginUser,logoutUSer,verifyEmail,resendVerificationEmail,refreshAccessTocken,forgotPasswordRequest}