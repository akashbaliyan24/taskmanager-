import { asyncHandler } from "../utils/async-handlers.js"
import { User } from "../models/user.models.js";
import { validate } from "../middlewares/validator.middleware.js";
import { crypto } from "crypto"
import { jwt } from "jsonwebtoken";
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
    const { refreshToken } = req.body;

    // check if the token was sent 
    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
    }
    // find the user with refresh token 
    const user = await user.findOne({ "refreshToken.token": refreshToken });
    if (!user) {
        return res.status(200).json({ message: "user already logged out (token not foundn out in DB)" });
    }

    // clear the refresh token 
    user.refreshToken = { token: "" };
    await user.save({ validateBeforeSave: false });

    // respond with logout success
    res.status(200).json({ success: true, message: "Logout successful" });
});
const verifyEmail = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).json({ message: "email is required" });
    }

    // find the user 
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "user not found" });
    }
    if (user.isEmailVerified) {
        return res.status(400).json({ message: "email is already verified" });
    }
    // genrate the token 
    const { hashedToken, unHashedToken, tokenExpiry } = user.gnerateTemporaryToken()

    // store token in user model 
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpirey = tokenExpiry

    await user.save({ validateBeforeSave: false });

    // respond with unhashed token 
    res.status(200).json({
        success: true,
        message: "Verification token genrated successful",
        verificationToken: unHashedToken,
    });
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).json({ message: "email is required" })
    }
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "user is invalid" })
    }
    if (user.isEmailVerified) {
        return res.status(400).json({ message: "user is already verified" });
    }
    const { hashedToken, unHashedToken, tokenExpiry } = user.gnerateTemporaryToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpirey = tokenExpiry;

    await user.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        message: "Verifiaction token re-genarted successfully",
        token: unHashedToken,
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body
    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" })
    }

    // verify refresh token 

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        return res.status(400).json({ message: "invalid or expiry refresh token" })
    };
    const user = await User.findById(decoded._id);

    if (!user) {
        return res.status(400).json({ message: "User not found" })
    }

    if (!user.refreshToken) {
        return res.status(400).json({ message: "Refresh token not found for the user " })
    }

    if (user.refreshToken.token !== refreshToken) {
        return res.status(400).json({ message: "Refresh token mismatch" })
    }
    const newAccessToken = user.gnerateAcessToken();

    // send response 
    res.status(200).json({
        success: true,
        accessToken: newAccessToken,
    });
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body

    // validations
    if (!email) {
        return res.status(400).json({ message: "email is required" })
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "user not found with this email " })
    }
    const { hashedToken, unHashedToken, tokenExpiry } = user.gnerateTemporaryToken();

    user.forgetPasswordToken = hashedToken;
    user.forgetPasswordExpirey = tokenExpiry;
    await user.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        message: "password reset gnerated successfully",
        token: unHashedToken,
    });
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json({ message: "email and password is required" })
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email " })
    }
    const isValid = await user.isPasswordCorrect(password);
    if (!isValid) {
        return res.status(400).json({ message: "Invalid password" })
    }
    const { hashedToken, unHashedToken, tokenExpiry } = user.gnerateTemporaryToken();

    user.passwordResetToken = hashedToken;
    user.passwordExpirey = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Password change token gnerated",
        token: unHashedToken
    });
});

const getCurrentUSer = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "email and password are required" })
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "invalid user" });
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "password is not valid" })
    };
    // return user info if all reqired field is correct
    res.status(200).json({
        success: true,
        user: {
            _id: user._id,
            email: user.email,
            role: user.role,
        },
    });
});



export { registerUser, loginUser, logoutUSer, verifyEmail, resendVerificationEmail, refreshAccessToken, forgotPasswordRequest, getCurrentUSer, changeCurrentPassword, refreshAccessToken };