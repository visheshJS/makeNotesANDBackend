import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.js";

const generateAccessandRefreshToken= async (userId)=>{
    try{
        const user = await User.findById(userId);
        const accessToken= user.generateAccessToken();
        const refreshToken= user.generateRefreshToken();
        user.refreshToken= refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};

    }catch(error){
        console.log(error);
    }

}

const registerUser= asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body;

    if(!name || !email || !password){
        throw new ApiError(400,"Please provide all fields");
    }

    //check if the user already exists

    const existingUser= await User.findOne({
        $or: [{name }, { email }]

    })

    if(existingUser){
        throw new ApiError(409,"User already exists");
    }


    //hash the password: it will be hashed automaticaly when creating new user
    //as we have used bcrypt already in the user.js in models folder

    const user= new User({
        name,
        email,
        password
    });

    await user.save();

    //generate refresh and access token

    const accessToken= user.generateAccessToken();
    const refreshToken= user.generateRefreshToken();

    // Send response
    // Send response
    res.status(201).json(
        new ApiResponse(201, "User registered successfully", {
            id: user._id,
            name: user.name,
            email: user.email,
            accessToken,
            refreshToken,
        })
    );





})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if(!(email||password)){
        throw new ApiError(400, "Email and password are required");
    }


    //find the user if it exists

    const user= await User.findOne({email});

    if(!user){
        throw new ApiError(404, "User not found");
    }

    //if email found, then validate the password

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password");
    }

    const {accessToken, refreshToken}= await generateAccessandRefreshToken(user._id);

    const loggedInUser= await User.findById(user._id).select("-password -refreshToken");

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
        new ApiResponse(200,{
            user: loggedInUser, accessToken, refreshToken
        },
        "user logged in successfully"

    ))




})

const logOutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate( req.user.id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options= {
        httpOnly:true,
        secure:true

    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"))

})

export { registerUser, loginUser, logOutUser };
