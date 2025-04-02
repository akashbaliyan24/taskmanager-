import mongoose, { Schema } from "mongoose";
import { AvailableTaskStatus, AvailableTaskUser, TaskStatusEnum } from "../utils/constants.js"

const taskSchema = new Schema({
    title : {
        type : String,
        trim : true,
        required : true,
    },
    description :{
        type : String,
    },
    project : {
        type : Schema.Types.ObjectId,
        ref : "Project",
        required : true,
    },
    assigendTo :  {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    assignedBy : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    status :  {
        type : String ,
        enum : AvailableTaskStatus,
        default : TaskStatusEnum.TODO,
    },
    attachments : {
        type : [
            {
                url : String,
                mimeType : String,
                size : Number, 
            }
        ],
        default : [],
    }
},{timestamps : true})

export const Task = mongoose.model("Task", taskSchema)