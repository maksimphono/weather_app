function adjust3hIntervalAfterAnchorTime() {
    /* That function logic: 
        Take 12 AM (noon) of the next day (in locale form),
        calculate start time of the next 3-hours interval (in ISO format),
        and return string in form of "2024-11-22 06:00:00" so I can extract
        starting time (in ISO format) of the 3-hours interval that comes after tomorrow's noon
    */
    let getISOHours = (isodate) => isodate.slice(11, 13)
    const adjust = s => {if (s.length === 1) return "0" + s; else return s;}
    const nextNoon = new Date()
    nextNoon.setDate(nextNoon.getDate() + 1)
    nextNoon.setHours(12, 0, 0, 0)
    console.log(Math.ceil(parseInt(getISOHours(nextNoon.toISOString())) / 3))
    return adjust((3 * Math.ceil(parseInt(getISOHours(nextNoon.toISOString())) / 3)).toString(
}

describe("Teting nextNoon", () => {
    it("Test 1", () => {
        const anchorTime = adjust3hIntervalAfterAnchorTime().slice(-8, -6)

        expect(anchorTime).toBe("06")
    })
})