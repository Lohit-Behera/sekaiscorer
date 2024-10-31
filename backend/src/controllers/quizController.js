import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFile } from "../utils/cloudinary.js";
import User from "../models/userModel.js";
import Quiz from "../models/quizModel.js";

const createQuiz = asyncHandler(async (req, res) => {
    // get data from req.body
    const { title, description, category, difficulty, questions } = req.body;
    
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
        } else if (!question.options.includes(question.correctAnswer)) {
            return res.status(400).json(new ApiResponse(400, {}, "Correct answer must be one of the options"))
        }
    })

    // get thumbnail from req.files
    const thumbnailFile = req.file

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
        createdBy: user
    })

    // validate if quiz is created
    const quiz = await Quiz.findById(createdQuiz._id)

    if (!quiz) {
        return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while creating quiz"))
    }

    // send response
    res.status(201).json(new ApiResponse(201, {}, "Quiz created successfully"))
})

const getQuiz = asyncHandler(async (req, res) => {
    // get id from params
    const { quizId } = req.params

    // get quiz
    const quiz = await Quiz.aggregate(
        [
            {
              $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "user"
              }
            },
            {
              $unwind: "$user",
            },
            {
              $project: {
                _id: 1,
                title: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                thumbnail: 1,
                category: 1,
                difficulty: 1,
                "createdBy": "$user.fullName"
              }
            }
          ]
    )

    if (!quiz) {
        return res.status(404).json(new ApiResponse(404, {}, "Quiz not found"))
    }

    // send response
    res.status(200).json(new ApiResponse(200, quiz[0], "Quiz fetched successfully"))
})

const getAllQuizzes = asyncHandler(async (req, res) => {

    // option for pagination
    const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
    }

    // get all quizzes
    const aggregate = Quiz.aggregate(
        [
            {
              $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "user"
              }
            },
            {
              $unwind: "$user",
            },
            {
              $project: {
                _id: 1,
                title: 1,
                createdAt: 1,
                thumbnail: 1,
                category: 1,
                difficulty: 1,
                "createdBy": "$user.fullName"
              }
            }
        ]
    )

    const quizzes = await Quiz.aggregatePaginate(aggregate, options)

    if (!quizzes) {
        return res.status(404).json(new ApiResponse(404, {}, "Quizzes not found"))
    }

    // send response
    res.status(200).json(new ApiResponse(200, quizzes, "Quizzes fetched successfully"))
})

export { createQuiz, getQuiz, getAllQuizzes }