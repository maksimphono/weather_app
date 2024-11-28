import DataAdapter from "../DataAdapter/DataAdapter.js"
import approximateCoordinates from "./approximateCoordinates.js"

export class CustomError extends Error {
    constructor(type, body) {
        this.type = type
        this.body = body
    } 
}

export class OpenError extends CustomError {
    constructor(body) {
        super("OpenError", body)
    }
}

export class LoadError extends CustomError {
    constructor(body) {
        super("LoadError", body)
    }
}

export default class FollowingListAdapter extends DataAdapter {
    /*
        Provides a simple and reliable interface to interact with the
        lower level DataAdapter. Basically just a set of convinient methods
    */
    constructor(name) {
        super(name, [{name : "coordinates"}, {name : "name"}, {name : "country_code"}], "coordinates")
        this.ready = false
        this.openDB()
            .then(() => {
                this.ready = true
            })
            .catch(error => {throw new OpenError(error)})
    }
    async loadAll() {
        if (!this.ready) return null
        try {
            return await super.loadAll()
        } catch(error) {
            console.error("LoadError")
            throw new LoadError(error)
        }
    }
    async load(coordinates) {
        if (!this.ready) return null
        try {
            return await super.loadOneBy("coordinates", approximateCoordinates(coordinates))
        } catch(error) {
            console.error("LoadError")
            throw new LoadError(error)
        }
    }
    async save({coordinates, name, country_code}) {
        if (!this.ready) return null
        try {
            return await super.saveOne({coordinates : approximateCoordinates(coordinates), name, country_code})
        } catch(error) {
            throw new CustomError("Saving error", error)
        }
    }
    async remove(coordinates) {
        if (!this.ready) return null
        try {
            return await super.removeOneBy("coordinates", approximateCoordinates(coordinates))
        } catch(error) {
            console.error("LoadError")
            throw new LoadError(error)
        }
    }
}