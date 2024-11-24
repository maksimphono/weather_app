class ValidationError {
    constructor(message, {expected, got}) {
        this.message = message
        this.expected = expected
        this.got = got
    }
    report() {
        return `${this.message}\nExpected: ${this.expected}\nGot: ${this.got}`
    }
};

export default class DataAdapter{    
    constructor(dbStoreName, fields, keypath, version = 1) {
        this.name = dbStoreName
        this.version = version
        this.fields = structuredClone(fields)
        this.fieldNames = fields.map(field => field.name)
      	this.db = null
        this.keyPath = keypath
        this.dbName = dbStoreName
    }
    validateBeforeSave(entry) {
        const missingFields = []

        if (Object.keys(entry).length != this.fields.length) 
            throw new ValidationError("Invalid fields number", 
                {expected : this.fields.length, got : Object.keys(entry).length}
                )
        
        this.fields.forEach(({name}) => {if (!entry.hasOwnProperty(name)) missingFields.push(name)})

        if (missingFields.length)
            throw new ValidationError("Missing fields", {
                expected : this.fields.map(({name}) => name), 
                got : missingFields
            })
    }
    openDB() {
        return new Promise((resolve, reject) => {
            this.version++;
            console.info("Opening DB", "; version : ", this.version)
            let req = indexedDB.open(this.dbName, this.version)
    	    req.onsuccess = async event => {
   		     	this.db = await req.result
                resolve()
    	    }
		    req.onerror = event => reject()

            req.onupgradeneeded = event => {
                console.info("Creating new store", this.name)
            	let store = event.currentTarget.result.createObjectStore(this.name, {keyPath : this.keyPath})
              	this.fields.forEach(field => store.createIndex(field.name, field.name, {unique : field.unique}))
            }
        })
	}

	getObjectStore(mode) {
        console.log("Getting object store")
        let tx = this.db.transaction(this.name, mode)
        console.log(tx.objectStore(this.name))
        return tx.objectStore(this.name)
    }
    getIndex(objectStore, indexName) {
        try {
            return objectStore.index(indexName);
        }
        catch (error) {
            console.error(`Index ${indexName} does not exist in store ${this.name}`)
            throw new Error(`Index ${indexName} does not exist in store ${this.name}`)
        }
    }

    clearData() {
        return new Promise((resolve, reject) => {
            let store = this.getObjectStore("readwrite")
            let req = store.clear()

            req.onsuccess = () => resolve()
            req.onerror = (event) => reject(event)
        })
    }
    async saveMany(entries) {
        let req = null
        const validationErrors = []
        entries.forEach(async (entry) => {
            try {
                await this.saveOne(entry)
            } catch (error) {
                if (error instanceof ValidationError) {
                    validationErrors.push(error)
                } else {
                    console.error(error)
                    return
                }
            }
        })
        if (validationErrors.length) {
            console.error("Errors while adding entries:\n")
            validationErrors.forEach(err => {
                console.error(err)
            })
        }
    }

    fillEmptyFields(entry) {
        this.fieldNames.forEach(field => {
            if (!entry.hasOwnProperty(field)) {
                entry[field] = null
            }
        })
    }
    saveOne(entry) {
        return new Promise((resolve, reject) => {
            const store = this.getObjectStore("readwrite")
            //let entry = structuredClone(_entry)
            //entry.__proto__ = null
            let req = null
            /*
            try {
                console.info("Validating")
                this.validateBeforeSave(entry)
            } catch (error) {
                console.error(error)
                if (error instanceof ValidationError) {
                    error.got.forEach(field => entry[field] = undefined)
                    throw error
                }
            }
            */
            req = store.put(entry)
            req.onsuccess = () => resolve("Added to ", this.name, this.dbName)
            req.onerror = ({target}) => {console.dir(target.error); reject(target.error)}
        })
    }
    loadOneBy(indexName, value) {
        return new Promise((resolve, reject) => {
            const objectStore = this.getObjectStore("readwrite")
            let myIndex = this.getIndex(objectStore, indexName)
            const cursorReq = myIndex.openCursor()

            cursorReq.onsuccess = (event) => {
                const cursor = event.target.result;

                if (cursor) {
                    if (cursor.value[indexName] === value) {
                        resolve(cursor.value)
                        return cursor.value
                    }
                    cursor.continue();
                } else {
                    // Entries all displayed.
                    resolve(null)
                }
            };
            cursorReq.onerror = (reason) => {
                reject(reason)
            }
        })
        
    }

    loadManyBy(indexName, value) {
        return new Promise((resolve, reject) => {
            const resultList = []
            const objectStore = this.getObjectStore("readwrite")
            let myIndex = this.getIndex(objectStore, indexName)
            const cursorReq = myIndex.openCursor()

            cursorReq.onsuccess = (event) => {
                const cursor = event.target.result;

                if (cursor) {
                    if (cursor.value[indexName] === value) {
                        resultList.push(cursor.value)
                    }
                    cursor.continue();
                } else {
                    // Entries all displayed.
                    resolve(resultList)
                }
            };
            cursorReq.onerror = (reason) => {
                reject(reason)
            }
        })
    }

    loadAll() {
        return new Promise((resolve, reject) => {
            const records = []
            const store = this.getObjectStore("readonly")
            let cursorReq = store.openCursor()

            cursorReq.onsuccess = ({target}) => {
                const cursor = target.result

                if (cursor) {
                    records.push(cursor.value)
                    cursor.continue()
                } else {
                    // All records are loaded to the array
                    resolve(records)
                }
            }
            cursorReq.onerror = ({target}) => {
                reject(target)
            }
        })
    }
    
    removeOneBy(indexName, value) {
        return new Promise((resolve, reject) => {
            const objectStore = this.getObjectStore("readwrite")
            const cursor = objectStore.openCursor()

            cursor.onsuccess = (event) => {
                const cursor = event.target.result;

                if (cursor) {
                    if (cursor.value[indexName] === value) {
                        const res = objectStore.delete(cursor.key)
                        res.onsuccess = () => resolve(cursor.key)
                        res.onerror = (error) => reject(error)
                        return
                    }
                    cursor.continue();
                } else {
                    // Entries all displayed
                    resolve(null)
                }
            };
            cursor.onerror = (reason) => {
                reject(reason)
            }
        })
    }
    removeManyBy(indexName, value) {
        return new Promise((resolve, reject) => {
            const keysToDelete = []
            const objectStore = this.getObjectStore("readwrite")
            const cursor = objectStore.openCursor()

            cursor.onsuccess = (event) => {
                const cursor = event.target.result;

                if (cursor) {
                    if (cursor.value[indexName] === value) {
                        keysToDelete.push(cursor.key)
                    }
                    cursor.continue();
                } else {
                    // Entries all collected.
                    keysToDelete.forEach(async (key) => {
                        await new Promise((res, rej) => {
                            const req = objectStore.delete(key)
                            req.onsuccess = () => res(key)
                            req.onerror = (event) => rej(event)
                        })
                    })
                    resolve(keysToDelete)
                }
            };
            cursor.onerror = (reason) => {
                reject(reason)
            }
        })
    }
}
/*
async function test() {
  	const dbName = "TodoDatabase"
    const fields = [{name:"id", unique : true}, {name:"Col1", unique : false}, {name:"COl2", unique : false}]
    let da = new DataAdapter("My store", fields, dbName, 2)
    let p = new Promise((res, rej) => da.openDB(res, rej))
    await p
    console.log(da.getObjectStore("readwrite"))
    da.clearData()
    da.saveOne({"id" : "Moz", "Col1" : "Qwertyu", "COl2" : "zxcvbn"})
    
}
async function testMany() {
    const dbName = "TodoDatabase"
    const fields = [{name:"id", unique : true}, {name:"Col1", unique : false}, {name:"COl2", unique : false}]
    let da = new DataAdapter("My store", fields, dbName, 2)
    let p = new Promise((res, rej) => da.openDB(res, rej))
    await p
    da.clearData()
    const data = [
        {"id" : "T1", "Col1" : "Qwertyu", "COl2" : "zxcvbn"},
        {"id" : "T2", "Col1" : "Qwe", "COl2" : "ZXVBN"},
        {"id" : "T3", "Col1" : "POIUYtre", "COl2" : "lkjhgfd"},
    ].map(item => new Object(item))
    da.saveMany(data)
    da.removeMany(["T2", "T1"])
    da.loadAll()
        .then(record => console.log("Found record", record))
        .catch(console.error)
}
testMany()
*/