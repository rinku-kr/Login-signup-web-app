import express from "express";
import registerUser from "../controllers/userController.js";
import upload from "../middlewares/multerMiddleware.js";

const router = express.Router();

// router.post("/register", registerUser);
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

export default router;
