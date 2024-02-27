import {asyncHandler} from "../utils/asyncHandler.js"


const registerUser = asyncHandler( async (req, res) => {
    // get uses details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user Object - create entry in DB
    // remove password and refresh token field from response
    // check for user creation
    // return response

    // res.status(200).json({
    //     msg:"Ok"
    // })

    const {fullName, email, username, password} = req.body
    console.log("email", email);

})

export {registerUser}