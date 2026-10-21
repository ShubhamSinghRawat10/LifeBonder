// Explicit allowlist for the donor directory. Never include internal fields here.
export function toPublicDonor(donor, { includePhone = false } = {}) {
  return {
    name: donor.name,
    blood_group: donor.blood_group,
    state: donor.state,
    city: donor.city,
    isAvailable: donor.isAvailable,
    ...(includePhone && donor.sharePhone === true ? { phone: donor.phone } : {}),
  };
}
