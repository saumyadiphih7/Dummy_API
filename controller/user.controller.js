import User from "../model/user.model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error(`Name , Email and Password are required`);
  }
  const userExists = await User.findOne({ email: email });
  // console.log(userExists)
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error(`Email and Password are required`);
  }

  const user = await User.findOne({ email: email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      accessToken: accessToken,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found, please login again");
  }

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
    });
  } else {
    res.status(404);
    throw new Error(`${error}`);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found, please login again");
  }

  if (user) {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error(`${error}`);
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found, please login again");
  }

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } else {
    res.status(404);
    throw new Error(`${error}`);
  }
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error(`Name , Email and Password are required`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      message: "User created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user.id } });
  if (!users || users.length === 0) {
    res.status(404);
    throw new Error("No users found");
  }
  if (users) {
    res.json({
      message: "All users",
      data: users,
    });
  } else {
    res.status(404);
    throw new Error(`${error}`);
  }
});

const getSingleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user) {
    res.json({
      message: `User named ${user.name} found`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } else {
    res.status(404);
    throw new Error(`${error}`);
  }
});

const updateCreatedUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();

    res.json({
      message: `User named ${updatedUser.name} updated successfully`,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    });
  } else {
    res.status(404);
    throw new Error(`${error}`);
  }
});

const deleteCreatedUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user) {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error(`${error}`);
  }
});

export {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserProfile,
  createUser,
  getUsers,
  getSingleUser,
  updateCreatedUser,
  deleteCreatedUser,
};
