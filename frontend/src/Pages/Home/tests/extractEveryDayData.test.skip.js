const ANCHOR_TIME_HOURS = 12

function get3hIntervalAfterAnchorTime() {
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
    nextNoon.setHours(ANCHOR_TIME_HOURS, 0, 0, 0)
    return adjust((3 * Math.ceil(parseInt(getISOHours(nextNoon.toISOString())) / 3)).toString())
}

export function extractEveryDayData(list) {
    // list[0] is the data for current day, closest time
    //if (list.length !== 40) 
        // most likely the Open Weather API returned incorrect list for some reason
    //    return null
    const anchorTime = get3hIntervalAfterAnchorTime()
    console.log(anchorTime)
    const everyDayWeather = list.filter(day => day.dt_txt.slice(-8, -6) === anchorTime)
    const currentTimeWeather = list[0]

    if (parseInt(currentTimeWeather.dt_txt.slice(-8, -6)) <= parseInt(anchorTime)) {
        return [currentTimeWeather, ...everyDayWeather.slice(-4)]
    } else {
        return [currentTimeWeather, ...everyDayWeather.slice(0, 4)]
    }
}

it('should return an array with 5 elements when given a valid input list', () => {
    const mockList = [
        { dt_txt: '2023-05-01 05:00:00' },
        { dt_txt: '2023-05-01 06:00:00' },
        { dt_txt: '2023-05-02 06:00:00' },
        { dt_txt: '2023-05-03 06:00:00' },
        { dt_txt: '2023-05-04 06:00:00' },
        { dt_txt: '2023-05-05 06:00:00' },
    ];

    const result = extractEveryDayData(mockList);

    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({ dt_txt: '2023-05-01 05:00:00' });
    expect(result.slice(1)).toEqual([
        { dt_txt: '2023-05-02 06:00:00' },
        { dt_txt: '2023-05-03 06:00:00' },
        { dt_txt: '2023-05-04 06:00:00' },
        { dt_txt: '2023-05-05 06:00:00' },
    ]);
});

it('should include the current time weather as the first element of the result array', () => {
    const mockList = [
        { dt_txt: '2023-05-01 04:00:00' },
        { dt_txt: '2023-05-01 06:00:00' },
        { dt_txt: '2023-05-02 06:00:00' },
        { dt_txt: '2023-05-03 06:00:00' },
        { dt_txt: '2023-05-04 06:00:00' },
        { dt_txt: '2023-05-05 06:00:00' },
    ];

    const result = extractEveryDayData(mockList);

    expect(result[0]).toEqual({ dt_txt: '2023-05-01 04:00:00' });
});

it('should filter weather data for 12:00 PM for subsequent days', () => {
    const mockList = [
        { dt_txt: '2023-05-01 11:00:00' },
        { dt_txt: '2023-05-02 05:00:00' },
        { dt_txt: '2023-05-02 06:00:00' },
        { dt_txt: '2023-05-03 06:00:00' },
        { dt_txt: '2023-05-04 06:00:00' },
        { dt_txt: '2023-05-05 06:00:00' },
        { dt_txt: '2023-05-06 04:00:00' },
    ];

    const result = extractEveryDayData(mockList);

    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({ dt_txt: '2023-05-01 11:00:00' });
    expect(result.slice(1)).toEqual([
        { dt_txt: '2023-05-02 06:00:00' },
        { dt_txt: '2023-05-03 06:00:00' },
        { dt_txt: '2023-05-04 06:00:00' },
        { dt_txt: '2023-05-05 06:00:00' },
    ]);
});