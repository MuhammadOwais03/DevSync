import userSchema from '../models/user.models.js';
import jwt from 'jsonwebtoken';
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { generateToken, generateAccessTokenFromRefreshToken } from '../utils/token.utils.js';


export const userRegistration = asyncHandler(async (req, res) => {
    const { email, fullName, password, password2 } = req.body;

    console.log(req.body)

    if ([email, fullName,  password, password2,].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const userExists = await userSchema.findOne({
        email: email
    });

    if (userExists) {
        throw new ApiError(400, "A user with this email already exists");
    }

    if (password !== password2) {
        throw new ApiError(400, "Passwords do not match");
    }

    const user = await userSchema.create({
        email: email,
        fullName: fullName,
        password: password,
             });

    const createdUser = await userSchema.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "An error occurred while creating the user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully")
    );
});


export const login = asyncHandler(async(req, res)=>{
    const { email, password } = req.body;
    console.log('user login', req.body)

    if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const userCheck = await userSchema.findOne({
        $or: [{ email: email }]
    });

    if (!userCheck) {
        throw new ApiError(400, "A user with this email doesnot exists");
    }

    const passCheck = await userCheck.comparePassword(password)

    if (!passCheck) {
        throw new ApiError(401, "Invalid User Cradentials")
    }

    const {accessToken, refreshToken} = await generateToken(userCheck._id,userCheck.email)
    

    const options = {
        httpOnly: true,
        secure: false,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: userCheck},
                "User Logged In Successfully"
            )
        );

})


export const check = asyncHandler( async (req, res)=>{

    const id = req.user._id
    console.log('user check', id)

    const user = await userSchema.findOne(id).select("-password")


    res.status(201).json(
        new ApiResponse(
            201,
            user,
            "user is authenticated"
        )
    )
})