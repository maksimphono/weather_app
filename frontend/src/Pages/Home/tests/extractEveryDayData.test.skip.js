function extractEveryDayData(list) {
    // list[0] is the data for current day, closest time
    //if (list.length !== 40) 
        // most likely the Open Weather API returned incorrect list for some reason
    //    return null
    const everyDayWeather = list.filter(day => day.dt_txt.slice(-8, -6) === "12")
    const currentTimeWeather = list[0]

    if (parseInt(currentTimeWeather.dt_txt.slice(-8, -6)) <= 12) {
        return [currentTimeWeather, ...everyDayWeather.slice(-4)]
    } else {
        return [currentTimeWeather, ...everyDayWeather.slice(0, 4)]
    }
}
it('should return an array with 5 elements when given a valid input list', () => {
    const mockList = [
        { dt_txt: '2023-05-01 09:00:00' },
        { dt_txt: '2023-05-01 12:00:00' },
        { dt_txt: '2023-05-02 12:00:00' },
        { dt_txt: '2023-05-03 12:00:00' },
        { dt_txt: '2023-05-04 12:00:00' },
        { dt_txt: '2023-05-05 12:00:00' },
    ];

    const result = extractEveryDayData(mockList);

    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({ dt_txt: '2023-05-01 09:00:00' });
    expect(result.slice(1)).toEqual([
        { dt_txt: '2023-05-02 12:00:00' },
        { dt_txt: '2023-05-03 12:00:00' },
        { dt_txt: '2023-05-04 12:00:00' },
        { dt_txt: '2023-05-05 12:00:00' },
    ]);
});

it('should include the current time weather as the first element of the result array', () => {
    const mockList = [
        { dt_txt: '2023-05-01 10:00:00' },
        { dt_txt: '2023-05-01 12:00:00' },
        { dt_txt: '2023-05-02 12:00:00' },
        { dt_txt: '2023-05-03 12:00:00' },
        { dt_txt: '2023-05-04 12:00:00' },
        { dt_txt: '2023-05-05 12:00:00' },
    ];

    const result = extractEveryDayData(mockList);

    expect(result[0]).toEqual({ dt_txt: '2023-05-01 10:00:00' });
});

it('should filter weather data for 12:00 PM for subsequent days', () => {
    const mockList = [
        { dt_txt: '2023-05-01 15:00:00' },
        { dt_txt: '2023-05-02 09:00:00' },
        { dt_txt: '2023-05-02 12:00:00' },
        { dt_txt: '2023-05-03 12:00:00' },
        { dt_txt: '2023-05-04 12:00:00' },
        { dt_txt: '2023-05-05 12:00:00' },
        { dt_txt: '2023-05-06 09:00:00' },
    ];

    const result = extractEveryDayData(mockList);

    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({ dt_txt: '2023-05-01 15:00:00' });
    expect(result.slice(1)).toEqual([
        { dt_txt: '2023-05-02 12:00:00' },
        { dt_txt: '2023-05-03 12:00:00' },
        { dt_txt: '2023-05-04 12:00:00' },
        { dt_txt: '2023-05-05 12:00:00' },
    ]);
});