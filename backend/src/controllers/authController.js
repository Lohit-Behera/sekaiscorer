import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFile } from "../utils/cloudinary.js";
import Token from "../models/tokenModel.js";

const accessTokenOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 24 * 60 * 60 * 1000, 
};

const refreshTokenOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 60 * 24 * 60 * 60 * 1000,
};

// generate access token and refresh token
const generateTokens = async (userId, res) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(
                new ApiResponse(404, {}, "user not found")
            )
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        res.status(500).json(new ApiResponse(500, {}, "Something went wrong while generating tokens"));
    }
};

// Register user
const registerUser = asyncHandler(async (req, res) => {
    // get data from request
    const { username, email, fullName, password } = req.body

    // validate data
    if (!username || !email || !fullName || !password) {
        res.status(400).json(new ApiResponse(400, {}, "Please provide all fields"))
    }

    if (await User.findOne({ email })) {
        res.status(409).json(new ApiResponse(409, {}, "User with this email already exists"))
    }

    // check if user already exists
    if (await User.findOne({ username })) {
        res.status(409).json(new ApiResponse(409, {}, "User with this username or email already exists"))
    }
    
    // check for images
    const avatarFile = req.file
    if (!avatarFile) {
        res.status(400).json(new ApiResponse(400, {}, "Please provide an avatar"))
    }
    
    // upload images
    const avatarURL = await uploadFile(avatarFile)
    if (!avatarURL) {
        res.status(500).json(new ApiResponse(500, {}, "Something went wrong while uploading avatar"))
    }

    // create user
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatarURL
    })

    // check for error in creating user
    const userDetails = await User.findById(user._id).select("-password -refreshToken")

    if (!userDetails) {
        res.status(500).json(new ApiResponse(500, {}, "Something went wrong while creating user"))
    }
    
    // send response
    return res.status(201).json(
        new ApiResponse(201, {}, "User created successfully")
    )
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
    // get data from request
    const { username, email, password } = req.body

    // validate data
    if (!(username || email) || !password) {
        return res.status(400).json(
            new ApiResponse(400, {}, "Please provide username or email and password")
        )
    }

    // check if user exists
    const user = await User.findOne({ $or: [{ username }, { email }] })

    if (!user) {
        return res.status(401).json(
            new ApiResponse(401, {}, "Invalid credentials")
        )
    }
    
    // check if password is correct
    if (!await user.comparePassword(password)) {
        return res.status(401).json(
            new ApiResponse(401, {}, "Invalid credentials")
        )
    }

    // generate access token and refresh token
    const { accessToken, refreshToken } = await generateTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -coverImage -bio -website -plan ")

    // send response
    return res.status(200)
    .cookie("accessToken", accessToken, accessTokenOptions) 
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(
        new ApiResponse(200, loggedInUser, "Sign in successful")
    )
})

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,{
        $set: {
            refreshToken: null
        }
    }, {
        new: true
    })

    return res.status(200)
    .clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    })
    .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    })
    .json(
        new ApiResponse(200, {}, "Logout successful")
    )
})

// send verify email
const sendVerifyEmail = asyncHandler(async (req, res) => {
    const userId = req.user._id

    if (req.user.isVerified) {
        return res.status(400).json(new ApiResponse(400, {}, "Email already verified"))
    }

    const token = await Token.findOne({ user: userId })

    if (!token) {
        await Token.create({ user: userId })
    }

    const verificationToken = await Token.findOne({ user: userId })

    if (!verificationToken) {
        return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while generating verification token"))
    }

    const emailVerifyToken = verificationToken.generateVerifyEmailToken()

    if (!emailVerifyToken) {
        return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while generating email verification token"))
    }

    verificationToken.token = emailVerifyToken
    await verificationToken.save({ validateBeforeSave: false })

    const verifyEmailLink = `${req.protocol + '://' + req.get('host')}/api/v1/auth/verify-email/${userId}/${emailVerifyToken}`

    await sendEmail(req.user.email, "Verify Email", `
        <h1>Verify Email</h1>
        <p>Please click the link below to verify your email</p>
        <a href="${verifyEmailLink}">Verify Email</a>
    `);

    return res.status(200).json(new ApiResponse(200, {}, "Email verification link sent"))
})


// verify email
const verifyEmail = asyncHandler(async (req, res) => {
    const { userId, token } = req.params

    if (!userId || !token) {
        return res.status(400).json(new ApiResponse(400, {}, "Invalid verification link"))
    }

    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    const verifyEmailToken = await Token.findOne({ user: userId })

    if (!verifyEmailToken) {
        return res.status(404).json(new ApiResponse(404, {}, "Verification token not found"))
    }

    if (verifyEmailToken.token !== token) {
        return res.status(401).json(new ApiResponse(401, {}, "Invalid verification token"))
    }

    if (verifyEmailToken.token.toString() !== token.toString()) {
        return res.status(401).json(new ApiResponse(401, {}, "Invalid user"))
    }

    user.isVerified = true
    await user.save({ validateBeforeSave: false })

    await verifyEmailToken.deleteOne({ user: userId })

    return res.redirect(`${process.env.FRONTEND_URL}/?verified=true`)
})


export { registerUser, loginUser, logoutUser }