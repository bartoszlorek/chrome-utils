import message, { ERROR_ID, ERROR_TYPE, ERROR_LISTENER } from './message'

describe('.on()', () => {
    beforeEach(() => {
        global.chrome = {
            runtime: {
                onMessage: {
                    addListener: jest.fn()
                }
            }
        }
    })

    const registerListener = (request, sender, response) => {
        global.chrome.runtime.onMessage.addListener = jest.fn(listener => {
            listener(request, sender, response)
        })
    }

    it('should throw error for incorrect type', () => {
        expect(() => message.on()).toThrow(ERROR_TYPE)
    })

    it('should throw error for incorrect runtime', () => {
        global.chrome.runtime = {}
        expect(() => message.on('sign')).toThrow(ERROR_LISTENER)
    })

    it('should add listener to runtime onMessage', () => {
        message.on('sign', jest.fn())
        expect(global.chrome.runtime.onMessage.addListener)
            .toHaveBeenCalledTimes(1)
    })

    it('should call callback function for specific type', () => {
        const request = { type: 'sign' }
        const sender = 1234
        const response = jest.fn()
        registerListener(request, sender, response)

        const handler = jest.fn()
        message.on('sign', handler)
        expect(handler).toHaveBeenCalledTimes(1)
        expect(handler).toHaveBeenLastCalledWith(request, sender, response)
    })

    it('should not call callback function for other types', () => {
        const request = { type: 'login' }
        const sender = 1234
        const response = jest.fn()
        registerListener(request, sender, response)

        const handler = jest.fn()
        message.on('sign', handler)
        expect(handler).toHaveBeenCalledTimes(0)
    })
})

describe('.toBack()', () => {
    beforeEach(() => {
        global.chrome = {
            runtime: {
                sendMessage: jest.fn()
            }
        }
    })

    it('should throw error for incorrect type', () => {
        expect(() => message.toBack()).toThrow(ERROR_TYPE)
    })

    it('should send message to background page', () => {
        const { sendMessage } = global.chrome.runtime
        const request = { type: 'SIGN', data: 'user' }
        const callback = jest.fn()

        message.toBack(request, callback)
        expect(sendMessage).toHaveBeenCalledTimes(1)
        expect(sendMessage).toHaveBeenLastCalledWith(request, callback)
    })
})

describe('.toTab()', () => {
    beforeEach(() => {
        global.chrome = {
            tabs: {
                sendMessage: jest.fn()
            }
        }
    })

    it('should throw error for incorrect type', () => {
        expect(() => message.toTab()).toThrow(ERROR_ID)
    })

    it('should send message to tab', () => {
        const { sendMessage } = global.chrome.tabs
        const id = 10
        const request = { type: 'SIGN', data: 'user' }
        const callback = jest.fn()

        message.toTab(id, request, callback)
        expect(sendMessage).toHaveBeenCalledTimes(1)
        expect(sendMessage).toHaveBeenLastCalledWith(id, request, callback)
    })

    it('should send message to all tab', () => {
        global.chrome.tabs.query = jest.fn((info, fn) => fn([
            { id: 0 },
            { id: 1 },
            { id: 2 }
        ]))
        const { sendMessage } = global.chrome.tabs
        const request = { type: 'SIGN', data: 'user' }
        const callback = jest.fn()

        message.toTab.all(request, callback)
        expect(sendMessage).toHaveBeenCalledTimes(3)
        expect(sendMessage.mock.calls).toEqual([
            [0, request, callback],
            [1, request, callback],
            [2, request, callback]
        ])
    })

    it('should send message to current tab', async () => {
        global.chrome.tabs.query = jest.fn((info, fn) => fn([{ id: 4 }]))
        const { sendMessage } = global.chrome.tabs
        const request = { type: 'SIGN', data: 'user' }
        const callback = jest.fn()

        await message.toTab.current(request, callback)
        expect(sendMessage).toHaveBeenCalledTimes(1)
        expect(sendMessage.mock.calls).toEqual([
            [4, request, callback]
        ])
    })
})
