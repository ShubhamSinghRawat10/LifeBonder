export function parseCoordinate(value) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function buildLocation(longitude, latitude) {
  if (
    !Number.isFinite(longitude) || longitude < -180 || longitude > 180 ||
    !Number.isFinite(latitude) || latitude < -90 || latitude > 90
  ) {
    return undefined;
  }

  return {
    type: "Point",
    coordinates: [longitude, latitude],
  };
}
