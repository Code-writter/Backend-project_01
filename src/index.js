// require('dotenv').config({path: './env'}) //Another way of using
import dotenv from "dotenv" // to use import we have to add {-r dotenv/config --experimental-jason-modules} in package.json
// import mongoose from "mongoose"
// import { DB_NAME } from "./constants";
import connectDB from "./db/index.js";

//other way to connect dotenv
dotenv.config({
    path:'./env'
})


connectDB()



/*
Approch -> 1

import express from "express"

const app = express();

;( async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        app.on("Error : ", (error) => {
            console.log("Error : ", error)
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("Error : ",error)
        throw error
    }
} )()
*/