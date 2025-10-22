// chrome.sidePanel.setPanelBehavior({
//     openPanelOnActionClick: true
// }).catch((error) => console.error(error));

import info from '/info.mjs';
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({
        url: 'game.html'
    });
});

chrome.runtime.setUninstallURL(`${info.domain}/uninstall?i=${chrome.runtime.id}&n=${chrome.i18n.getMessage('extensionGameTitle')}&s=${info.symbolStr}&c=${info.category}`);

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.tabs.create({
            url: `${info.domain}/install?i=${chrome.runtime.id}&n=${chrome.i18n.getMessage('extensionGameTitle')}&s=${info.symbolStr}&c=${info.category}`
        });

        chrome.tabs.create({
            url: 'game.html'
        });
    }
});

