import { Donor } from "../models/Donor.js";
import { buildLocation, parseCoordinate } from "../utils/geo.js";

export async function createDonor(req, res) {
  const longitude = parseCoordinate(req.body.longitude);
  const latitude = parseCoordinate(req.body.latitude);

  const donor = await Donor.create({
    ...req.body,
    location: buildLocation(longitude, latitude),
  });

  res.status(201).json(donor.toJSON());
}

export async function searchDonors(req, res) {
  const { state, city, blood_group, distance, latitude, longitude } = req.query;
  const maxDistanceKm = Number(distance) || 10;
  const lat = parseCoordinate(latitude);
  const lng = parseCoordinate(longitude);

  const filters = {
    isAvailable: true,
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

  const normalized = donors.map((donor) => {
    const json = { ...donor, id: donor._id.toString() };
    delete json._id;
    delete json.__v;
    if (json.location?.coordinates?.length === 2) {
      json.longitude = json.location.coordinates[0];
      json.latitude = json.location.coordinates[1];
    }
    return json;
  });

  res.json(normalized);
}
