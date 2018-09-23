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

const silently = () => {/*o_O*/}
const errorMessage = 'error_value'
const forceError = () => {
    global.chrome.runtime.lastError = {
        message: errorMessage
    }
}

describe('exec()', () => {
    beforeEach(() => {
        global.chrome.tabs.executeScript.mockClear()
        global.chrome.runtime.lastError = null
    })

    const tabId = 10
    const tab = { id: tabId }
    const tabWithUrl = { id: tabId, url: 'path_url'}
    const defaultArgs = [tabId, VOID, expect.any(Function)]

    it('should reject to incorrect tab', async () => {
        await expect(exec()).rejects.toBe(INCORRECT)
        await expect(exec({ id: 'string' })).rejects.toBe(INCORRECT)
        await expect(exec({ id: -1 })).rejects.toBe(INCORRECT)
    })

    it('should resolve with tab id', async () => {
        await expect(exec(tab)).resolves.toBe(tabId)
        expect(global.chrome.tabs.executeScript)
            .toHaveBeenLastCalledWith(...defaultArgs)
    })

    it('should reject with error message', async () => {
        forceError()
        await expect(exec(tab)).rejects.toBe(errorMessage)
        expect(global.chrome.tabs.executeScript)
            .toHaveBeenLastCalledWith(...defaultArgs)
    })

    it('should memoize correct value', async () => {
        const memo = {}
        await exec(tab, memo)
        expect(memo).toEqual({ '10': CORRECT })
    })

    it('should memoize incorrect value', async () => {
        forceError()
        const memo = {}
        await exec(tab, memo).catch(silently)
        expect(memo).toEqual({ '10': errorMessage })
    })

    it('should return memoized correct value', async () => {
        const memo = {}
        await exec(tab, memo)
        await exec(tab, memo)
        expect(global.chrome.tabs.executeScript)
            .toHaveBeenCalledTimes(1)
    })

    it('should return memoized incorrect value', async () => {
        forceError()
        const memo = {}
        await exec(tab, memo).catch(silently)
        await exec(tab, memo).catch(silently)
        expect(global.chrome.tabs.executeScript)
            .toHaveBeenCalledTimes(1)
    })

    it('should use hostname as a memo prop', async () => {
        const memo = {}
        const hostname = 'hostname_url'
        document.createElement = jest.fn(() => ({
            href: null,
            hostname
        }))
        await exec(tabWithUrl, memo)
        expect(memo).toEqual({ [hostname]: CORRECT })
    })
})
