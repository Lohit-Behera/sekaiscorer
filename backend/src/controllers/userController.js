import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const userDetails = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken")

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    res.status(200).json(new ApiResponse(200, user, "User fetched successfully"))
})

export { userDetails }