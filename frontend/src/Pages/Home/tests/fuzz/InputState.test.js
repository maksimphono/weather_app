import { InputState } from "../../Context/inputState"

describe("Fuzz testing of InputState class", () => {
    const generateRandomInput = () => {
        return {
            city: Math.random().toString(36).substring(7),
            country: Math.random().toString(36).substring(2),
            lat: Math.floor(Math.random() * (180 + 180 + 1)) - 180,
            lon: Math.floor(Math.random() * (360 + 360 + 1)) - 360,
        }
    }
    const generateRandomInValidInput = () => {
        return {
            city: (Math.random() > .5)?"Moscow":"",
            country: Math.random().toString(36).substring(2),
            lat: Math.floor(Math.random() * (90 + 90 + 1)) - 90 + 91 * (Math.random() > .5)?(-1):1,
            lon: Math.floor(Math.random() * (180 + 180 + 1)) - 180 + 181 * (Math.random() > .5)?(-1):1,
        }
    }
    describe.skip("Testing setLat", () => {
        const generateRandomInput = () => {
            return Math.floor(Math.random() * (180 + 180 + 1)) - 180
        }
        it("Test setLat", () => {
            const st = new InputState("Moscow", "RU", 55.75, 37.62)

            for (let i = 0; i < 500; i++) {
                const lat = generateRandomInput()
                if (lat > 90 || lat < -90) {
                    expect(() => st.setLat(lat)).toThrow("Latitude out of range")
                } else {
                    st.setLat(lat)
                    expect(st.lat).toBe(lat)
                }
            }
        })
    })
    describe("Fuzz Testing setLon", () => {
        const generateRandomInput = () => {
            return Math.floor(Math.random() * (360 + 360 + 1)) - 360
        }
        it("Test setLon", () => {
            const st = new InputState("Moscow", "RU", 55.75, 37.62)

            for (let i = 0; i < 500; i++) {
                const lon = generateRandomInput()
                if (lon > 180 || lon < -180) {
                    expect(() => st.setLon(lon)).toThrow("Longitude out of range")
                } else {
                    st.setLon(lon)
                    expect(st.lon).toBe(lon)
                }
            }
        })
    })
})