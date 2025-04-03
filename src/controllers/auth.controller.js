import { asyncHandler } from "../utils/async-handlers.js"

const registerUser = asyncHandler(async(req,res)=>{
    const {email,username,password,role} = req.body


    // validation 
    registrationValidation(body)
})

export{registerUser}