import test from "node:test";
import assert from "node:assert/strict";
import { User } from "./User.js";

test("user JSON never includes the password hash", () => {
  const user = new User({
    name: "Private User",
    email: "private@example.test",
    passwordHash: "hashed-secret",
  });
  const result = user.toJSON();
  assert.equal(result.email, "private@example.test");
  assert.equal(Object.hasOwn(result, "passwordHash"), false);
  assert.equal(Object.hasOwn(result, "_id"), false);
  assert.equal(Object.hasOwn(result, "__v"), false);
});
