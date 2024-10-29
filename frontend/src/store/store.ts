import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/features/AuthSlice";
import quizSlice from "@/features/QuizSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    quiz: quizSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
