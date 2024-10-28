import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/userModel.js";


function isTokenExpired(token) {
    try {
        const decoded = jwt.decode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
        
    } catch (err) {
        return true;
    }
}

export const authMiddleware = asyncHandler(async (req, res, next) => {
    try {
        let token = req.cookies.accessToken || "";
        
        const isAccessTokenExpired = isTokenExpired(token);

        if (!req.cookies.accessToken || isAccessTokenExpired) {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json(new ApiResponse(401, {}, "You are not Unauthorized"));
            }
            const isRefreshTokenExpired = isTokenExpired(refreshToken);
            if (isRefreshTokenExpired) {
                return res.status(401).json(new ApiResponse(401, {}, "Refresh token expired"));
            }

            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json(new ApiResponse(401, {}, "invalid token"));
            }

            const newAccessToken = user.generateAccessToken();
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 24 * 60 * 60 * 1000,
            });
            const newRefreshToken = user.generateRefreshToken();
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            token = newAccessToken;
        }

        if (!token) {
            return res.status(401).json(new ApiResponse(401, {}, "You are not Unauthorized"));
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json(new ApiResponse(401, {}, "invalid token user not found"));
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json(new ApiResponse(401, error.message, "invalid token auth middleware"));
    }
});