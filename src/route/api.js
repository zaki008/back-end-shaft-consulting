import express from "express";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
// @ts-ignore
const userRouter = new express.Router();
userRouter.use(authMiddleware);

userRouter.get("/api/users/list", userController.list);
userRouter.get("/api/user/current", userController.getUserCurrent);
userRouter.put("/api/user/current", userController.updateProfile);
userRouter.delete("/api/users/logout", userController.logout);
userRouter.get("/api/user/:usernameUser", userController.getUserByUsername);
export { userRouter };
