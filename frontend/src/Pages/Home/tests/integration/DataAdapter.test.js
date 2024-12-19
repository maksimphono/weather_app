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
    describe.skip("Testing indexedDB mock", () => {
        it.skip("Test 1 creation", () => {
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
    describe.skip("Testing creation", () => {
        it.skip("Test 1 create", () => {
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
    describe.skip("Testing openning", () => {
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
        it.skip("Regular open only", async () => {
            const adapter = new DataAdapter("DB name in openDB", [{name : "field1", unique : true}, {name : "field2", unique : false}], "field1", 1)
            adapter.openDB()

            console.dir(global.indexedDB.open.mock.results[0]) // immitate slow openning of indexedDB
            await global.indexedDB.open.mock.results[0].value.onsuccess()

            expect(adapter.db).toBeDefined()
            expect(adapter.db.transaction).toBeDefined()
            expect(adapter.db.transaction).not.toBe(null)
        })
        it.skip("Regular open and upgradeneeded (with keypath)", async () => {
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
        it.skip("Regular open and upgradeneeded (without keypath)", async () => {
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
        it.skip("Regular open and onupgradeneeded (with error)", async () => {
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
            const adapter = new DataAdapter(name, [{name : "field1", unique : true}, {name : "field2", unique : false}], "field1")
            const db = adapter.openDB()

            global.indexedDB.open.mock.results.at(-1).value.onupgradeneeded(upgradeneededEventMock)
            await global.indexedDB.open.mock.results.at(-1).value.onsuccess()
            global.indexedDB.open.mock.results.at(-1).value.result.transaction.mockClear() // clear the transcation

            return adapter
        }
        it.skip("Testing getObjectStore (readonly)", async () => {
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
        it.skip("Testing getObjectStore (readwrite)", async () => {
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
        it.skip("Testing getIndex()", async () => {
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
        it.skip("Testing getIndex() (with error)", async () => {
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
        it.skip("Testing clearData()", async () => {
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
        it.skip("Testing clearData() (with error)", async () => {
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
        it.skip("Testing saveOne()", async () => {
            // preparing mocks:
            const entry = {field1 : "one", field2 : "two"}
            const indexedDB_put_MethodMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const getObjectStoreMock = jest.fn(() => ({put : indexedDB_put_MethodMock}))
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing saveOne()")
            adapter.getObjectStore = getObjectStoreMock
            const saveOnePromise = adapter.saveOne(entry)
            // testing results:
            expect(getObjectStoreMock).toHaveBeenCalledTimes(1)
            expect(indexedDB_put_MethodMock).toHaveBeenCalledTimes(1)
            expect(getObjectStoreMock.mock.calls[0][0]).toBe("readwrite")
            expect(indexedDB_put_MethodMock.mock.calls[0][0]).toEqual(entry)
            indexedDB_put_MethodMock.mock.results.at(-1).value.onsuccess()
            expect(saveOnePromise).resolves.toBeDefined()
        })
        it.skip("Testing saveOne() (with error)", async () => {
            // preparing mocks:
            const errorTag = {target : {error : "<TAG ERROR>"}}
            const entry = {field1 : "one", field3 : "two"}
            const indexedDB_put_MethodMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const getObjectStoreMock = jest.fn(() => ({put : indexedDB_put_MethodMock}))
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing saveOne() (with error)")
            adapter.getObjectStore = getObjectStoreMock
            const saveOnePromise = adapter.saveOne(entry)
            // testing results:
            expect(getObjectStoreMock).toHaveBeenCalledTimes(1)
            expect(indexedDB_put_MethodMock).toHaveBeenCalledTimes(1)
            expect(getObjectStoreMock.mock.calls[0][0]).toBe("readwrite")
            expect(indexedDB_put_MethodMock.mock.calls[0][0]).toEqual(entry)
            try {
                indexedDB_put_MethodMock.mock.results.at(-1).value.onerror(errorTag)
                await saveOnePromise
            } catch(reason) {
                expect(reason).toBe(errorTag.target.error)
            }
        })
        it.skip("Testing saveMany()", async () => {
            // preparing mocks:
            const entries = [{field1 : "one1", field2 : "two1"}, {field1 : "one2", field2 : "two2"},{field1 : "one3", field2 : "two3"}]
            const saveOneMock = jest.fn().mockResolvedValue()
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing saveMany()")
            adapter.saveOne = saveOneMock
            const saveManyPromise = adapter.saveMany(entries)
            // testing results:
            expect(saveOneMock).toHaveBeenCalledTimes(3)
            expect(saveOneMock.mock.calls[0][0]).toEqual(entries[0])
            expect(saveOneMock.mock.calls[1][0]).toEqual(entries[1])
            expect(saveOneMock.mock.calls[2][0]).toEqual(entries[2])
            expect(saveManyPromise).resolves.toBe(undefined)
        })
        it.skip("Testing loadOneBy() (by keypath with success)", async () => {
            // preparing mocks:
            const indexedDB_get_MethodMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const getObjectStoreMock = jest.fn(() => ({get : indexedDB_get_MethodMock, keyPath : "field1"}))
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing loadOneBy() (by keypath with success)")
            adapter.getObjectStore = getObjectStoreMock
            const loadOneByPromise = adapter.loadOneBy("field1", "one")

            expect(getObjectStoreMock).toHaveBeenCalledTimes(1)
            expect(indexedDB_get_MethodMock).toHaveBeenCalledTimes(1)
            indexedDB_get_MethodMock.mock.results[0].value.onsuccess({target : {result : "<TAG RESULT>"}})

            // testing results:    
            expect(loadOneByPromise).resolves.toBe("<TAG RESULT>")
        })
        it.skip("Testing loadOneBy() (with success)", async () => {
            // preparing mocks:
            const cursorContinueMock = jest.fn()
            const openCursorSuccessEvent = {
                target: { 
                    result: { 
                        value: { 
                            field1: "one",
                            field2: "two"
                        },
                        continue : cursorContinueMock
                    }
                },
            }
            const getObjectStoreMock = jest.fn(() => ({keyPath : "field1"}))
            const openCursorMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const getIndexMock = jest.fn(() => ({openCursor : openCursorMock}))
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing loadOneBy() (by keypath with error)")
            adapter.getObjectStore = getObjectStoreMock
            adapter.getIndex = getIndexMock
            const loadOneByPromise = adapter.loadOneBy("field2", "two")

            expect(getObjectStoreMock).toHaveBeenCalledTimes(1)
            expect(getIndexMock).toHaveBeenCalledTimes(1)
            expect(openCursorMock).toHaveBeenCalledTimes(1)
            openCursorMock.mock.results[0].value.onsuccess(openCursorSuccessEvent)
            expect(loadOneByPromise).resolves.toEqual({field1: "one", field2: "two"});
        })
        // TODO: create testcase for cursor.contine() method
        it.skip("Testing loadOneBy() (with error)", async () => {
            // preparing mocks:
            const getObjectStoreMock = jest.fn(() => ({keyPath : "field1"}))
            const openCursorMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const getIndexMock = jest.fn(() => ({openCursor : openCursorMock}))
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing loadOneBy() (with error)")
            adapter.getObjectStore = getObjectStoreMock
            adapter.getIndex = getIndexMock
            const loadOneByPromise = adapter.loadOneBy("field2", "two")

            expect(getObjectStoreMock).toHaveBeenCalledTimes(1)
            expect(getIndexMock).toHaveBeenCalledTimes(1)
            expect(openCursorMock).toHaveBeenCalledTimes(1)
            try {
                openCursorMock.mock.results[0].value.onerror("<TAG ERROR>")
                await loadOneByPromise
            } catch(reason) {
                expect(reason).toBe("<TAG ERROR>")
            }
        })
        it.skip("Testing loadManyBy() (with success)", async () => {
            // preparing mocks:
            const cursorContinueMock = jest.fn()
            const openCursorSuccessEvents = [
                {
                    target: { 
                        result: { 
                            value: { 
                                field1: "one1",
                                field2: "two"
                            },
                            continue : cursorContinueMock
                        }
                    },
                },
                {
                    target: { 
                        result: { 
                            value: { 
                                field1: "one2",
                                field2: "two"
                            },
                            continue : cursorContinueMock
                        }
                    },
                },
                {
                    target: { 
                        result: { 
                            value: { 
                                field1: "one3",
                                field2: "tw"
                            },
                            continue : cursorContinueMock
                        }
                    },
                },
                {
                    target: { 
                        result: null
                    },
                }
            ]
            const getObjectStoreMock = jest.fn(() => ({keyPath : "field1"}))
            const openCursorMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const getIndexMock = jest.fn(() => ({openCursor : openCursorMock}))
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing loadOneBy() (by keypath with error)")
            adapter.getObjectStore = getObjectStoreMock
            adapter.getIndex = getIndexMock
            const loadManyByPromise = adapter.loadManyBy("field2", "two")

            expect(getObjectStoreMock).toHaveBeenCalledTimes(1)
            expect(getIndexMock).toHaveBeenCalledTimes(1)
            expect(openCursorMock).toHaveBeenCalledTimes(1)

            for (let event of openCursorSuccessEvents) {
                openCursorMock.mock.results[0].value.onsuccess(event)
            }

            expect(cursorContinueMock).toHaveBeenCalledTimes(3)
            expect(loadManyByPromise).resolves.toEqual([openCursorSuccessEvents[0].target.result.value, openCursorSuccessEvents[1].target.result.value]);
        })
        it.skip("Testing loadManyBy() (with success and error)", async () => {
            // preparing mocks:
            const cursorContinueMock = jest.fn()
            const openCursorSuccessEvent = {    target: {         result: {             value: {                 field1: "one1",                field2: "two"            },            continue : cursorContinueMock        }    },}
            const getObjectStoreMock = jest.fn(() => ({keyPath : "field1"}))
            const openCursorMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const getIndexMock = jest.fn(() => ({openCursor : openCursorMock}))
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing loadManyBy() (with success and error)")
            adapter.getObjectStore = getObjectStoreMock
            adapter.getIndex = getIndexMock
            const loadManyByPromise = adapter.loadManyBy("field2", "two")

            expect(getObjectStoreMock).toHaveBeenCalledTimes(1)
            expect(getIndexMock).toHaveBeenCalledTimes(1)
            expect(openCursorMock).toHaveBeenCalledTimes(1)

            openCursorMock.mock.results[0].value.onsuccess(openCursorSuccessEvent)
            try {
                openCursorMock.mock.results[0].value.onerror("<TAG ERROR>")
                await loadManyByPromise
            } catch(reason) {
                expect(reason).toBe("<TAG ERROR>")
                expect(cursorContinueMock).toHaveBeenCalledTimes(1)
            }
        })
        it.skip("Testing loadAll() (with success)", async () => {
            // preparing mocks:
            const cursorContinueMock = jest.fn()
            const openCursorSuccessEvents = [
                {
                    target: { 
                        result: { 
                            value: { 
                                field1: "one1",
                                field2: "two"
                            },
                            continue : cursorContinueMock
                        }
                    },
                },
                {
                    target: { 
                        result: { 
                            value: { 
                                field1: "one2",
                                field2: "tw"
                            },
                            continue : cursorContinueMock
                        }
                    },
                },
                {
                    target: { 
                        result: null
                    },
                }
            ]
            const openCursorMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const getObjectStoreMock = jest.fn(() => ({keyPath : "field1", openCursor : openCursorMock}))
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing loadAll() (with success)")
            adapter.getObjectStore = getObjectStoreMock
            const loadAllPromise = adapter.loadAll()

            // check if internal methods were called correctly:
            expect(getObjectStoreMock).toHaveBeenCalledTimes(1)
            expect(openCursorMock).toHaveBeenCalledTimes(1)
            // imitate cursor behaviour:
            for (let event of openCursorSuccessEvents) {
                openCursorMock.mock.results[0].value.onsuccess(event)
            }
            // check if resolved value is correct
            expect(cursorContinueMock).toHaveBeenCalledTimes(2)
            expect(loadAllPromise).resolves.toEqual([openCursorSuccessEvents[0].target.result.value, openCursorSuccessEvents[1].target.result.value]);
        })
        it.skip("Testing loadAll() (with success and error)", async () => {
            // preparing mocks:
            const cursorContinueMock = jest.fn()
            const openCursorSuccessEvent = { target: {  result: {  value: {  field1: "one1", field2: "two" }, continue : cursorContinueMock } },}
            const openCursorMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const getObjectStoreMock = jest.fn(() => ({keyPath : "field1", openCursor : openCursorMock}))
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing loadAll() (with success)")
            adapter.getObjectStore = getObjectStoreMock
            const loadAllPromise = adapter.loadAll()

            // check if internal methods were called correctly:
            expect(getObjectStoreMock).toHaveBeenCalledTimes(1)
            expect(openCursorMock).toHaveBeenCalledTimes(1)
            // imitate cursor behaviour:
            openCursorMock.mock.results[0].value.onsuccess(openCursorSuccessEvent)
            try {
                openCursorMock.mock.results[0].value.onerror({target : "<TAG ERROR>"})
                await loadAllPromise
            } catch(reason) {
                // check if resolved value is correct
                expect(cursorContinueMock).toHaveBeenCalledTimes(1)
                expect(reason).toBe("<TAG ERROR>")
            }
        })
        it.skip("Testing removeOneBy() (by keypath with success)", async () => {
            // preparing mocks:
            const deleteMethodMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const getObjectStoreMock = jest.fn(() => ({keyPath : "field1", delete : deleteMethodMock}))
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing loadOneBy() (by keypath with error)")
            adapter.getObjectStore = getObjectStoreMock
            const removeOneBy_promise = adapter.removeOneBy("field1", "one")

            expect(getObjectStoreMock).toHaveBeenCalledTimes(1)
            expect(deleteMethodMock).toHaveBeenCalledTimes(1)
            expect(deleteMethodMock.mock.calls[0][0]).toEqual("one")
            deleteMethodMock.mock.results[0].value.onsuccess({target : {result : "<TAG RESULT>"}})
            expect(removeOneBy_promise).resolves.toBe("<TAG RESULT>");
        })
        it.skip("Testing removeOneBy() (by keypath with error)", async () => {
            // preparing mocks:
            const deleteMethodMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const getObjectStoreMock = jest.fn(() => ({keyPath : "field1", delete : deleteMethodMock}))
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing loadOneBy() (by keypath with error)")
            adapter.getObjectStore = getObjectStoreMock
            const removeOneBy_promise = adapter.removeOneBy("field1", "one")

            expect(getObjectStoreMock).toHaveBeenCalledTimes(1)
            expect(deleteMethodMock).toHaveBeenCalledTimes(1)
            expect(deleteMethodMock.mock.calls[0][0]).toEqual("one")
            
            try {
                deleteMethodMock.mock.results[0].value.onerror({target : {error : "<TAG ERROR>"}})
                await removeOneBy_promise
            } catch(reason) {
                expect(reason).toBe("<TAG ERROR>");
            }
        })
        it.skip("Testing removeOneBy() (with success)", async () => {
            // preparing mocks:
            const cursorContinueMock = jest.fn()
            const openCursorSuccessEvents = [
                { 
                    target: {  
                        result: {  
                            value: {  
                                field1: "one1", 
                                field2: "tw" 
                            }, 
                            continue : cursorContinueMock,
                            key : "one1"
                        } 
                    },
                },
                { 
                    target: {  
                        result: {  
                            value: {  
                                field1: "one2", 
                                field2: "two" 
                            }, 
                            continue : cursorContinueMock,
                            key : "one2"
                        } 
                    },
                },
                { 
                    target: {  
                        result: null
                    },
                },
            ]
            const deleteMoethodMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const openCursorMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const getObjectStoreMock = jest.fn(() => ({keyPath : "field1", openCursor : openCursorMock, delete : deleteMoethodMock}))
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing loadAll() (with success)")
            adapter.getObjectStore = getObjectStoreMock
            const removeOne_promise = adapter.removeOneBy("field2", "two")

            // check if internal methods were called correctly:
            expect(getObjectStoreMock).toHaveBeenCalledTimes(1)
            expect(openCursorMock).toHaveBeenCalledTimes(1)
            // imitate cursor behaviour:
            for (let event of openCursorSuccessEvents) {
                openCursorMock.mock.results[0].value.onsuccess(event)
            }
            expect(cursorContinueMock).toHaveBeenCalledTimes(1)
            expect(deleteMoethodMock).toHaveBeenCalledTimes(1)
            expect(deleteMoethodMock.mock.calls[0][0]).toBe("one2")
            deleteMoethodMock.mock.results[0].value.onsuccess()
            expect(removeOne_promise).resolves.toBeDefined() // the promise is resolved correctly
        })
        it.skip("Testing removeOneBy() (with success and error when deleting)", async () => {
            // preparing mocks:
            const cursorContinueMock = jest.fn()
            const openCursorSuccessEvent = { target: {  result: {  value: {  field1: "one1", field2: "two" }, continue : cursorContinueMock,key : "one1"} },}
            const deleteMoethodMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const openCursorMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const getObjectStoreMock = jest.fn(() => ({keyPath : "field1", openCursor : openCursorMock, delete : deleteMoethodMock}))
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing removeOneBy() (with success and error when deleting)")
            adapter.getObjectStore = getObjectStoreMock
            const removeOne_promise = adapter.removeOneBy("field2", "two")

            // check if internal methods were called correctly:
            expect(getObjectStoreMock).toHaveBeenCalledTimes(1)
            expect(openCursorMock).toHaveBeenCalledTimes(1)
            // imitate cursor behaviour:
            openCursorMock.mock.results[0].value.onsuccess(openCursorSuccessEvent)
            expect(deleteMoethodMock).toHaveBeenCalledTimes(1)
            expect(deleteMoethodMock.mock.calls[0][0]).toBe("one1")

            try {
                deleteMoethodMock.mock.results[0].value.onerror("<TAG ERROR>")
                await removeOne_promise
            } catch(reason) {
                expect(reason).toBe("<TAG ERROR>")
            }
        })
        it.skip("Testing removeOneBy() (with error)", async () => {
            // preparing mocks:
            const cursorContinueMock = jest.fn()
            const openCursorSuccessEvent = { target: {  result: {  value: {  field1: "one1", field2: "two" }, continue : cursorContinueMock,key : "one1"} },}
            const deleteMoethodMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const openCursorMock = jest.fn(() => ({onsuccess : null, onerror : null}))
            const getObjectStoreMock = jest.fn(() => ({keyPath : "field1", openCursor : openCursorMock, delete : deleteMoethodMock}))
            // calling tested methods:
            const adapter = await createAndOpenAdapter("Testing removeOneBy() (with success and error when deleting)")
            adapter.getObjectStore = getObjectStoreMock
            const removeOne_promise = adapter.removeOneBy("field2", "two")

            // check if internal methods were called correctly:
            expect(getObjectStoreMock).toHaveBeenCalledTimes(1)
            expect(openCursorMock).toHaveBeenCalledTimes(1)
            // imitate cursor behaviour:

            try {
                openCursorMock.mock.results[0].value.onerror("<TAG ERROR>")
                await removeOne_promise
            } catch(reason) {
                expect(reason).toBe("<TAG ERROR>")
            }
        })
    })
})