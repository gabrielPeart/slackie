import Promise from 'bluebird';
import {
    remote
}
from 'electron';

const BrowserWindow = remote.BrowserWindow;

module.exports = {
    getAuthorization() {
        var authWindow = new BrowserWindow({
            'use-content-size': true,
            center: true,
            show: false,
            resizable: true,
            'always-on-top': false,
            'standard-window': true,
            'auto-hide-menu-bar': true,
            'node-integration': false
        });

        var client_id = '8772351907.17263173446';

        var authUrl = 'https://slack.com/oauth/authorize?client_id=' + client_id + '&scope=client';

        authWindow.loadUrl(authUrl);
        authWindow.show();

        return new Promise((resolve, reject) => {
            authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
                var raw_code = /code=([^&]*)/.exec(newUrl) || null,
                    code = (raw_code && raw_code.length > 1) ? raw_code[1] : null,
                    error = /\?error=(.+)$/.exec(newUrl);
                if (code || error)
                    authWindow.close();
                if (code) {
                    resolve(code)
                } else if (error) {
                    alert("Oops! Something went wrong and we couldn't log into slack. Please try again.");
                    reject();
                }
            });
        });
    },
};