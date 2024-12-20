export class InputState {
    constructor(city, country, lat, lon) {
        this._country = country
        this._city = city
        this._lat = lat
        this._lon = lon
    }
    deepcopy() {
        const copy = new InputState(this._city, this._country, this._lat, this._lon)
        return copy
    }
    get city() {
        return this._city
    }
    get lat() {
        return this._lat
    }
    get lon() {
        return this._lon
    }
    get country() {
        return this._country
    }
    setCity(city) {
        this._city = city
        return this
    }
    setCountry(country) {
        this._country = country
        return this
    }
    setLat(val) {
        if (val > 90 || val < -90) throw new Error("Latitude out of range")
        this._lat = val
        return this
    }
    setLon(val) {
      if (val > 180 || val < -180) throw new Error("Longitude out of range")
        this._lon = val
        return this
    }
}

export function inputReducer(state, action) {
  switch (action.type) {
    case "country":
      return state.deepcopy().setCountry(action.country);
    case "city":
      return state.deepcopy().setCity(action.city);
    case "lat":
      return state.deepcopy().setLat(action.lat);
    case "lon":
      return state.deepcopy().setLon(action.lon);
    case "setAll":
      return state
        .deepcopy()
        .setLon(action.lon)
        .setLat(action.lat)
        .setCity(action.city)
        .setCountry(action.country);
    default:
      return state;
  }
}
export const initalInputState = new InputState("Moscow", "RU", 0, 0)

export const actions = {
    selectedMode : (val) => ({type : "mode", selectedMode : val}),
    country : (val) => ({type : "country", country : val}),
    city : (val) => ({type : "city", city : val}),
    lat : (val) => ({type : "lat", lat : val}),
    lon : (val) => ({type : "lon", lon : val}),
    setAll : (state) => ({
        type : "setAll", 
        lon: state.lon,
        lat: state.lat,
        country: state.country,
        city: state.city
    }),
}