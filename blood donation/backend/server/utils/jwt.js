import jwt from "jsonwebtoken";

export function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be configured in production.");
  }
  return jwt.sign(payload, secret || "development-secret", {
    expiresIn: "7d",
  });
}
