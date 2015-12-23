import Promise from 'bluebird';
import {
    BrowserWindow
}
from 'remote';


module.exports = {
    getAuthorization() {
        var authWindow = new browserWindow({
            'use-content-size': true,
            center: true,
            show: false,
            resizable: true,
            'always-on-top': true,
            'standard-window': true,
            'auto-hide-menu-bar': true,
            'node-integration': false
        });

        var scopes = [
            'channels:write',
            'channels:history',
            'channels:read',

            'chat:write:user',

            'emoji:read',
            'files:read',

            'groups:write',
            'groups:history',
            'groups:read',

            'im:write',
            'im:history',
            'im:read',

            'mpim:write',
            'mpim:history',
            'mpim:read',

            'pins:write',
            'pins:read'
        ];

        var authUrl = 'https://slack.com/oauth/authorize?client_id=' + client_id + '&scope=' + scopes.join('%3A');

        console.log(authUrl);


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

                    console.log(code);


                } else if (error) {
                    alert("Oops! Something went wrong and we couldn't log into slack. Please try again.");
                }
            });
        });
    },
};