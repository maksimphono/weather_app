import DataManager from "../../DataManager/DataManager";

describe("Testing DataManager", () => {
    let forceResolve = null
    const dataAdapterMock = {
        openDB : jest.fn(() => (Promise.resolve(undefined)))
    }
    describe("Testing creation", () => {
        it("Test 1", async () => {
            const manager = new DataManager(dataAdapterMock, "<TAG VALUE>")
            //console.dir(manager.adapter.openDB.mock.results[0].value)
            await Promise.resolve() // so block "then" can be executed before all expects
            expect(manager).toBeDefined()
            expect(manager.adapter).toBe(dataAdapterMock)
            expect(manager.adapter.openDB).toHaveBeenCalledTimes(1)
            expect(manager.adapter.openDB.mock.results[0].value).resolves.toBe(undefined)
            expect(manager.url).toBe("<TAG VALUE>")
            expect(manager.ready).toBe(true)
        })
        // TODO: make testcase for failed DataManager creation
    })
    describe("Tseting methods", () => {
        
    })
})