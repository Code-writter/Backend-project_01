import {Router} from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.route("/register").post(
    // middleware
    upload.fields([
        {
            name:"avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount:1
        }
    ]),
    registerUser
    )
// router.post('/register',registerUser )

userRouter.route('/login').post(loginUser)

// Secured routes
userRouter.route('/logout').post(verifyJWT ,logoutUser)

export  {userRouter}