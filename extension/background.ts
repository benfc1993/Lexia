chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: 'OFF'
    })
})
chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'lexia') {
        const tabId = (await chrome.tabs.query({ active: true }))[0].id ?? 0
        chrome.scripting.insertCSS({ target: { tabId }, files: ['scroll.css'] })
        chrome.scripting
            .executeScript({
                target: {
                    tabId,

                    allFrames: true
                },
                files: ['src/scroll.js']
            })
            .then(() => console.log('scripting added'))
    }
})
chrome.runtime.onMessage.addListener(async (request) => {
    if (request === 'run') {
        const tabId = (await chrome.tabs.query({ active: true }))[0].id ?? 0
        chrome.scripting.insertCSS({ target: { tabId }, files: ['lexia.css'] })
        chrome.scripting
            .executeScript({
                target: {
                    tabId,

                    allFrames: true
                },
                files: ['src/lexia.js']
            })
            .then(() => console.log('scripting added'))
    }
    if (request === 'start-scroll') {
        const tabId = (await chrome.tabs.query({ active: true }))[0].id ?? 0
        chrome.scripting.insertCSS({ target: { tabId }, files: ['scroll.css'] })
        chrome.scripting
            .executeScript({
                target: {
                    tabId,

                    allFrames: true
                },
                files: ['src/scroll.js']
            })
            .then(() => console.log('scripting added'))
    }
})
