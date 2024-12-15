import DataAdapter from "../../DataAdapter/DataAdapter";

describe("Testing DataAdapter", () => {
    const onsuccessMock = jest.fn()
    beforeAll(() => {
        // Mock the global indexedDB.open
        global.indexedDB = {
            open : jest.fn().mockImplementation(() => ({
                onupgradeneeded: null,
                onsuccess: onsuccessMock,
                onerror: null,
                result: {
                  transaction: jest.fn(() => ({
                    objectStore: jest.fn(() => ({
                      add: jest.fn((data) => `Added: ${JSON.stringify(data)}`),
                    })),
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
                onerror : null,
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
        it("Regular open and upgradeneeded", async () => {
            const createIndexMock = jest.fn().mockImplementationOnce(() => "indexObject")
            upgradeneededEventMock.currentTarget.result.createObjectStore.mockImplementationOnce(() => ({createIndex : createIndexMock}))
            const adapter = new DataAdapter("Regular open and upgradeneeded", [{name : "field1", unique : true}, {name : "field2", unique : false}], "field1", 1)
            const db = adapter.openDB()

            global.indexedDB.open.mock.results.at(-1).value.onupgradeneeded(upgradeneededEventMock)
            await global.indexedDB.open.mock.results.at(-1).value.onsuccess()

            expect(db).resolves.toBeDefined()
            expect(db).resolves.toBe(adapter.db)
            expect(adapter.version).toBe(2)
            expect(upgradeneededEventMock.currentTarget.result.createObjectStore.mock.calls.length).toBe(1)
            expect(upgradeneededEventMock.currentTarget.result.createObjectStore.mock.calls.at(-1)[0]).toBe("Regular open and upgradeneeded")
            expect(upgradeneededEventMock.currentTarget.result.createObjectStore.mock.calls.at(-1)[1]).toEqual({keyPath: "field1"})
            expect(createIndexMock.mock.calls.length).toBe(2)
            expect(createIndexMock.mock.calls[0]).toEqual(["field1", "field1", {unique: true}])
            expect(createIndexMock.mock.calls[1]).toEqual(["field2", "field2", {unique: false}])
        })
        //it("Regular open and onupgradeneeded (without)")
    })
    describe("Testing methods", () => {

    })
})