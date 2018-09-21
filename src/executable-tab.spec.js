import { exec } from './executable-tab'

const VOID = { code: 'void(0)' }
const CORRECT = 'correct'
const INCORRECT = 'Incorrect tab'

global.chrome = {
    runtime: {
        lastError: null
    },
    tabs: {
        executeScript: jest.fn((tabId, VOID, fn) => fn())
    }
}

describe('exec()', () => {
    beforeEach(() => {
        global.chrome.tabs.executeScript.mockClear()
        global.chrome.runtime.lastError = null
    })

    const tabId = 10
    const tab = { id: tabId }
    const defaultArgs = [tabId, VOID, expect.any(Function)]
    const errorMessage = 'error'

    it('should reject to incorrect tab', async () => {
        await expect(exec()).rejects.toBe(INCORRECT)
        await expect(exec({ id: 'string' })).rejects.toBe(INCORRECT)
        await expect(exec({ id: -1 })).rejects.toBe(INCORRECT)
    })

    it('should reject with error message', async () => {
        global.chrome.runtime.lastError = {
            message: errorMessage
        }
        await expect(exec(tab)).rejects.toBe(errorMessage)
        expect(global.chrome.tabs.executeScript).toHaveBeenLastCalledWith(
            ...defaultArgs
        )
    })

    it('should resolve with tab id', async () => {
        await expect(exec(tab)).resolves.toBe(tabId)
        expect(global.chrome.tabs.executeScript).toHaveBeenLastCalledWith(
            ...defaultArgs
        )
    })

    it('should memoize correct value', async () => {
        const memo = {}
        await exec(tab, memo)
        expect(memo).toEqual({ '10': CORRECT })
    })

    it('should memoize incorrect value', async () => {})
    it('should return memoized correct value', async () => {})
    it('should return memoized incorrect value', async () => {})
    it('should use hostname as a memo prop', async () => {})
})
