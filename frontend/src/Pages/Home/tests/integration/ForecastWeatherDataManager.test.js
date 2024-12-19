import DataManager, { FetchError } from '../../DataManager/DataManager';
import dataAdapterFactory from '../../utils/DataAdapterFactory';
import approximateCoordinates from '../../utils/approximateCoordinates';

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
  
    describe.skip('setOverdue', () => {
      it('should set the due_dt of an entry', () => {
        const entry = { data: 'test' };
        jest.spyOn(forecastWeatherDataManager, 'getExpirationTime').mockReturnValue(1000);
        const result = forecastWeatherDataManager.setOverdue(entry);
        expect(result).toEqual({ ...entry, due_dt: 1000 });
      });
    });
  
    describe.skip('processFetchedData', () => {
      it('should process and return data correctly', () => {
        const mockData = {
          list: Array(40).fill({ dt_txt: '2023-01-01 12:00:00' }),
          city: { coord: { lat: 10, lon: 20 } }
        };
        approximateCoordinates.mockReturnValue('approx_coords');
        jest.spyOn(forecastWeatherDataManager, 'setOverdue').mockImplementation(data => data);
      
        const result = forecastWeatherDataManager.processFetchedData(mockData);
      
        expect(result).toEqual({
          coordinates: 'approx_coords',
          data: expect.objectContaining({
            cnt: 5,
            list: expect.any(Array)
          }),
          lat: 10,
          lon: 20
        });
      });
  
      it('should throw error if data is invalid', () => {
        expect(() => forecastWeatherDataManager.processFetchedData({ list: [] })).toThrow();
      });
    });
  
    describe.skip('getExpirationTime', () => {
      it('should return correct expiration time', () => {
        const result = forecastWeatherDataManager.getExpirationTime();
        expect(result).toBeGreaterThan(Date.now());
      });
    });
  
    describe.skip('getData', () => {
      it('should call super.getData and return result', async () => {
        const mockData = { weather: 'sunny' };
        DataManager.prototype.getData.mockResolvedValue(mockData);
      
        const result = await forecastWeatherDataManager.getData({ lat: 10, lon: 20 });
        expect(result).toEqual(mockData);
      });
  
      it('should throw CoordinatesError for bad request', async () => {
        DataManager.prototype.getData.mockRejectedValue(new FetchError({ statusText: 'Bad Request' }));
      
        await expect(forecastWeatherDataManager.getData({ lat: 10, lon: 20 })).rejects.toThrow(CoordinatesError);
      });
  
      it('should throw original error for other fetch errors', async () => {
        const originalError = new FetchError({ statusText: 'Network Error' });
        DataManager.prototype.getData.mockRejectedValue(originalError);
      
        await expect(forecastWeatherDataManager.getData({ lat: 10, lon: 20 })).rejects.toThrow(originalError);
      });
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