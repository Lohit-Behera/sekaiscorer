import mongoose, { Schema } from "mongoose";

const quizSchema = new Schema(
    {
    title: {
         type: String,
         required: true 
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy'
    },
    questions: {
        type: Array,
        required: true
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz