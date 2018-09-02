import getCurrentTab from './get-current-tab'

export const ERROR_ID = 'Tab requires `id` as a Number.'
export const ERROR_TYPE = 'Message requires `type` as a String.'
export const ERROR_LISTENER = 'Cannot add listener to `chrome.runtime.onMessage`.'

const valid = {
    tabId: id => {
        if (typeof id !== 'number') {
            throw ERROR_ID
        }
        return valid
    },
    type: type => {
        if (typeof type !== 'string') {
            throw ERROR_TYPE
        }
        return valid
    }
}

const sendToBack = (request, callback) => {
    valid.type(request && request.type)
    chrome.runtime.sendMessage(request, callback)
}

const sendToTab = (id, request, callback) => {
    valid.tabId(id).type(request && request.type)
    chrome.tabs.sendMessage(id, request, callback)
}

sendToTab.all = (request, callback) => {
    chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => sendToTab(tab.id, request, callback))
    })
}

sendToTab.current = (request, callback) => {
    getCurrentTab().then(tab => sendToTab(tab.id, request, callback))
}

const message = {
    on: (type, callback) => {
        valid.type(type)

        if (chrome.runtime.onMessage === undefined) {
            throw ERROR_LISTENER
        }
        chrome.runtime.onMessage.addListener((request, sender, response) => {
            if (callback && request.type === type) {
                callback(request, sender, response)
            }
        })
    },
    toBack: sendToBack,
    toTab: sendToTab
}

export default message
