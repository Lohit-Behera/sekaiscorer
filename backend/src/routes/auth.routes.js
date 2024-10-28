import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { resizeImage } from "../middlewares/resizeMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", upload.single("avatar"), resizeImage, registerUser);

router.post("/login", loginUser);

router.get("/logout", authMiddleware, logoutUser);

export default router;