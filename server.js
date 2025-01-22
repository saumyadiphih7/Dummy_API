import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import errorHandler from "./helper/errorHandler.js";
import cors from "cors";


dotenv.config();


const app = express();

connectDB();

app.use(cors("*"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
import userRouter from "./route/user.route.js";
app.use("/api/user", userRouter);



app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


app.use(errorHandler);




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})