import { prismaClient } from "../application/database.js";

export const authMiddleware = async (req, res, next) => {
  // const token = req.get("Authorization");
  const token = req.headers["authorization"];
  if (!token) {
    res
      .status(401)
      .json({
        errors: "Unauthorized",
      })
      .end();
    return;
  }
  const tokenwithoutBearear = token.replace("Bearer ", "");
  const user = await prismaClient.user.findFirst({
    where: {
      token: tokenwithoutBearear,
    },
  });
  if (!user) {
    res
      .status(401)
      .json({
        errors: "Unauthorized",
      })
      .end();
    return;
  } else {
    req.user = user;
    next();
  }
};
