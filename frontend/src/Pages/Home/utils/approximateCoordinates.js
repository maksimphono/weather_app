export default function approximateCoordinates({lat, lon}) {
    return `[${Number(lat).toFixed(2)},${Number(lon).toFixed(2)}]`
}