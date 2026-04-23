import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

export async function authenticate(request, response, next) {
  const authorizationHeader = request.headers.authorization ?? "";
  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return response.status(401).json({
      message: "Authentication required.",
    });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(payload.sub);

    if (!user) {
      return response.status(401).json({
        message: "The authenticated user no longer exists.",
      });
    }

    request.user = user;
    next();
  } catch {
    return response.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
}
