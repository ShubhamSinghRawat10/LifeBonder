import test from "node:test";
import assert from "node:assert/strict";
import { rateLimit } from "./rateLimit.js";

test("rate limiter blocks requests above its configured limit", () => {
  const middleware = rateLimit({ windowMs: 60_000, maxRequests: 1 });
  const response = () => ({
    statusCode: 200,
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  });
  const request = { ip: "test-client", socket: {} };
  const first = response();
  let passed = false;
  middleware(request, first, () => { passed = true; });
  assert.equal(passed, true);
  const second = response();
  middleware(request, second, () => { passed = true; });
  assert.equal(second.statusCode, 429);
  assert.equal(second.headers["RateLimit-Remaining"], "0");
});
