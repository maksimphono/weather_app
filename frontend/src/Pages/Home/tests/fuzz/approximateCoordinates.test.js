import approximateCoordinates from "../../utils/approximateCoordinates"

describe("Fuzz test approximateCoordinates", () => {
    const generateRandomInput = () => {
        return {lat : Math.floor(Math.random() * (180 + 180 + 1)) - 180, lon : Math.floor(Math.random() * (180 + 180 + 1)) - 180}
    }
    it("Test approximateCoordinates", () => {
        for (let i = 0; i < 500; i++) {
            const coords = generateRandomInput()
            if (coords.lat > 90 || coords.lat < -90 || coords.lon > 180 || coords.lon < -180) {
                expect(() => approximateCoordinates(coords)).toThrow()
            } else {
                expect(approximateCoordinates(coords)).toBe(`[${Number(coords.lat).toFixed(2)},${Number(coords.lon).toFixed(2)}]`)
            }
        }
    })
})