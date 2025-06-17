import express from "express";
import {
  createUser,
  deleteCreatedUser,
  deleteUser,
  getUserProfile,
  getUsers,
  loginUser,
  registerUser,
  updateCreatedUser,
  updateUser,
  getSingleUser,
} from "../controller/user.controller.js";
import authCheck from "../middleware/authCheck.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.put("/update", authCheck, updateUser);
userRouter.delete("/delete", authCheck, deleteUser);
userRouter.get("/profile", authCheck, getUserProfile);

//users created by user
userRouter.post("/create", authCheck, createUser);
userRouter.get("/users", authCheck, getUsers);
userRouter.get("/single-user/:id", authCheck, getSingleUser);
userRouter.put("/update/:id", authCheck, updateCreatedUser);
userRouter.delete("/delete/:id", authCheck, deleteCreatedUser);

export default userRouter;
