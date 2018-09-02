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
        expect(handler).toHaveBeenCalledWith(request, sender, response)
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
        expect(sendMessage).toHaveBeenCalledWith(request, callback)
    })
})
