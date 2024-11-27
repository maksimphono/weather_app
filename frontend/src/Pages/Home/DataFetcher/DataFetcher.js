import dataAdapterFactory from "../utils/DataAdapterFactory.js"
const API_KEY = "b2c7e53d740b18010af6e34dadf39662"

class Debugger {
    constructor() {
        this.enabled = true
        this.callStack = []
    }
    enable() {
        this.enabled = true
    }
    disable() {
        this.enabled = false
    }

    push(name) {
        if (!this.enabled) return;
        this.callStack.push(name)
    }
    pop() {
        if (!this.enabled) return;
        this.callStack.pop()
    }
    report() {
        if (!this.enabled) return;
        console.log("Debugger report")
        console.log("Call stack:")
        this.callStack.forEach((entry) => {
            console.log("-", entry)
        })
    }
    /*
        @param {function} codeBlock
    */
    async exec(codeBlock) {
        if (this.enabled){
            try {
                await codeBlock()
                console.info("Fetcher class Debugger execution completed!")
            } catch(error) {
                console.error("Fetcher class Debugger caught error: ", error)
                throw error
            } finally {
                this.report()
            }
        } else {
            await codeBlock()
        }
    }
}

export const Fetcher_class_Debugger = new Debugger()

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
        Fetcher_class_Debugger.push("Fetcher.fetch")
        const query = new URLSearchParams({...params, appid : API_KEY})

        try {
            console.log("Fetching", [this.url, query.toString()].join("?"))
            const response = await fetch([this.url, query.toString()].join("?"))

            Fetcher_class_Debugger.pop()
            return response
        } catch(error) {
            console.error("Error in Fetcher.fetch()")
            throw error
        }
    }
    // @virtual
    async loadOneBy(indexName, value) {
        Fetcher_class_Debugger.push("Fetcher.loadOneBy")
        try {
            Fetcher_class_Debugger.pop()
            return await this.adapter.loadOneBy(indexName, value)
        } catch(error) {
            console.error("Error in Fetcher.loadOneBy()")
            throw error
        }
    }
    async saveOne(entry) {
        Fetcher_class_Debugger.push("Fetcher.saveOne")
        try {
            Fetcher_class_Debugger.pop()
            return await this.adapter.saveOne(entry)
        } catch(error) {
            console.error("Error in Fetcher.saveOne()")
            throw error
        }
    }
    // @virtual
    processFetchedData(data) {
        return data
    }
    // @virtual
    prepareFetchParams(params) {
        return new FormData(params)
    }
}

class GeodecodeFetcher extends Fetcher {
    constructor () {
        super(
            dataAdapterFactory.createGeodecodeAdapter(),   // adapter
            "http://api.openweathermap.org/geo/1.0/direct" // url
        )
        this.adapter
            .openDB()
                .then(() => 
                    this.ready = true
                )
                .catch((error) => {throw new Error(error)})
    }
    // @override
    prepareFetchParams({cityName, countryCode}) {
        Fetcher_class_Debugger.push("GeodecodeFetcher.prepareFetchParams")
        if (countryCode?.length) {
            Fetcher_class_Debugger.pop()
            return {q : [cityName, countryCode].join(","), limit : 1}
        } else {
            Fetcher_class_Debugger.pop()
            return {q : cityName, limit : 1}
        }
    }
    // @override
    processFetchedData(data) {
        Fetcher_class_Debugger.push("GeodecodeFetcher.processFetchedData")
        if (!Object.keys(data).length) {
            Fetcher_class_Debugger.pop()
            return null
        } 
            
        const res = data[0] 
        Fetcher_class_Debugger.pop()
        return {
            id : [res.lat.toString(), res.lon.toString()].join(","),
            name : res.name,
            country_code : res.country,
            lat : res.lat,
            lon : res.lon,
            state : res.state || null
        }
    }
    // @override
    async loadOneBy({cityName, countryCode}) {
        Fetcher_class_Debugger.push("GeodecodeFetcher.loadOneBy")
        if (countryCode) {
            let results = await this.adapter.loadManyBy("name", cityName)
            if (!results) {
                Fetcher_class_Debugger.pop()
                return null
            } 

            results = results.filter(entry => entry.country_code === countryCode)
            Fetcher_class_Debugger.pop()
            return results[0]
        } else {
            let results = await this.adapter.loadOneBy("name", cityName)
            Fetcher_class_Debugger.pop()
            return results
        }
    }
    async getData(args) {
        Fetcher_class_Debugger.push("GeodecodeFetcher.getData")
        
        if (!this.ready) { 
            Fetcher_class_Debugger.pop()
            return null
        }
        let data = await this.loadOneBy(args) // TODO: complete data load
        if (data == null || this.isOverdue(data)) {
            // that city isn't in the database => fetch from API and save to the database
            const params = this.prepareFetchParams(args)
            try {
                const response = await this.fetch(params)
                if (response.ok) {
                    const fetchedData = await response.json()
                    data = this.processFetchedData(fetchedData)
                    await this.saveOne(data)
                    Fetcher_class_Debugger.pop()
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
            Fetcher_class_Debugger.pop()
            return data
        }
    }
}

export const geodecodeFetcher = new GeodecodeFetcher()