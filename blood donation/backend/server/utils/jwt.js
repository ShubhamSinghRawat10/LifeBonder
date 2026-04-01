import jwt from "jsonwebtoken";

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "development-secret", {
    expiresIn: "7d",
  });
}
