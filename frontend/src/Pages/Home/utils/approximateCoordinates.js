export default function approximateCoordinates({lat, lon}) {
    const floor2 = x => Math.floor(x * 100) / 100
    return `${floor2(lat)},${floor2(lon)}`
}