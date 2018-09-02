const queryInfo = {
    currentWindow: true,
    active: true
}

function getCurrentTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query(queryInfo, tabs => {
            if (tabs.length > 0) {
                resolve(tabs[0])
            } else {
                reject(tabs)
            }
        })
    })
}

export default getCurrentTab
