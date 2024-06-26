import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

// .use is used for middlewares
app.use(cors({
    origin: process.env.CORS_ORIGION,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// router import

import {userRouter} from "./routes/user.routes.js"

// routes decleration
app.use("/api/v1/users", userRouter)

export { app }