export default function approximateCoordinates({lat, lon}) {
    if (lat > 90 || lat < -90) throw new Error("Latitude out of range")
    if (lon > 180 || lon < -180) throw new Error("Longitude out of range")
    return `[${Number(lat).toFixed(2)},${Number(lon).toFixed(2)}]`
}