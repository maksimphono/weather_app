import DataManager, { FetchError } from '../../DataManager/DataManager';
import dataAdapterFactory from '../../utils/DataAdapterFactory';
import approximateCoordinates from '../../utils/approximateCoordinates';
import forecast_data_mock from "./__mocks__/forecast_data"
import weather_data_mock from "./__mocks__/weather_data"

//dataAdapterFactory.createForecastWeatherAdapter.mockReturnValue(mockAdapter);

jest.mock('../../DataManager/DataManager');
jest.mock('../../utils/DataAdapterFactory');
jest.mock('../../utils/approximateCoordinates');

const mockAdapter = {
    loadOneBy: jest.fn(),
    saveOne: jest.fn(),
};
dataAdapterFactory.createForecastWeatherAdapter.mockReturnValue(mockAdapter);

import forecastWeatherDataManager, { CoordinatesError, extractEveryDayData } from '../../DataManager/ForecastWeatherDataManager';

describe('Testing ForecastWeatherDataManager class', () => {
    beforeEach(() => {
        forecastWeatherDataManager.adapter = mockAdapter
        //forecastWeatherDataManager = new ForecastWeatherDataManager();
    })
  
    describe('constructor', () => {
        it('should initialize with correct adapter and URL', () => {
            expect(dataAdapterFactory.createForecastWeatherAdapter).toHaveBeenCalledTimes(1)
        });
    });
  
    describe('Testing prepareFetchParams()', () => {
      it('should return lat and lon', () => {
        const params = forecastWeatherDataManager.prepareFetchParams({ lat: 10, lon: 20 });
        expect(params).toEqual({ lat: 10, lon: 20 });
      });
    })
  
    describe('Testing loadOneBy()', () => {
      it('should call adapter.loadOneBy with approximated coordinates', async () => {
        approximateCoordinates.mockReturnValue("[10.000,20.000]");
        await forecastWeatherDataManager.loadOneBy({ lat: 10, lon: 20 });
        expect(approximateCoordinates).toHaveBeenCalledTimes(1);
        expect(approximateCoordinates.mock.calls[0][0]).toEqual({ lat: 10, lon: 20 });
        expect(mockAdapter.loadOneBy).toHaveBeenCalledTimes(1)
        expect(mockAdapter.loadOneBy.mock.calls[0]).toEqual(['coordinates', "[10.000,20.000]"]);
      });
  
      it('should throw error if adapter.loadOneBy fails', async () => {
        mockAdapter.loadOneBy.mockRejectedValue(new Error("<TAG ERROR>"));
        await expect(forecastWeatherDataManager.loadOneBy({ lat: 10, lon: 20 })).rejects.toThrow("<TAG ERROR>");
      });
    });
    describe('setOverdue', () => {
        it("should set the due_dt of an entry", () => {
            const entry = { field1: "one", field2 : "two", due_dt : 99 };
            jest.spyOn(forecastWeatherDataManager, 'getExpirationTime').mockReturnValueOnce(1000);
            const result = forecastWeatherDataManager.setOverdue(entry);
            expect(result).toEqual({ ...entry, due_dt: 1000 });
        });
    });
    describe('Testing processFetchedData()', () => {
        it('should process and return data correctly', () => {
            const mockData = forecast_data_mock
            approximateCoordinates.mockReturnValue("[10.000,20.000]");
            jest.spyOn(forecastWeatherDataManager, 'setOverdue').mockImplementationOnce(data => data) // just return data as it is (this method has already been tested)

            const result = forecastWeatherDataManager.processFetchedData(mockData)

            expect(result).toEqual({
                coordinates: "[10.000,20.000]",
                data: expect.objectContaining({
                    cnt: 5,
                    list: expect.any(Array)
                }),
                lat: 10,
                lon: 20
            });
        });
    
        it('should throw error if data is invalid', () => {
            expect(() => forecastWeatherDataManager.processFetchedData({ list: [] })).toThrow()
            expect(() => forecastWeatherDataManager.processFetchedData({ list: Array(39).fill({dt_txt : "<PLACEHOLDER>"}) })).toThrow()
        });
    });
  
    describe('Testing getExpirationTime()', () => {
      it('should return correct expiration time', () => {
        const result = forecastWeatherDataManager.getExpirationTime();
        expect(result).toBeGreaterThan(Date.now());
      });
    });
  
    describe('Testing getData()', () => {
        it('should call super.getData and return result', async () => {
            const mockData = weather_data_mock
            const super_getDataMock = jest.spyOn(DataManager.prototype, "getData").mockResolvedValueOnce(mockData)

            const result = await forecastWeatherDataManager.getData({ lat: 10, lon: 20 });
            expect(super_getDataMock).toHaveBeenCalledTimes(1)
            expect(super_getDataMock.mock.calls[0][0]).toEqual({ lat: 10, lon: 20 })
            expect(result).toEqual(mockData);
            super_getDataMock.mockClear()
        });
    
        it('should throw CoordinatesError for bad request', async () => {
            const err = new FetchError({ statusText: 'Bad Request' })
            err.body = { statusText: 'Bad Request' }
            const super_getDataMock = jest.spyOn(DataManager.prototype, "getData").mockRejectedValueOnce(err)

            await expect(forecastWeatherDataManager.getData({ lat: 10, lon: 20 })).rejects.toThrow(CoordinatesError);
            expect(super_getDataMock).toHaveBeenCalledTimes(1)
            super_getDataMock.mockClear()
        })
    });
});

describe.skip('extractEveryDayData', () => {
  it('should extract correct data from list', () => {
    const mockList = Array(40).fill().map((_, i) => ({
      dt_txt: `2023-01-${String(i + 1).padStart(2, '0')} ${String(i % 8 * 3).padStart(2, '0')}:00:00`
    }));
    const result = extractEveryDayData(mockList);
    expect(result.length).toBe(5);
  });

  it('should return null if list length is not 40', () => {
    const result = extractEveryDayData([]);
    expect(result).toBeNull();
  });
});