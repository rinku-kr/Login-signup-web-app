import express from "express";
import registerUser from "../controllers/userController.js";

const router = express.Router();

// router.post("/register", registerUser);
router.route("/register").post(registerUser);

export default router;
