// src/components/dashboard/map/utils.ts
export function toGeoJSON(reports: any[]) {
  return {
    type: "FeatureCollection",
    features: reports
      .filter((r) => {
        const lat = parseFloat(r.latitude);
        const lon = parseFloat(r.longitude);
        return Number.isFinite(lat) && Number.isFinite(lon);
      })
      .map((r) => ({
        type: "Feature",
        id: r.report_id,
        properties: {
          report_id: r.report_id,
          type: r.report_type,
          subtype: r.damage_type || r.assistance_type || r.srhr_type || "other",
          status: r.status,
          created_at: r.created_at,
          title: r.location,
          description: r.description,
          phone_number: r.phone_number,
        },
        geometry: {
          type: "Point",
          coordinates: [parseFloat(r.longitude), parseFloat(r.latitude)],
        },
      })),
  };
}

export function toCSVData(reports: any[]) {
  return reports.map((r) => ({
    ID: r.report_id,
    Type: r.report_type,
    Subtype: r.damage_type || r.assistance_type || r.srhr_type || "other",
    Status: r.status,
    Description: r.description,
    Location: r.location,
    Phone: r.phone_number,
    Created: r.created_at,
    Latitude: r.latitude,
    Longitude: r.longitude,
  }));
}

export const capitalizeLabel = (str: string) =>
  str
    .replaceAll("_", " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");




    