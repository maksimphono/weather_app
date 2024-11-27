import dataAdapterFactory from "../utils/DataAdapterFactory.js"
import Debugger from "../../utils/Debugger.js"
//export const DataManager_class_Debugger = new Debugger("DataManager class Debugger")
const API_KEY = process.env.REACT_APP_API_KEY;

export class FetchError {
    constructor(body) {
        this.body = body
    }
}

export default class DataManager {
    constructor(adapter = null, url = "") {
        this.adapter = adapter
        this.url = url
        this.ready = false
        if (this.adapter) {
            this.adapter
                .openDB()
                    .then(() => 
                        this.ready = true
                    )
                    .catch((error) => {throw new Error(error)})
        }
    }
    isOverdue(entry) {
        if (!entry.hasOwnProperty("due_dt")) return false
        return entry.due_dt < Date.now()
    }
    setOverdue(date, entry) {
        return {...entry, due_dt : new Date(date)}
    }
    async fetch(params) {
        const query = new URLSearchParams({...params, appid : API_KEY})

        try {
            console.log("Fetching", [this.url, query.toString()].join("?"))
            const response = await fetch([this.url, query.toString()].join("?"))

            return response
        } catch(error) {
            console.error("Error in DataManager.fetch()")
            throw error
        }
    }
    // @virtual
    async loadOneBy(indexName, value) {
        try {
            return await this.adapter.loadOneBy(indexName, value)
        } catch(error) {
            console.error("Error in DataManager.loadOneBy()")
            throw error
        }
    }
    async saveOne(entry) {
        try {
            return await this.adapter.saveOne(entry)
        } catch(error) {
            console.error("Error in DataManager.saveOne()")
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
    async getData(args) {
        if (!this.ready) { 
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
                    if (Object.keys(fetchedData)?.length) {
                        data = this.processFetchedData(fetchedData)
                        await this.saveOne(data)
                    } else {
                        // fetch() returned empty object (most likely means that the data doesn't exist in OpenWeather DB)
                        data = null
                    }                 
                    return data
                } else {
                    console.error("Failed to fetch data from API")
                    console.dir(response)
                    throw new FetchError(response)
                }
            } catch(error) {
                console.error("Error in DataManager.getData")
                console.dir(error)
                throw new FetchError(error)
            }
        } else {
            return data
        }
    }
}
