import useFetchWeatherForecast from "../../hooks/useFetchWeatherForecast";
import { InputState } from "../../Context/inputState";
import forecastWeatherDataManager from "../../DataManager/ForecastWeatherDataManager";

describe("Testing useFetchWeatherForecast", () => {
    beforeAll(() => {
        jest.mock("../../DataManager/ForecastWeatherDataManager")
        const alertMock = jest.fn()
        global.alert = alertMock
        forecastWeatherDataManager.mockReturnValue()
    })
    describe("", () => {
        it("Test 1", () => {
            const setWeatherForecast = jest.fn()
            const inputState = new InputState("Moscow", "RU", 37.02, 13.76)
            const result = useFetchWeatherForecast(setWeatherForecast, inputState, "coords")

            expect(setWeatherForecast).toHaveBeenCalledTimes(1)
        })
    })
})