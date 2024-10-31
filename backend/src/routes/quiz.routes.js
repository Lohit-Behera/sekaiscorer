import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware.js";
import { resizeImage } from "../middlewares/resizeMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createQuiz, getQuiz, getAllQuizzes} from "../controllers/quizController.js";

const router = Router();

router.post("/create", authMiddleware, upload.single("thumbnail"), resizeImage, createQuiz);

router.get("/get/:quizId", authMiddleware, getQuiz);

router.get("/all", authMiddleware, getAllQuizzes);

export default router