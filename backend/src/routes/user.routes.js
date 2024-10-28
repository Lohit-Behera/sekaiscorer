import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware.js";
import { resizeImage } from "../middlewares/resizeMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { userDetails } from "../controllers/userController.js";

const router = Router();

router.get("/details", authMiddleware, userDetails);

export default router