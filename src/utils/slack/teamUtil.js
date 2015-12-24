import Promise from 'bluebird';
import request from 'request';
import Slack from 'slack-client';
import {
    EventEmitter
}
from 'events';


class Team extends EventEmitter {
    constructor(access_token, meta = false) {
        super();
        this.token = access_token;

        this.meta = meta;

        this.slack = new Slack(access_token, true, false);

        this.slack.on('open', () => {

            this.emit('logged-in');

            let unreads = this.slack.getUnreadCount();

            console.log('Welcome to Slack. You are @', this.slack.self.name, 'of', this.slack.team.name);
            console.log('You have', unreads, 'unread', (unreads === 1) ? 'message' : 'messages');

            this.getTeaminfo();
        });

        this.slack.on('error', error => this.emit('error', error));

        this.slack.login();
    }

    getTeaminfo() {
        request('https://slack.com/api/team.info?token=' + this.token, {
            json: true
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                this.meta = body.team;
                this.emit('meta-refreshed', body.team);
            } else {
                console.error(err || resp.statusCode);
            }
        });
    }
}



export
default Team;