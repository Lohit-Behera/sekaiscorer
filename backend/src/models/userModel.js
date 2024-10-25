import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        avatar: {
            type: String,
            required: true
        },
        totalPoints: {
            type: Number,
            required: true,
            default: 0
        },
        plan: {
            type: String,
            enum: ["free", "pro"],
            default: "free"
        },


    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User