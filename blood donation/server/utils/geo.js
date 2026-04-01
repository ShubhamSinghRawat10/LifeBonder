export function parseCoordinate(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function buildLocation(longitude, latitude) {
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    return undefined;
  }

  return {
    type: "Point",
    coordinates: [longitude, latitude],
  };
}
