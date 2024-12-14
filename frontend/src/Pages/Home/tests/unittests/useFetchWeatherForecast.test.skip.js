import useFetchWeatherForecast from "../../hooks/useFetchWeatherForecast";
import { InputState } from "../../Context/inputState";
import forecastWeatherDataManager from "../../DataManager/ForecastWeatherDataManager";
import geodecodeDataManager from "../../DataManager/GeodecodeDataManager";
import { CityError } from "../../DataManager/GeodecodeDataManager";
import { CoordinatesError } from "../../DataManager/ForecastWeatherDataManager";

jest.mock("../../DataManager/ForecastWeatherDataManager")
jest.mock("../../DataManager/GeodecodeDataManager")

describe.skip("Testing useFetchWeatherForecast", () => {
    const setWeatherForecast = jest.fn()

    beforeAll(() => {
        jest.clearAllMocks()
        const alertMock = jest.fn()
        jest.spyOn(window, alert).mockImplementation(alertMock)
        
    })
    describe("", () => {
        it("Test 1", () => {
            forecastWeatherDataManager.getData.mockResolvedValue({data : {list : [1]}})
            const inputState = new InputState("Moscow", "RU", 37.02, 13.76)
            const result = useFetchWeatherForecast(setWeatherForecast, inputState, "coords")

            expect(forecastWeatherDataManager.getData).toHaveBeenCalledTimes(1)
        })
    })
})