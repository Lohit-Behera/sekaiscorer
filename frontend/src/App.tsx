import { ThemeProvider } from "@/components/theme-provider";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import AuthRoutes from "./components/AuthRoutes";

import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CreateQuizPage from "./pages/CreateQuizPage";
import QuizPage from "./pages/QuizPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/quiz/:quizId" element={<QuizPage />} />

      {/* Auth Routes */}
      <Route
        index
        element={
          <AuthRoutes>
            <HomePage />
          </AuthRoutes>
        }
      />
      <Route
        path="/create/quiz"
        element={
          <AuthRoutes>
            <CreateQuizPage />
          </AuthRoutes>
        }
      />
    </Route>
  )
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster richColors />
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  );
}

export default App;
