import DataAdapter from "../DataAdapter/DataAdapter";

class DataAdapterFactory {
    // Must be singleton
    static instance = null
    
    constructor() {
        if (DataAdapterFactory.instance !== null) {
            return DataAdapterFactory.instance
        } else {
            this.createdInstances = new Map()
            DataAdapterFactory.instance = this
        }
    }
    
    // each adapter must have a unique name, if I'm trying to create adapter with already existing name, factory must return already created instance
    createCountryCodeAdapter() {
        if (this.createdInstances.has("Country codes")) {
            return this.createdInstances.get("Country codes")
        }
        const adapter = new DataAdapter("Country codes", [{name : "code"}, {name : "country"}], "code")
        this.createdInstances.set("Country codes", adapter)
        return adapter
    }
    createUserDataAdapter() {
        // created data adapter, that will contain all user data: preferred temperature units, liked cities, etc...
        const name = "User data"
        if (this.createdInstances.has(name)) {
            return this.createdInstances.get(name)
        }
        const adapter = new DataAdapter(name, [{name : "name"}, {name : "email"}, {name : "preffered_temp_units"}, {name : "followed_cities"}], "name")
        this.createdInstances.set(name, adapter)
        return adapter
    }
    createOneDayWeatherAdapter() {
        const name = "One day weather"
        if (this.createdInstances.has(name)) {
            return this.createdInstances.get(name)
        }
        const adapter = new DataAdapter(name, [{name : "city"}, {name : "expires_at"}, {name : "weather_data"}], "city")
        this.createdInstances.set(name, adapter)
        return adapter
    }
}

const factory  = new DataAdapterFactory()
export default factory