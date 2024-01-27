import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import User from "../models/userModel.js";
import uploadOnCloudinary from "../../utils/cloudinary.js";
import ApiResponse from "../../utils/ApiResponse.js";

// Generate access token and refresh token!
const generateAccesstokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const getAccessToken = user.generateAccessToken();
    const getRefreshToken = user.generateRefreshToken();

    user.refreshToken = getRefreshToken;
    await getRefreshToken.save({ validateBeforeSave: false });

    return { getAccessToken, getRefreshToken };
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong, While generating access token & refresh token"
    );
  }
};

// Register user!
const registerUser = asyncHandler(async (req, res) => {
  // Get user details from frontend!
  // Validation - not empty!
  // check if user already exists: username email!
  // check for images & avatar!
  // Upload them to cloudinary, avatar!
  // Create user object, create entry in db!
  // Remove password & refreshToken fields from response!
  // check for user Creating!
  // return res!
  const { fullName, username, email, password } = req.body;

  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new ApiError(409, "username & email already exists");
  }

  //   console.log(req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //   const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.lenght > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar files is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(404, "Avatar files is required");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong, While registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register successfully"));
});

// Login user!
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [
      {
        username,
      },
      {
        email,
      },
    ],
  });
  if (!user) {
    throw new ApiError(404, "User does not exits");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { getAccessToken, getRefreshToken } =
    await generateAccesstokenAndRefreshToken(user._id);

  const loggedInuser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", getAccessToken, options)
    .cookie("refreshToken", getRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInuser, getAccessToken, getRefreshToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User logged out"))
});
export { registerUser, loginUser, logoutUser };
