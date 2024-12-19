import DataAdapter from "../../DataAdapter/DataAdapter";

describe("Testing DataAdapter", () => {
    const onsuccessMock = jest.fn()
    const onerrorMock = jest.fn()
    const objectStoreMock = jest.fn()
    beforeAll(() => {
        // Mock the global indexedDB.open
        global.indexedDB = {
            open : jest.fn().mockImplementation(() => ({
                onupgradeneeded: null,
                onsuccess: onsuccessMock,
                onerror: onerrorMock,
                result: {
                  transaction: jest.fn(() => ({
                    objectStore: objectStoreMock,
                  })),
                },
            })),
            deleteDatabase : jest.fn(() => console.log("Database deleted"))
        }
    });
    afterAll(() => {
        jest.restoreAllMocks(); // Restore original implementations after tests
    });
    describe("Testing indexedDB mock", () => {
        it("Test 1 creation", () => {
            const openRequest = indexedDB.open("DB name", 9)//.mock.results[0].value;
            const expectedShape = {
                onsuccess : expect.any(Function),
                onerror : expect.any(Function),
                onupgradeneeded : null,
                result : {
                    transaction: expect.any(Function),
                }
            }

            expect(openRequest).toBeDefined();
            expect(openRequest).toEqual(expect.objectContaining(expectedShape));
            expect(indexedDB.open.mock.calls[0][0]).toBe("DB name")
            expect(indexedDB.open.mock.calls[0][1]).toBe(9)
            //console.dir(openRequest)
        })
    })
    describe("Testing creation", () => {
        it("Test 1 create", () => {
            const adapter = new DataAdapter("DB name", [{name : "field1", unique : false}, {name : "field2", unique : true}], "field2", 42)
            const expectedObject = {
                name : "DB name",
                version : 42,
                fields : [{name : "field1", unique : false}, {name : "field2", unique : true}],
                fieldNames : ["field1", "field2"],
                db : null,
                keyPath : "field2",
                dbName : "DB name"
            }

            expect(adapter).toBeDefined()
            expect(adapter).toEqual(expectedObject)
        })
        it.skip('should successfully save data to IndexedDB', async () => {
            /*
            const mockStoreAdd = jest.fn((data) => ({
                onsuccess: null,
                onerror: null,
            }));
        
            // Enhance the mocked open call to trigger events
            const openRequest = indexedDB.open.mock.results[0].value;
            openRequest.result.transaction.mockReturnValueOnce({
                objectStore: () => ({ add: mockStoreAdd }),
            });
        
            setTimeout(() => {
                openRequest.onsuccess({
                    target: { result: openRequest.result },
                });

                mockStoreAdd.mock.calls[0][0].onsuccess();
            }, 0);
        
            const result = await saveToIndexedDB('TestDB', 'TestStore', { name: 'John Doe' });

            // Validate the result and method calls
            expect(result).toBeDefined();
            expect(mockStoreAdd).toHaveBeenCalledWith({ name: 'John Doe' });
            */
        });
    })
    describe("Testing openning", () => {
        let upgradeneededEventMock = {
            currentTarget : {
                result : {
                    createObjectStore : jest.fn()
                }
            }
        }
        beforeAll(() => {
            global.indexedDB.open.mockClear()
        })
        it("Regular open only", async () => {
            const adapter = new DataAdapter("DB name in openDB", [{name : "field1", unique : true}, {name : "field2", unique : false}], "field1", 1)
            adapter.openDB()

            console.dir(global.indexedDB.open.mock.results[0]) // immitate slow openning of indexedDB
            await global.indexedDB.open.mock.results[0].value.onsuccess()

            expect(adapter.db).toBeDefined()
            expect(adapter.db.transaction).toBeDefined()
            expect(adapter.db.transaction).not.toBe(null)
        })
        it("Regular open and upgradeneeded (with keypath)", async () => {
            // prepare mocks:
            const createIndexMock = jest.fn().mockImplementationOnce(() => "indexObject")
            upgradeneededEventMock.currentTarget.result.createObjectStore.mockClear()
            upgradeneededEventMock.currentTarget.result.createObjectStore.mockImplementationOnce(() => ({createIndex : createIndexMock}))
            // call tested methods:
            const adapter = new DataAdapter("Regular open and upgradeneeded", [{name : "field1", unique : true}, {name : "field2", unique : false}], "field1", 1)
            const db = adapter.openDB()

            global.indexedDB.open.mock.results.at(-1).value.onupgradeneeded(upgradeneededEventMock)
            await global.indexedDB.open.mock.results.at(-1).value.onsuccess()
            // tests results:
            expect(db).resolves.toBeDefined()
            expect(db).resolves.toBe(adapter.db)
            expect(adapter.version).toBe(2)
            expect(upgradeneededEventMock.currentTarget.result.createObjectStore).toHaveBeenCalledTimes(1) // method was called only once
            expect(upgradeneededEventMock.currentTarget.result.createObjectStore.mock.calls.at(-1)[0]).toBe("Regular open and upgradeneeded")
            expect(upgradeneededEventMock.currentTarget.result.createObjectStore.mock.calls.at(-1)[1]).toEqual({keyPath: "field1"})
            expect(createIndexMock.mock.calls.length).toBe(2)
            expect(createIndexMock.mock.calls[0]).toEqual(["field1", "field1", {unique: true}])
            expect(createIndexMock.mock.calls[1]).toEqual(["field2", "field2", {unique: false}])
        })
        it("Regular open and upgradeneeded (without keypath)", async () => {
            // prepare mocks:
            const createIndexMock = jest.fn().mockImplementationOnce(() => "indexObject")
            upgradeneededEventMock.currentTarget.result.createObjectStore.mockClear()
            upgradeneededEventMock.currentTarget.result.createObjectStore.mockImplementationOnce(() => ({createIndex : createIndexMock}))
            // call tested methods:
            const adapter = new DataAdapter("Regular open and upgradeneeded (without keypath)", [{name : "field1", unique : true}, {name : "field2", unique : false}])
            const db = adapter.openDB()

            global.indexedDB.open.mock.results.at(-1).value.onupgradeneeded(upgradeneededEventMock)
            await global.indexedDB.open.mock.results.at(-1).value.onsuccess()
            // test results:
            expect(db).resolves.toBeDefined()
            expect(db).resolves.toBe(adapter.db)
            expect(adapter.keyPath).toBe("")
            expect(adapter.version).toBe(2)
            expect(upgradeneededEventMock.currentTarget.result.createObjectStore).toHaveBeenCalledTimes(1) // method was called only once
            expect(upgradeneededEventMock.currentTarget.result.createObjectStore.mock.calls.at(-1).length).toBe(1) // method was called only with one argument
            expect(upgradeneededEventMock.currentTarget.result.createObjectStore.mock.calls.at(-1)[0]).toBe("Regular open and upgradeneeded (without keypath)") // that one argument was the name of the object store
            expect(createIndexMock.mock.calls.length).toBe(2)
            expect(createIndexMock.mock.calls[0]).toEqual(["field1", "field1", {unique: true}])
            expect(createIndexMock.mock.calls[1]).toEqual(["field2", "field2", {unique: false}])
        })
        it("Regular open and onupgradeneeded (with error)", async () => {
            // prepare mocks:
            const errorMock = {target : { error : "Error when opening the indexedDB"}}
            const createIndexMock = jest.fn().mockImplementationOnce(() => "indexObject")
            upgradeneededEventMock.currentTarget.result.createObjectStore.mockClear()
            upgradeneededEventMock.currentTarget.result.createObjectStore.mockImplementationOnce(() => ({createIndex : createIndexMock}))            
            // call tested methods:
            const adapter = new DataAdapter("Regular open and onupgradeneeded (with error)", [{name : "field1", unique : true}, {name : "field2", unique : false}])
            const db = adapter.openDB()

            global.indexedDB.open.mock.results.at(-1).value.onupgradeneeded(upgradeneededEventMock)            
            try {
                global.indexedDB.open.mock.results.at(-1).value.onerror(errorMock)
                await db
            } catch(reason) {
                expect(reason).toBe(errorMock.target.error)
            }
            

            //expect(onerrorMock).toHaveBeenCalledTimes(1)
            //expect(db).rejects.toBe(errorMock.target.error)
            // even though the creation was failed with error, objects stores still have to be created, since onupgradeneeded method still was called:
            expect(adapter.keyPath).toBe("")
            expect(adapter.version).toBe(2)
            expect(upgradeneededEventMock.currentTarget.result.createObjectStore).toHaveBeenCalledTimes(1) // method was called only once
            expect(upgradeneededEventMock.currentTarget.result.createObjectStore.mock.calls.at(-1).length).toBe(1) // method was called only with one argument
            expect(upgradeneededEventMock.currentTarget.result.createObjectStore.mock.calls.at(-1)[0]).toBe("Regular open and onupgradeneeded (with error)") // that one argument was the name of the object store
            expect(createIndexMock.mock.calls.length).toBe(2)
            expect(createIndexMock.mock.calls[0]).toEqual(["field1", "field1", {unique: true}])
            expect(createIndexMock.mock.calls[1]).toEqual(["field2", "field2", {unique: false}])
        })
    })
    describe("Testing methods", () => {
        let upgradeneededEventMock = {
            currentTarget : {
                result : {
                    createObjectStore : jest.fn()
                }
            }
        }
        const createAndOpenAdapter = async (name) => {
            upgradeneededEventMock.currentTarget.result.createObjectStore.mockClear()
            upgradeneededEventMock.currentTarget.result.createObjectStore.mockImplementationOnce(() => ({createIndex : jest.fn()}))
            // calling tested methods:
            const adapter = new DataAdapter(name, [{name : "field1", unique : true}, {name : "field2", unique : false}])
            const db = adapter.openDB()

            global.indexedDB.open.mock.results.at(-1).value.onupgradeneeded(upgradeneededEventMock)
            await global.indexedDB.open.mock.results.at(-1).value.onsuccess()
            global.indexedDB.open.mock.results.at(-1).value.result.transaction.mockClear() // clear the transcation

            return adapter
        }
        it("Testing getObjectStore (readonly)", async () => {
            // preparing mocks
            const createIndexMock = jest.fn().mockImplementationOnce(() => "indexObject")
            objectStoreMock.mockClear()
            
            const adapter = await createAndOpenAdapter("Testing getObjectStore (readonly)")

            const store = adapter.getObjectStore("readonly")
            // testing results:
            expect(adapter.db.transaction).toBeDefined()
            expect(adapter.db.transaction).toHaveBeenCalledTimes(1) // transcation was called only once
            expect(adapter.db.transaction.mock.calls.at(-1)[0]).toBe("Testing getObjectStore (readonly)") // first agrumnet was name
            expect(adapter.db.transaction.mock.calls.at(-1)[1]).toBe("readonly") // second agrumnet was mode
            expect(objectStoreMock).toHaveBeenCalledTimes(1)
            expect(objectStoreMock.mock.calls.at(-1)[0]).toBe("Testing getObjectStore (readonly)") // was called with a single argument : name
            expect(objectStoreMock.mock.results.at(-1).value).toBe(store)
        })
        it("Testing getObjectStore (readwrite)", async () => {
            // preparing mocks:
            objectStoreMock.mockClear()
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing getObjectStore (readwrite)")

            const store = adapter.getObjectStore("readwrite")
            // testing results:
            expect(adapter.db.transaction).toBeDefined()
            expect(adapter.db.transaction).toHaveBeenCalledTimes(1) // transcation was called only once
            expect(adapter.db.transaction.mock.calls.at(-1)[0]).toBe("Testing getObjectStore (readwrite)") // first agrumnet was name
            expect(adapter.db.transaction.mock.calls.at(-1)[1]).toBe("readwrite") // second agrumnet was mode
        })
        it("Testing getIndex()", async () => {
            // preparing mocks:
            objectStoreMock.mockClear()
            objectStoreMock.mockImplementation(() => ({index : jest.fn()}))
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing getIndex()")
            const store = adapter.getObjectStore("readwrite")
            const index = adapter.getIndex(store, "field1")
            // testing results:
            const indexMock = objectStoreMock.mock.results.at(-1).value.index // just so I don't have to write this sequence every time
            expect(indexMock).toHaveBeenCalledTimes(1)
            expect(indexMock.mock.calls.at(-1)[0]).toBe("field1")
        })
        it("Testing getIndex() (with error)", async () => {
            // preparing mocks:
            objectStoreMock.mockClear()
            objectStoreMock.mockImplementation(() => ({index : jest.fn(() => {throw "<TAG ERROR>"})}))
            // calling tested methods:

            const adapter = await createAndOpenAdapter("Testing getIndex() (with error)")
            const store = adapter.getObjectStore("readwrite")
            try {
                adapter.getIndex(store, "field1")
            } catch (error) {
                // testing results:
                expect(error).toEqual(new Error("Index field1 does not exist in store Testing getIndex() (with error)"))
            }
        })
        it("Testing clearData()", async () => {
            // preparing mocks:
            const indexedDBClearMethodMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const getObjectStoreMock = jest.fn(() => ({clear : indexedDBClearMethodMock}))
            // calling tetsed methods:
            const adapter = await createAndOpenAdapter("Testing clearData()")

            adapter.getObjectStore = getObjectStoreMock
            const clearDataPromise = adapter.clearData()
            // testing results:
            expect(getObjectStoreMock).toHaveBeenCalledTimes(1)
            expect(indexedDBClearMethodMock).toHaveBeenCalledTimes(1)
            indexedDBClearMethodMock.mock.results.at(-1).value.onsuccess()
            expect(clearDataPromise).resolves.toBe(undefined) // promise, that was returned from the "clearData" method must be resolved (because "onsuccess" was called)
        })
        it("Testing clearData() (with error)", async () => {
            // preparing mocks:
            const errorTag = new Error("<TAG ERROR>")
            const indexedDBClearMethodMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const getObjectStoreMock = jest.fn(() => ({clear : indexedDBClearMethodMock}))
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing clearData() (with error)")
            adapter.getObjectStore = getObjectStoreMock
            const clearDataPromise = adapter.clearData()
            // testing results:
            expect(getObjectStoreMock).toHaveBeenCalledTimes(1)
            expect(indexedDBClearMethodMock).toHaveBeenCalledTimes(1)
            try {
                indexedDBClearMethodMock.mock.results.at(-1).value.onerror(errorTag)
                await clearDataPromise
            } catch(reason) {
                // handling error properly (rejecting promise, returned from "clearData()" method")
                expect(reason).toBe(errorTag)
            }
        })
    })
})