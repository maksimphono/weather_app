import DataManager from "../../DataManager/DataManager";

describe("Testing DataManager", () => {
    let forceResolve = null
    const dataAdapterMock = {
        openDB : jest.fn(() => (Promise.resolve(undefined))),
        loadOneBy : jest.fn(),
        saveOne : jest.fn(),
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
    describe("Testing methods", () => {
        let manager = null
        beforeAll(async () => {
            manager = new DataManager(dataAdapterMock, "https://testurl.com")
            await Promise.resolve() // to let "then" block run
        })
        it('isOverdue() (overdue)', () => {
            const entry = { due_dt: Date.now() - 1000 };
            expect(manager.isOverdue(entry)).toBe(true);
        });
        it('isOverdue() (not overdue)', () => {
            const entry = { due_dt: Date.now() + 1000 };
            expect(manager.isOverdue(entry)).toBe(false);
        });
        it('isOverdue() (missing "due_dt")', () => {
            const entry = {};
            expect(manager.isOverdue(entry)).toBe(false);
        });
        it('setOverdue()', () => {
            const entry = { data: 'test' };
            const date = new Date('2023-01-01');
            const result = manager.setOverdue(date, entry);
            expect(result).toEqual({ ...entry, due_dt: date });
        });
        describe('fetch()', () => {
            beforeEach(() => {
                global.fetch = jest.fn();
            });
        
            afterEach(() => {
                global.fetch.mockClear();
                delete global.fetch;
            });
        
            it('should call fetch with correct URL and params', async () => {
                global.fetch.mockResolvedValueOnce('<TAG RESPONSE>');
                const params = { param1: 'value1' };
                await manager.fetch(params);
                expect(global.fetch).toHaveBeenCalledTimes(1)
                expect(global.fetch.mock.calls[0][0]).toBe(`https://testurl.com?param1=value1&appid=${process.env.REACT_APP_API_KEY}`)
            });
        
            it('should throw an error if fetch fails', async () => {
                global.fetch.mockRejectedValueOnce(new Error('Fetch failed'));
                await expect(manager.fetch({})).rejects.toThrow('Fetch failed');
            });
        });
        describe('Testing loadOneBy()', () => {
            it('should call adapter.loadOneBy with correct parameters', async () => {
                dataAdapterMock.loadOneBy.mockResolvedValueOnce("<TAG RESULT>");
                const result = await manager.loadOneBy('field1', 'one');
                expect(dataAdapterMock.loadOneBy).toHaveBeenCalledTimes(1)
                expect(dataAdapterMock.loadOneBy.mock.calls[0]).toEqual(["field1", "one"]);
                expect(result).toBe("<TAG RESULT>");
            });
            it('should throw an error if adapter.loadOneBy fails', async () => {
                dataAdapterMock.loadOneBy.mockRejectedValueOnce(new Error("<TAG ERROR>"));
                await expect(manager.loadOneBy("field1", "one")).rejects.toThrow('<TAG ERROR>');
            });
        });
    })
})