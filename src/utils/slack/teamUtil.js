import Promise from 'bluebird';
import request from 'request';
import path from 'path';
import fs from 'fs';
import async from 'async';
import _ from 'lodash';
import Slack from 'slack-client';
import {
    EventEmitter
}
from 'events';
import commonUtil from '../commonUtil';


class SlackTeam extends EventEmitter {
    constructor(access_token, meta = false) {
        super();
        this.token = access_token;
        this.type = 'slack';
        this.fetchingHistory = [];
        this.messages = {};
        this.meta = meta;

        this.load();
    }

    load() {
        this.slack = new Slack(this.token, true, false);

        this.slack.on('open', () => {
            this.emit('logged-in');
            this.getTeaminfo();
            console.log('You are @', this.slack.self.name, 'of', this.slack.team.name);
        });

        this.slack.on('message', message => {
            this.addMessage(message.channel, {
                text: message.text,
                ts: message.ts,
                user: message.user,
                type: message.type
            });
        });

        this.slack.on('error', error => this.emit('error', error));

        this.slack.login();
    }

    fetchHistory(channel, start = 'now', count = 100) {
        this.fetchingHistory.push(channel)
        request('https://slack.com/api/channels.history?token=' + this.token + '&inclusive=1&channel=' + channel + '&count=' + count + '&unreads=1&latest=' + start, {
            json: true
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let history = body.messages ? body.messages.reverse() : [];
                if (!this.messages[channel]) this.messages[channel] = [];

                console.log(body)

                _.merge(this.messages[channel], history);
                this.emit('new:history', {
                    channel: channel,
                    team: this.slack.team.id
                })
            } else {
                console.error(err || resp.statusCode);
            }
            _.omit(this.fetchingHistory, channel);
        });
    }

    addMessage(channel, message) {
        if (!this.messages[channel]) this.messages[channel] = [];
        this.messages[channel].push(message);
        this.emit('new:message', Object.assign({
            channel: channel,
            team: this.slack.team.id
        }, message));
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
default SlackTeam;