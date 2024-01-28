import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
} from "../controllers/userController.js";
import upload from "../middlewares/multerMiddleware.js";
import { verifyJwt } from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.post("/register", registerUser);
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJwt, changeCurrentPassword);
router.route("current-user").get(verifyJwt, getCurrentUser);
router.route("/update-account").patch(verifyJwt, updateAccountDetails);
router
    .route("/avatar")
    .patch(verifyJwt, upload.single("avatar"), updateUserAvatar);
router
    .route("/cover-image")
    .patch(verifyJwt, upload.single("coverImage"), updateUserCoverImage);
router.route("/channel/:username").get(verifyJwt, getUserChannelProfile);
router.route("/history/:username").get(verifyJwt, getWatchHistory);

export default router;
