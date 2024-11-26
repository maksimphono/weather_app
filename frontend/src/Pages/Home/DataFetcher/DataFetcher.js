import dataAdapterFactory from "../utils/DataAdapterFactory.js"
const API_KEY = "b2c7e53d740b18010af6e34dadf39662"

export class FetchError {
    constructor(body) {
        this.body = body
    }
}

class Fetcher {
    constructor(adapter, url = "") {
        this.adapter = adapter
        this.url = url
        this._fetchParams = null
        this.ready = false
    }
    isOverdue(entry) {
        if (!entry.hasOwnProperty("due_dt")) return false
        return entry.due_dt < Date.now()
    }
    setOverdue(date, entry) {
        return {...entry, due_dt : new Date(date)}
    }
    set fetchParams(params) {
        this._fetchParams = new FormData(params)
    }
    get fetchParams() {
        return this._fetchParams
    }
    async fetch(params) {
        const query = new URLSearchParams(params) + ['&appid=', API_KEY].join("")

        try {
            console.log("Fetching", [this.url, query.toString()].join("?"))
            const response = await fetch([this.url, query.toString()].join("?"))

            return response
        } catch(error) {
            console.log(error)
            throw error
        }
    }
    async loadOneBy(indexName, value) {
        return await this.adapter.loadOneBy(indexName, value)
    }
    async saveOne(entry) {
        return await this.adapter.saveOne(entry)
    }
    processData(data) {
        return data
    }
    prepareFetchParams(params) {
        return new FormData(params)
    }
}

class GeodecodeFetcher extends Fetcher {
    constructor () {
        super(
            dataAdapterFactory.createGeodecodeAdapter(),
            "http://api.openweathermap.org/geo/1.0/direct"
        )
        this.adapter
            .openDB()
                .then(() => 
                    this.ready = true
                )
                .catch((error) => {throw new Error(error)})
    }
    prepareFetchParams(cityName, countryCode) {
        if (countryCode.length)
            return {q : [cityName, countryCode].join(","), limit : 1}
        else
        return {q : cityName, limit : 1}
    }
    processData(data) {
        if (!Object.keys(data).length) return null
        const res = data[0] 
        return {
            id : res.lat.toString() + res.lon.toString(),
            name : res.name,
            country_code : res.country,
            lat : res.lat,
            lon : res.lon,
            state : res.state || null
        }
    }

    async loadOneByNameAndCountry(name, country_code) {
        const results = await this.adapter.loadManyBy("name", name)
        if (!results) return null
        results.filter(entry => entry.country_code === country_code)
        return results[0]
    }
    async getData(cityName, countryCode) {
        if (!this.ready) return null
        let data = null
        data = await this.loadOneByNameAndCountry(cityName, countryCode) // TODO: complete data load
        if (data == null || this.isOverdue(data)) {
            // that city isn't in the database => fetch from API and save to the database
            const params = this.prepareFetchParams(cityName, countryCode)
            try {
                const response = await this.fetch(params)
                if (response.ok) {
                    const fetchedData = await response.json()
                    data = this.processData(fetchedData)
                    await this.saveOne(data)
                    return data
                } else {
                    console.error("Failed to fetch data from API")
                    console.dir(response)
                    throw new FetchError(response)
                }
            } catch(error) {
                console.error("Error in GeocodeFetcher.getData")
                console.dir(error)
                throw new FetchError(error)
            }
        } else {
            return data
        }
    }
}

export const geodecodeFetcher = new GeodecodeFetcher()