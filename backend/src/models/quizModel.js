import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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
    thumbnail: {
        type: String
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
quizSchema.plugin(mongooseAggregatePaginate);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz