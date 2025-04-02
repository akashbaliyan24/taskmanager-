import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new Schema({
    avatar: {
        type: {
            String: String,
            localpath: String,
        },
        default: {
            url: 'https://placehold.co/600x400',
            localpath: "",
        },
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowecase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    forgetPasswordToken: {
        type: String,
    },
    forgetPasswordExpirey: {
        type: Date,
    },
    refreshToken: {
        token: String,
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerificationExpirey: {
        type: Date,
    }
}, { timestamps: true })


userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)

}
userSchema.methods.gnerateAcessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : process.env.ACCESS_TOKEN_EXPIRY}
    )
}

userSchema.methods.genrateRefreshToken = function () {
    return jwt.sign(
       { _id : this._id},

       process.env.REFRESH_TOKEN_SECRET,
       {expiresIn : process.env.REFRESH_TOKEN_EXPIRY}
    )
}

userSchema.methods.genrateTemporaryToken = function(){
    const unHashedToken = crypto.randomBytes(20).toString("hex")

   const hashedToken =  crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex")
        const tokenExpiry = Date.now() + (20*60*1000)

        return {hashedToken ,unHashedToken , tokenExpiry}
} 
export const User = mongoose.model("User", userSchema)