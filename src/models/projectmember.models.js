import mongoose, { Schema } from "mongoose";
import{ AvailableUserRoles, UserRolesEnum } from "../utils/constants.js"
const projectMemberSchema = new Schema({
    user: {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    
    project : {
        type : Schema.type.ObjectId , 
        ref : "Project",
        required : true,
    },
    role : {
        type : String , 
        enum : AvailableUserRoles,
        default : UserRolesEnum.MEMBER,
        required : true,
    }
},{timestamps : true})

export const projectMember = mongoose.model("ProjectMemeber", projectMemberSchema)