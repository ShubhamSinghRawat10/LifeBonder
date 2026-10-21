import test from "node:test";
import assert from "node:assert/strict";
import { toPublicDonor } from "./publicDonor.js";

const record = {
  _id: { toString: () => "donor-123" },
  name: "Donor Name",
  email: "private@example.test",
  phone: "+911234567890",
  address: "Private street address",
  age: 34,
  gender: "other",
  blood_group: "O+",
  state: "Delhi",
  city: "New Delhi",
  last_donation: new Date("2025-01-01"),
  location: { type: "Point", coordinates: [77.2, 28.6] },
  isAvailable: true,
  sharePhone: false,
  passwordHash: "must-not-appear",
};

test("public donor results exclude private identity, contact, health, and location fields by default", () => {
  const result = toPublicDonor(record);
  assert.deepEqual(result, {
    name: "Donor Name",
    blood_group: "O+",
    state: "Delhi",
    city: "New Delhi",
    isAvailable: true,
  });
  for (const key of ["id", "_id", "email", "address", "age", "gender", "last_donation", "location", "latitude", "longitude", "passwordHash", "phone"]) {
    assert.equal(Object.hasOwn(result, key), false, `${key} must not be public`);
  }
});

test("phone is included only when the donor explicitly opted in", () => {
  assert.equal(toPublicDonor({ ...record, sharePhone: true }).phone, undefined);
  assert.equal(toPublicDonor({ ...record, sharePhone: true }, { includePhone: true }).phone, record.phone);
});
