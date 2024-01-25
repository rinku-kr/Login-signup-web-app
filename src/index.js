import dotenv from "dotenv";
import app from "./app.js";
import connectDb from "./db/database.js";

dotenv.config({
  path: "./.env",
});

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`MONGODB CONNECTION IS FAILED !`, err);
  });

// import express from "express";
// const app = express();

// (async () => {
//   try {
//    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

//     app.on("error", (err) => {
//       console.log("ERROR: ", err);
//       throw err
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`App is listening on port${PORT}`);
//     });
//   } catch (err) {
//     console.error("ERROR: ", err);
//   }
// })();
