import approximateCoordinates from "../../utils/approximateCoordinates";

describe.skip("Testing approximateCoordinates", () => {
    // regular inputs
    it("Test 1", () => {
        const result = approximateCoordinates({lat : 1, lon : 9})
        expect(result).toBe("[1.00,9.00]")
    })
    it("Test 2", () => {
        const result = approximateCoordinates({lat : 1.672, lon : 9.001})
        expect(result).toBe("[1.67,9.00]")
    })
    it("Test 3", () => {
        const result = approximateCoordinates({lat : 1, lon : 9.499})
        expect(result).toBe("[1.00,9.50]")
    })
    it("Test 4", () => {
        const result = approximateCoordinates({lat : 1.499, lon : 9.5})
        expect(result).toBe("[1.50,9.50]")
    })
    it("Test 5", () => {
        const result = approximateCoordinates({lat : 1.0059, lon : 9.987})
        expect(result).toBe("[1.01,9.99]")
    })
    // incorrect inputs:
    it("Test 6", () => {
        expect(approximateCoordinates({lat : -90.004, lon : 180})).toBe("[-90.00,180.00]")
    })
    it("Test 7", () => {
        expect(approximateCoordinates({lat : 90.009, lon : -180})).toThrow(ValueError)
    })
    it("Test 8", () => {
        expect(approximateCoordinates({lat : 90, lon : -180.004})).toBe("[90.00,-180.00]")
    })
    it("Test 9", () => {
        expect(approximateCoordinates({lat : 90, lon : -180.005})).toThrow(ValueError)
    })
    it("Test 10 absolutely incorrect", () => {
        expect(approximateCoordinates({lat : 190, lon : -280.005})).toThrow(ValueError)
    })
})