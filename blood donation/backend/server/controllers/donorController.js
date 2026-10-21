import { Donor } from "../models/Donor.js";
import { buildLocation, parseCoordinate } from "../utils/geo.js";
import { toPublicDonor } from "../utils/publicDonor.js";

export async function createDonor(req, res) {
  const body = req.body || {};
  if (body.publicListingConsent !== true) {
    return res.status(400).json({ message: "Consent to appear in the donor directory is required." });
  }
  const longitude = parseCoordinate(body.longitude);
  const latitude = parseCoordinate(body.latitude);
  if ((body.longitude != null || body.latitude != null) &&
      buildLocation(longitude, latitude) === undefined) {
    return res.status(400).json({ message: "Please provide valid latitude and longitude coordinates." });
  }

  if (body.sharePhone === true && !body.phone) {
    return res.status(400).json({ message: "Add a phone number to enable direct contact." });
  }
  const allowedFields = ["name", "email", "phone", "age", "blood_group", "state", "city"];
  const donorData = Object.fromEntries(allowedFields.map((field) => [field, body[field]]));
  if (body.sharePhone !== true) donorData.phone = undefined;
  const donor = await Donor.create({
    ...donorData,
    location: buildLocation(longitude, latitude),
    publicListingConsent: true,
    sharePhone: body.sharePhone === true,
  });

  // Never echo registration data, credentials, contact information, or location.
  res.status(201).json({ id: donor.id, message: "Donor registration received." });
}

export async function searchDonors(req, res) {
  const searchParams = req.method === "POST" ? req.body || {} : req.query;
  const { state, city, blood_group, distance, latitude, longitude } = searchParams;
  if (req.method === "GET" && (latitude !== undefined || longitude !== undefined)) {
    return res.status(400).json({ message: "Location searches must use the private POST endpoint." });
  }
  const maxDistanceKm = distance === undefined ? 10 : Number(distance);
  if (!Number.isFinite(maxDistanceKm) || maxDistanceKm <= 0 || maxDistanceKm > 500) {
    return res.status(400).json({ message: "Distance must be between 1 and 500 km." });
  }
  const lat = req.method === "POST" ? parseCoordinate(latitude) : null;
  const lng = req.method === "POST" ? parseCoordinate(longitude) : null;
  if ((latitude !== undefined || longitude !== undefined) &&
      buildLocation(lng, lat) === undefined) {
    return res.status(400).json({ message: "Please provide valid latitude and longitude coordinates." });
  }

  const filters = {
    isAvailable: true,
    publicListingConsent: true,
    ...(state ? { state } : {}),
    ...(city ? { city } : {}),
    ...(blood_group ? { blood_group } : {}),
  };

  let donors;

  if (lat !== null && lng !== null) {
    donors = await Donor.find({
      ...filters,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: maxDistanceKm * 1000,
        },
      },
    }).lean();
  } else {
    donors = await Donor.find(filters).sort({ createdAt: -1 }).lean();
  }

  // Search is public: return only information needed to identify and contact a match.
  const normalized = donors.map((donor) =>
    toPublicDonor(donor, { includePhone: req.method === "POST" })
  );

  res.json(normalized);
}
