const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;

// const asyncHandler = (requestHandler) => {
//   async (req, res, nex) => {
//     try {
//       await requestHandler(req, res, next);
//     } catch (err) {
//       res.status(err.code || 500).json({
//         success: false,
//         mesage: err.mess,
//       });
//     }
//   };
// };
