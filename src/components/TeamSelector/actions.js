import Slack from 'slack-client';
import {
    app
}
from 'remote';
import path from 'path';
import alt from '../../alt';
import OAuthUtil from '../../utils/OAuthUtil';
import commonUtil from '../../utils/commonUtil';

const ConfPath = path.join(app.getPath('userData'), 'teams.conf');

console.log(ConfPath);

class TeamselectorActions {
    constructor() {
        this.generateActions(
            'added',
            'loggedin'
        );
    }

    add() {
        this.dispatch();

        return OAuthUtil.getAuthorization()
            .then(token => {
                var slackClient = new Slack(token.access_token, true, false);

                var slackObj = {
                    api: slackClient,
                    token: token
                };

                slackClient.on('open', () => {
                    let unreads = slackClient.getUnreadCount();

                    commonUtil.saveJson(ConfPath, token).then(() => {
                        this.actions.added(slackObj)
                    }).catch(e => {
                        console.error(e);
                    });

                    console.log('Welcome to Slack. You are @', slackClient.self.name, 'of', slackClient.team.name);
                    console.log('You have', unreads, 'unread', (unreads === 1) ? 'message' : 'messages');
                });
                slackClient.on('error', error => {
                    if (error) console.error("Error: " + error);
                });

                slackClient.login();
            })
            .catch(() => {

            });
    }


}

export
default alt.createActions(TeamselectorActions);