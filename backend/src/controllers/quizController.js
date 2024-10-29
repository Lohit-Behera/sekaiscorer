import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFile } from "../utils/cloudinary.js";
import User from "../models/userModel.js";
import Quiz from "../models/quizModel.js";

const createQuiz = asyncHandler(async (req, res) => {
    // get data from req.body
    const { title, description, category, difficulty, questions } = req.body;
    console.log(title, description, category, difficulty, questions);
    console.log(typeof questions[0].correctAnswer);
    

    // validate data
    if (!title || !description || !category || !difficulty || !questions) {
        return res.status(400).json(new ApiResponse(400, {}, "All fields are required"))
    }

    if (questions.length < 5) {
        return res.status(400).json(new ApiResponse(400, {}, "At least 5 questions are required"))
    }

    if (questions.length > 20) {
        return res.status(400).json(new ApiResponse(400, {}, "At most 20 questions are required"))
    }

    questions.map((question) => {
        if (!question.questionText || !question.options || !question.correctAnswer) {
            return res.status(400).json(new ApiResponse(400, {}, "All fields are required in questions"))
        } else if (question.options.length < 2) {
            return res.status(400).json(new ApiResponse(400, {}, "At least 2 options are required"))
        } else if (question.options.length !== new Set(question.options).size) {
            return res.status(400).json(new ApiResponse(400, {}, "Options must be unique"))
        } else if (Number(question.correctAnswer) < 0 || Number(question.correctAnswer) >= Number(question.options).length) {
            return res.status(400).json(new ApiResponse(400, {}, "Correct answer must be between 0 and number of options"))
        }
    })

    // get thumbnail from req.files
    const thumbnailFile = req.file

    console.log(thumbnailFile);
    

    // validate thumbnail
    if (!thumbnailFile) {
        return res.status(400).json(new ApiResponse(400, {}, "Thumbnail is required"))
    }

    // upload thumbnail to cloudinary
    const thumbnailURL = await uploadFile(thumbnailFile)
    if (!thumbnailURL) {
        return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while uploading thumbnail"))
    }
    
    // get user from req.user
    const user = await User.findById(req.user._id)

    // save data to database
    const createdQuiz = await Quiz.create({
        title,
        description,
        category,
        difficulty,
        questions,
        thumbnail: thumbnailURL,
        user: user._id
    })

    // validate if quiz is created
    const quiz = await Quiz.findById(createdQuiz._id)

    if (!quiz) {
        return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while creating quiz"))
    }

    // send response
    res.status(201).json(new ApiResponse(201, {}, "Quiz created successfully"))
})

export { createQuiz }