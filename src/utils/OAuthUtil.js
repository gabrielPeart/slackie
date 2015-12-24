import Promise from 'bluebird';
import request from 'request';
import slackAPI from 'slack-api';
import {
	remote
}
from 'electron';

const BrowserWindow = remote.BrowserWindow;

module.exports = {
	getAuthorization() {
		const authWindow = new BrowserWindow({
			'use-content-size': true,
			center: true,
			show: false,
			resizable: true,
			title: 'Slack authorize',
			'always-on-top': false,
			'standard-window': true,
			'auto-hide-menu-bar': true,
			'node-integration': false
		});

		const client_id = '8772351907.17263173446';

		const authUrl = 'https://slack.com/oauth/authorize?client_id=' + client_id + '&scope=client';

		authWindow.loadURL(authUrl);
		authWindow.show();

		authWindow.webContents.on('did-finish-load', () => authWindow.focus());

		return new Promise((resolve, reject) => {

			authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
				var raw_code = /code=([^&]*)/.exec(newUrl) || null,
					code = (raw_code && raw_code.length > 1) ? raw_code[1] : null,
					error = /\?error=(.+)$/.exec(newUrl);
				if (code || error)
					authWindow.close();
				if (code) {
					slackAPI.oauth.access({
						client_id: client_id,
						client_secret: 'a30268e78d0d54e930a67cd41333c409',
						code: code
					}, (err, token) => {
						if (err)
							return reject(err);
						resolve(token);
					});
				} else if (error) {
					reject();
				}
			});
		});
	},
};