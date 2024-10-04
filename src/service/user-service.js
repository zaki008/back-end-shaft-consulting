import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
  searchUserValidation,
  updateUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, "Username already exists");
  }

  user.password = await bcrypt.hash(user.password, 10);

  return prismaClient.user.create({
    data: {
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      password: user.password,
    },
    select: {
      username: true,
      first_name: true,
      last_name: true,
    },
  });
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username,
    },
    select: {
      username: true,
      first_name: true,
      last_name: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Username or Password is Wrong");
  }

  const isPassword = await bcrypt.compare(loginRequest.password, user.password);
  if (!isPassword) {
    throw new ResponseError(401, "Username or Password is Wrong");
  }
  const JWT_SECRET = "hayZak08";
  const token = jwt.sign(
    {
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return prismaClient.user.update({
    data: {
      username: user.username,
      token: token,
      first_name: user.first_name,
      last_name: user.last_name,
    },
    where: {
      username: user.username,
    },
    select: {
      token: true,
      username: true,
      first_name: true,
      last_name: true,
    },
  });
};

const list = async (request) => {
  request = validate(searchUserValidation, request);
  const skip = (request.page - 1) * request.size;
  const filter = [];

  if (request?.username) {
    filter.push({
      username: {
        contains: request.username,
      },
    });
  }

  if (request?.last_name) {
    filter.push({
      last_name: {
        contains: request.last_name,
      },
    });
  }

  if (request?.first_name) {
    filter.push({
      first_name: {
        contains: request.first_name,
      },
    });
  }

  const users = await prismaClient.user.findMany({
    where: {
      AND: filter,
    },
    select: {
      username: true,
      first_name: true,
      last_name: true,
    },
    take: request.size,
    skip: skip,
  });

  const totalItems = await prismaClient.user.count({
    where: {
      AND: filter,
    },
  });

  return {
    data: users,
    paging: {
      page: request.page,
      total_item: totalItems,
      total_page: Math.ceil(totalItems / request.size),
    },
  };
};

const getUserByUsername = async (usernameUser) => {
  usernameUser = validate(getUserValidation, usernameUser);

  const user = prismaClient.user.findUnique({
    where: {
      username: usernameUser,
    },
    select: {
      username: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      gender: true,
    },
  });
  if (!user) {
    throw new ResponseError(404, "user is not found");
  }
  return user;
};

const getCurrentUser = async (username) => {
  console.log("username", username);
  username = validate(getUserValidation, username);

  const user = prismaClient.user.findUnique({
    where: {
      username: username,
    },
    select: {
      username: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      gender: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "user is not found");
  }

  return user;
};

const updateProfile = async (username, request) => {
  const user = validate(updateUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      username: username,
    },
  });

  if (countUser === 0) {
    throw new ResponseError(404, "user is not found");
  }

  console.log("gender", user.gender);

  const data = {};
  if (user.first_name) {
    data.first_name = user.first_name;
  }
  if (user.last_name) {
    data.last_name = user.last_name;
  }
  if (user.email) {
    data.email = user.email;
  }
  if (user.phone) {
    data.phone = user.phone;
  }
  if (user.gender == 0 || user.gender == 1) {
    data.gender = user.gender;
  }
  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }

  console.log("data", data);

  return prismaClient.user.update({
    where: {
      username: username,
    },
    data: data,
    select: {
      username: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      gender: true,
    },
  });
};

const logout = async (username) => {
  username = validate(getUserValidation, username);

  const user = prismaClient.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User Not Found");
  }

  return prismaClient.user.update({
    where: {
      username: username,
    },
    data: {
      token: null,
    },
    select: {
      username: true,
    },
  });
};

export default {
  register,
  login,
  list,
  getUserByUsername,
  getCurrentUser,
  updateProfile,
  logout,
};
