import { InputState } from "../../Context/inputState"
//import { InputState } from "../../components/InputFields.jsx";

describe.skip("Testing InputState class", () => {
    describe("Testing creation", () => {
        it("Test 1 creation", () => {
            const st = new InputState("Moscow", "RU", 55.75, 37.62)

            expect(st.city).toBe("Moscow")
            expect(st.country).toBe("RU")
            expect(st.lat).toBe(55.75)
            expect(st.lon).toBe(37.62)
        })
    })

    describe("Testing methods", () => {
        it("Test 1 setCity", () => {
            const st = new InputState("Moscow", "RU", 55.75, 37.62)

            st.setCity("Berlin")
            expect(st.city).toBe("Berlin")
            expect(st.country).toBe("RU")
            expect(st.lat).toBe(55.75)
            expect(st.lon).toBe(37.62)
        })
        it("Test 2 setCountry", () => {
            const st = new InputState("Moscow", "RU", 55.75, 37.62)

            st.setCountry("DE")
            expect(st.city).toBe("Moscow")
            expect(st.country).toBe("DE")
            expect(st.lat).toBe(55.75)
            expect(st.lon).toBe(37.62)
        })
        it("Test 3 setLat", () => {
            const st = new InputState("Moscow", "RU", 55.75, 37.62)

            st.setLat(42)
            expect(st.city).toBe("Moscow")
            expect(st.country).toBe("RU")
            expect(st.lat).toBe(42)
            expect(st.lon).toBe(37.62)
        })
        it("Test 4 setLon", () => {
            const st = new InputState("Moscow", "RU", 55.75, 37.62)

            st.setLon(42)
            expect(st.city).toBe("Moscow")
            expect(st.country).toBe("RU")
            expect(st.lat).toBe(55.75)
            expect(st.lon).toBe(42)
        })
    })

    describe("Test copy", () => {
        it("Test 1 copy", () => {
            const st = new InputState("Moscow", "RU", 55.75, 37.62)
            const copy_st = st.deepcopy()

            copy_st.setCity("Berlin")
            copy_st.setLat(42)

            expect(st.city).toBe("Moscow")
            expect(st.lat).toBe(55.75)

            expect(copy_st.city).toBe("Berlin")
            expect(copy_st.country).toBe("RU")
            expect(copy_st.lat).toBe(42)
            expect(copy_st.lon).toBe(37.62)
        })
    })
})