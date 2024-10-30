import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "@/lib/Proxy";
import { Question } from "@/pages/CreateQuizPage";

type Quiz = {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  thumbnail: File;
  questions: Question[];
};

type GetQuiz = {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    thumbnail: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  };
};

export const fetchCreateQuiz = createAsyncThunk(
  "create/quiz",
  async (quiz: Quiz, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/quizzes/create`,
        quiz,
        config
      );
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchGetQuiz = createAsyncThunk(
  "get/quiz",
  async (id: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/quizzes/get/${id}`,
        config
      );
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    createQuiz: { data: {} },
    createQuizStatus: "idle",
    createQuizError: {},

    getQuiz: null as GetQuiz | null,
    getQuizStatus: "idle",
    getQuizError: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateQuiz.pending, (state) => {
        state.createQuizStatus = "loading";
      })
      .addCase(fetchCreateQuiz.fulfilled, (state, action) => {
        state.createQuizStatus = "succeeded";
        state.createQuiz = action.payload;
      })
      .addCase(fetchCreateQuiz.rejected, (state, action) => {
        state.createQuizStatus = "failed";
        state.createQuizError = action.payload || "Create quiz failed";
      })

      .addCase(fetchGetQuiz.pending, (state) => {
        state.getQuizStatus = "loading";
      })
      .addCase(fetchGetQuiz.fulfilled, (state, action) => {
        state.getQuizStatus = "succeeded";
        state.getQuiz = action.payload;
      })
      .addCase(fetchGetQuiz.rejected, (state, action) => {
        state.getQuizStatus = "failed";
        state.getQuizError = action.payload || "Get quiz failed";
      });
  },
});

export default quizSlice.reducer;
