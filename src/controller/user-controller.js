import userService from "../service/user-service.js";

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    res.status(200).json({
      data: result,
      message: "User Create be Succesfully",
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({
      data: {
        username: result.username,
        first_name: result.first_name,
        last_name: result.last_name,
      },
      token: result.token,
      message: "Login is Succesfully",
    });
  } catch (e) {
    next(e);
  }
};

const list = async (req, res, next) => {
  try {
    const request = req.query;
    const result = await userService.list(request);
    res.status(200).json({
      paging: result.paging,
      data: result.data,
    });
  } catch (e) {
    next(e);
  }
};

const getUserByUsername = async (req, res, next) => {
  try {
    const usernameUser = req.params.usernameUser;
    const result = await userService.getUserByUsername(usernameUser);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getUserCurrent = async (req, res, next) => {
  try {
    const username = req.user.username;
    console.log("username", username);
    const result = await userService.getCurrentUser(username);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const username = req.user.username;
    const request = req.body;
    const result = await userService.updateProfile(username, request);
    res.status(200).json({
      data: result,
      message: "Update Profile is Succesfully",
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const result = await userService.logout(req.user.username);
    res.status(200).json({
      data: "Sukses Logout",
    });
  } catch (e) {
    next(e);
  }
};

export default {
  register,
  login,
  list,
  getUserByUsername,
  getUserCurrent,
  updateProfile,
  logout,
};
