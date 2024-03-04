import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiErrors.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import Jwt  from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, `Something went wrong while generating refresh and access token ${error}`)
    }
}

const registerUser = asyncHandler( async (req, res) => {

    // get uses details from frontend
    const {fullName, email, username, password} = req.body

    // validation - not empty (zod)
    if(
        [fullName, email, username, password].some((feild) => feild?.trim() === "")
    ){
        throw new ApiError(400, "All feilds are required")
    }

    // check if user already exists: username, email
    const existedUser = await User.findOne({
        $or: [ {username}, {email} ]
    })

    if(existedUser){
        throw new ApiError(409, `User with username and email exists `)
    }

 // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required")
    }

    // upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar image is required")
    }

     // create user Object - create entry in DB
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered sucessfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {

    // req body  -> data
    const {email, username, password} = req.body
    
    // username or email
    if(!username && !email){
        throw new ApiError(400, `Username or email is required`)
    }
    
    // find the user
    const user = await User.findOne({
        // either search by email or by username
        $or:[{username}, {email}]
    })
    
    if(!user){
        throw new ApiError(404, `User doesn't exist`)
    }
    
    // password check
    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if(!isPasswordValid){
        throw new ApiError(401, `Invalid user credentials`)
    }
    
    // access and refreshToken
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id)
    .select('-password -refreshToken')

    const options = {
        httpOnly: true,
        secure: true
    }
    // send cookie
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken" , refreshToken, options)
    // send response of successful login
    .send(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            `User logged In successfully`
        )       
    )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, "User logged out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, 'Unauthorized request')
    }

    try {
        const decodedToken = Jwt.verify(
            incomingRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET,
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, 'Invalid refresh token')
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, 'Refresh token is expired or used')
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, NewrefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', NewrefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: NewrefreshToken},
                'Access Token refreshed '
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid refresh token')
    }
})

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById( req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, 'Password changed successfully')
    )
})

const getCurrentUser = asyncHandler(async(req, res, next) => {
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            'current user fetched successfully'
        )
    )
})

const updateAccountDetails = asyncHandler(async (req, res, next) => {
    const {fullName, email} = req.body

    if(!fullName || !email){
        throw new ApiError(400, 'All feild is required')
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName,
                email
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async(req, res, next) => {
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400, 'Avatar file is missing')
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400, 'Error while uploding avatar')
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select('-password')

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, 'Avatar image updated successfully')
    )
})

const updateUserCoverImage = asyncHandler(async(req, res, next) => {
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(400, 'coverImage file is missing')
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar.url){
        throw new ApiError(400, 'Error while uploding coverImage')
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select('-password')

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, 'cover image updated successfully')
    )
})

const deleteOldAvatarImage = asyncHandler (async(req, res, next) => {
    const oldAvatarImage = await User.findByIdAndDelete(avatar?._id)

    if(!oldAvatarImage.url){
        throw new ApiError(401, 'Avatar image not found')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, 'avatar image deleted successfully from db')
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    deleteOldAvatarImage,
}