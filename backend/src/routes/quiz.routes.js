import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware.js";
import { resizeImage } from "../middlewares/resizeMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createQuiz, getQuiz } from "../controllers/quizController.js";

const router = Router();

router.post("/create", authMiddleware, upload.single("thumbnail"), resizeImage, createQuiz);

router.get("/get/:quizId", authMiddleware, createQuiz);

export default router