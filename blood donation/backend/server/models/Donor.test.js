import test from "node:test";
import assert from "node:assert/strict";
import { Donor } from "./Donor.js";

test("donor model JSON is privacy-safe even outside the search controller", () => {
  const donor = new Donor({
    name: "Private Donor",
    email: "private@example.test",
    phone: "9876543210",
    age: 30,
    blood_group: "O+",
    state: "Delhi",
    city: "New Delhi",
    address: "Private address",
    location: { type: "Point", coordinates: [77.2, 28.6] },
    publicListingConsent: true,
    sharePhone: false,
  });
  const result = donor.toJSON();
  assert.deepEqual(result, {
    name: "Private Donor",
    blood_group: "O+",
    state: "Delhi",
    city: "New Delhi",
    isAvailable: true,
  });
});
