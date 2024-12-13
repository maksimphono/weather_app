import DataAdapter from "../../DataAdapter/DataAdapter";
import factory from "../../utils/DataAdapterFactory"
import FollowingListAdapter from "../../utils/FollowingListAdapter";

describe.skip("Testing DataAdaptorFactory class", () => {
    describe("Methods", () => {
        it("Test 1 createCountryCodeAdapter", () => {
            const expected = new DataAdapter("Country codes", [{name : "code"}, {name : "country"}], "code")
            const adapter = factory.createCountryCodeAdapter()

            expect(adapter).toEqual(expected)
        })
        it("Test 2 createGeodecodeAdapter", () => {
            const name = "Geodecode"
            const expected = new DataAdapter(name, [{name : "id", unique : true}, {name : "name"}, {name : "country_code"}, {name : "state"}, {name : "lat"}, {name : "lon"}], "id")
            const adapter = factory.createGeodecodeAdapter()

            expect(adapter).toEqual(expected)
        })
        it("Test 3 createUserFollowingListAdapter", () => {
            const name = "User data"
            const expected = new FollowingListAdapter(name)
            const adapter = factory.createUserFollowingListAdapter()

            expect(adapter).toEqual(expected)
        })
        it("Test 4 createOneDayWeatherAdapter", () => {
            const name = "One day weather"
            const expected = new DataAdapter(name, [{name : "coordinates"}, {name : "due_dt"}, {name : "data"}, {name : "lat"}, {name : "lon"}], "coordinates")
            const adapter = factory.createOneDayWeatherAdapter()

            expect(adapter).toEqual(expected)
        })
        it("Test 5 createForecastWeatherAdapter", () => {
            const name = "Forecast weather"
            const expected = new DataAdapter(name, [{name : "coordinates"}, {name : "due_dt"}, {name : "data"}, {name : "lat"}, {name : "lon"}], "coordinates")
            const adapter = factory.createForecastWeatherAdapter()

            expect(adapter).toEqual(expected)
        })
    })
    describe("Each adapter can only be created once", () => {
        it("Test 1", () => {
            const adapter1 = factory.createCountryCodeAdapter()
            const adapter2 = factory.createCountryCodeAdapter()

            expect(adapter1).toBe(adapter2)
        })
        it("Test 2", () => {
            const adapter1 = factory.createOneDayWeatherAdapter()
            const adapter2 = factory.createOneDayWeatherAdapter()
            const adapter3 = factory.createOneDayWeatherAdapter()

            expect(adapter1).toBe(adapter2)
            expect(adapter2).toBe(adapter3)
            expect(adapter1).toBe(adapter3)
        })
    })
})