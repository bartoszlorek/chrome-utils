import getCurrentTab from './get-current-tab'

global.chrome = {
    tabs: {
        query: jest.fn()
    }
}

const queryInfo = {
    currentWindow: true,
    active: true
}
const tabs = [
    { id: 0 },
    { id: 1 },
    { id: 2 }
]

describe('.get-current-tab()', () => {
    beforeEach(() => {
        global.chrome.tabs.query.mockReset()
    })

    it('should resolve with tabs object', async () => {
        global.chrome.tabs.query.mockImplementation((info, fn) => fn(tabs))

        await expect(getCurrentTab()).resolves.toBe(tabs[0])
        expect(global.chrome.tabs.query).toHaveBeenLastCalledWith(
            queryInfo,
            expect.any(Function)
        )
    })

    it('should reject with empty tabs', async () => {
        global.chrome.tabs.query.mockImplementation((info, fn) => fn([]))

        await expect(getCurrentTab()).rejects.toEqual([])
        expect(global.chrome.tabs.query).toHaveBeenLastCalledWith(
            queryInfo,
            expect.any(Function)
        )
    })
})
